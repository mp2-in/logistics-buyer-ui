import dayjs from 'dayjs'
import { useState } from 'react';
import sortBlackDownIcon from "@assets/sort_black_down.png"
import sortBlackUpIcon from "@assets/sort_black_up.png"
import sortGreyDownIcon from "@assets/sort_grey_down.png"
import sortGreyUpIcon from "@assets/sort_grey_up.png"
import trackIcon from "@assets/track.png"
import cancelIcon from "@assets/cancel.png"

import { Order } from '@lib/interfaces'

import { cancellable, trimTextValue } from '@lib/utils';


const HeaderField = ({ cssClass, label, sort, hidden, onClick }: { cssClass: string, label: string, sort?: 'asc' | 'dsc', hidden?: boolean, onClick: () => void }) => {
    return <div className={`${cssClass} ${hidden ? 'hidden xl:flex' : 'flex'} items-center cursor-pointer justify-center`} onClick={onClick}>
        <p className='mx-2'>{label}</p>
        <div className={'flex-col items-center'}>
            <img src={sort === 'asc' ? sortBlackUpIcon : sortGreyUpIcon} className='w-2 mb-1' />
            <img src={sort === 'dsc' ? sortBlackDownIcon : sortGreyDownIcon} className='w-2' />
        </div>
    </div>
}


export default ({ orders, onCancelOrder }: { orders: Order[], onCancelOrder: (orderId: string) => void }) => {

    const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('dsc')
    const [sortField, setSortField] = useState<keyof Order>('createdAt')

    const rowBackground = (orderState: string) => {
        return ['Order-picked-up', "Out-for-delivery", "At-delivery"].includes(orderState) ? 'bg-emerald-50' : orderState === 'Order-delivered' ?
            'bg-green-100' : orderState === 'Cancelled' ? 'bg-red-100' : orderState === 'RTO-Delivered' ? 'bg-orange-100' : ''
    }

    const mapLink = (order: Order): string | undefined => {
        if (order.pickupLatitude && order.pickupLongitude && order.dropLatitude && order.dropLongitude) {
            return `https://www.google.com/maps/dir/?api=1&origin=${order.pickupLatitude},${order.pickupLongitude}&destination=${order.dropLatitude},${order.dropLongitude}&travelmode=driving`
        }
    }

    const updateSortField = (field: keyof Order) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'dsc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('dsc')
        }
    }

    return <div className={`absolute left-0 right-0 top-14 bottom-14 lg:px-5 px-2 md:top-[70px]`} >
        <div className='absolute top-[15px] left-2 right-2 bottom-1 overflow-auto md:top-[195px] lg:top-[130px] 2xl:top-[130px]'>
            <div className={`flex items-center bg-blue-300 *:text-center *:font-medium  *:text-sm xl:*:text-sm w-[1265px] xl:w-full`}>
                <HeaderField cssClass='flex-[3] ml-0 bg-blue-300 py-2 pl-1' label='Creation' sort={sortField === 'createdAt' ? sortOrder : undefined} onClick={() => updateSortField('createdAt')} />
                <HeaderField cssClass='flex-[6] bg-blue-300 py-2' label='Bill Number' sort={sortField === 'orderId' ? sortOrder : undefined} onClick={() => updateSortField('orderId')} />
                <p className={`flex-[2] bg-blue-300 py-2`}>PCC</p>
                <p className={`flex-[2] bg-blue-300 py-2`}>DCC</p>
                <HeaderField cssClass='flex-[5] bg-blue-300 py-2' label='Status' sort={sortField === 'orderState' ? sortOrder : undefined} onClick={() => updateSortField('orderState')} />
                <p className={`flex-[4] bg-blue-300 py-2`}>Rider</p>
                <HeaderField cssClass='flex-[3] bg-blue-300 py-2' label='Distance' sort={sortField === 'distance' ? sortOrder : undefined} onClick={() => updateSortField('distance')} />
                <HeaderField cssClass='flex-[3] bg-blue-300 py-2' label='Price' sort={sortField === 'deliveryFee' ? sortOrder : undefined} onClick={() => updateSortField('deliveryFee')} />
                <HeaderField cssClass='flex-[4] bg-blue-300 py-2' label='Delivery' sort={sortField === 'deliveredAt' ? sortOrder : undefined} onClick={() => updateSortField('deliveredAt')} />
                <p className={`flex-[2] mr-0 bg-blue-300 py-2 pr-1`}>POD</p>
                <p className={`flex-[3] mr-0 bg-blue-300 py-2 pr-1`}>Actions</p>
            </div>
            <div className={`absolute  top-[35px] bottom-0 lg:right-5 left-0 w-[1265px] xl:w-full xl:overflow-auto`}>
                {orders.map(eachOrder => {
                    return <div key={eachOrder.orderId} className={`flex items-center w-full text-xs relative border-b *:text-center xl:text-sm ${rowBackground(eachOrder.orderState)} h-[40px]`}>
                        <p className={`flex-[3] ml-0 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.createdAt ? dayjs(eachOrder.createdAt).format('hh:mm A') : '--'}</p> {/*created at*/}
                        <div className={`flex-[6] flex items-center ${rowBackground(eachOrder.orderState)} justify-between`}> {/*bill number*/}
                            <input className={`w-full outline-none  border-none ${rowBackground(eachOrder.orderState)} text-center`} readOnly value={eachOrder.clientOrderId} />
                        </div>
                        <div className={`flex justify-center items-center h-full flex-[2] ${rowBackground(eachOrder.orderState)} `}> {/*pcc*/}
                            <p>{eachOrder.pickupOtp || eachOrder.pcc || ' '}</p>
                        </div>
                        <div className={`flex justify-center items-center h-full flex-[2] ${rowBackground(eachOrder.orderState)} `}> {/*dcc*/}
                            <p>{eachOrder.dcc || ' '}</p>
                        </div>
                        <div className={`flex flex-col justify-center items-center h-full flex-[5] ${rowBackground(eachOrder.orderState)} `}> {/*status*/}
                            <input className={`border-none outline-none text-center w-full ${rowBackground(eachOrder.orderState)}`} readOnly value={eachOrder.orderState} />
                            {eachOrder.orderState === 'Cancelled' ? <p className='text-xs font-medium'>{eachOrder.cancelledBy} - {eachOrder.cancellationReason}</p> : null}
                        </div>
                        {eachOrder.riderNumber ? <div className={`flex-col justify-center items-center h-full py-1 flex-[4] ${rowBackground(eachOrder.orderState)}`}> {/*Rider*/}
                            <p className='text-xs'>{trimTextValue(eachOrder.riderName, 12)}</p>
                            <p className='text-xs'>{eachOrder.riderNumber}</p>
                        </div> : <p className={`flex-[4] h-full py-1 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.riderName}</p>}
                        {/*Distance*/}
                        {(eachOrder.distance || eachOrder['f.distance']) && mapLink(eachOrder) ? <a className={`flex-[3] text-blue-600 underline font-semibold py-3 h-full ${rowBackground(eachOrder.orderState)}`}
                            href={mapLink(eachOrder)} target='_blank'>{`${(eachOrder.distance || eachOrder['f.distance']).toFixed(2)} km`}</a> :
                            <p className={`flex-[3] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{(eachOrder.distance || eachOrder['f.distance']) ? `${(eachOrder.distance || eachOrder['f.distance']).toFixed(2)} km` : 0}</p>}
                        <p className={`flex-[3] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{eachOrder.priceWithGST ? `₹ ${eachOrder.priceWithGST.toFixed(2)}` : 0}</p>{/*Price*/}
                        <div className={`flex-[4] h-full flex flex-col justify-center items-center ${rowBackground(eachOrder.orderState)}`}> {/*Delivery*/}
                            <p className='text-xs'>{eachOrder.deliveredAt ? dayjs(eachOrder.deliveredAt).format('hh:mm A') : '--'}</p>
                            {eachOrder.deliveredAt && eachOrder.rtsAt ? <p className='text-xs font-medium'>{`(${dayjs(eachOrder.deliveredAt).diff(eachOrder.rtsAt, 'minute')} min)`}</p> : null}
                        </div>
                        <div className={`flex-[2] h-full flex flex-col justify-center items-start ${rowBackground(eachOrder.orderState)}`}> {/*POD*/}
                            {eachOrder.pickupProof ? <a href={eachOrder.pickupProof} className='text-xs ml-2 underline text-blue-600 font-medium' target='_blank'>Pickup</a> :
                                <p className='text-xs ml-2 text-gray-400 font-medium opacity-0'>Pickup</p>}
                            {eachOrder.deliveryProof ? <a href={eachOrder.deliveryProof} className='text-xs ml-2 underline text-blue-600 font-medium' target='_blank'>Drop</a> :
                                <p className='text-xs ml-2 text-gray-400 font-medium opacity-0'>Drop</p>}
                        </div>
                        <div className={`flex-[3] flex justify-around md:justify-evenly items-center mx-0 ${rowBackground(eachOrder.orderState)} py-2 h-full`}> {/*Actions*/}
                            {eachOrder.trackingUrl ? <a href={eachOrder.trackingUrl} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer w-5' onClick={e => e.stopPropagation()}>
                                <img src={trackIcon} title='Track Shipment' className='w-5' />
                            </a> : <a className='font-semibold underline text-blue-500 cursor-pointer w-5'>
                                <img src={trackIcon} title='Track Shipment' className='w-5 opacity-40' />
                            </a>}
                            <img src={cancelIcon} onClick={e => {
                                if (cancellable(eachOrder.orderState)) {
                                    onCancelOrder(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Cancel Order' className={`w-5 ${cancellable(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}