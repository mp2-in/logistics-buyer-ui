import dayjs from 'dayjs'
import { useEffect } from 'react';

import addIcon from "@assets/add.png"
import cancelIcon from "@assets/cancel.png"
import moreIcon from "@assets/info.png"
import warningIcon from "@assets/warning.png"
import refreshIcon from "@assets/refresh.png"
import trackIcon from "@assets/track.png"
import ActivityIndicator from '@components/ActivityIndicator';

import { Order } from '@lib/interfaces'

import Input from '@components/Input';
import Button from '@components/Button';
import { cancellable } from '@lib/utils';


export default ({ onAddOrder, onRefresh, changeDate, onCancelOrder, orders, activity, filterDate, chooseOrder, onIssueReport, isRetail }: {
    onAddOrder: () => void,
    onRefresh: () => void,
    onCancelOrder: (orderId: string) => void,
    orders: Order[],
    activity: { [k: string]: boolean },
    filterDate: string,
    changeDate: (date: string) => void,
    chooseOrder: (orderId: string) => void,
    onIssueReport: (orderId: string) => void
    isRetail: boolean
}) => {

    const rowBackground = (orderState: string) => {
        return orderState === 'Order-delivered' ? 'bg-green-100' : orderState === 'Cancelled' ? 'bg-red-100' : ''
    }

    useEffect(() => {
        const interval = setInterval(() => {
            onRefresh()
        }, 90000);
        return () => clearInterval(interval);
    }, [filterDate])

    const mapLink = (order: Order): string | undefined => {
        if (order.pickupLatitude && order.pickupLongitude && order.dropLatitude && order.dropLongitude) {
            return `https://www.google.com/maps/dir/?api=1&origin=${order.pickupLatitude},${order.pickupLongitude}&destination=${order.dropLatitude},${order.dropLongitude}`
        }
    }

    const getPrice = (order: Order) => {
        if (order.totalDeliveryCharge || order.saasFee) {
            return (order.totalDeliveryCharge || 0) + (order.saasFee || 0)
        }

        return 0
    }

    return <div className={`absolute left-0 right-0 top-12 bottom-3 lg:px-5 lg:py-3 px-2 sm:top-16`}>
        <div className={`flex sm:items-end items-start justify-between p-2 sm:flex-row-reverse flex-col mb-2`}>
            <div className={`flex flex-row-reverse w-full mb-3 sm:mb-0`}>
                {isRetail ? <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} /> : null}
            </div>
            <div className={'flex items-end sm:*:mr-4 justify-between mt-2 sm:mt-0 w-full sm:w-auto'}>
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => changeDate(val)} />
            </div>
        </div>
        <div className='absolute top-[110px] left-1 right-1 bottom-1 overflow-auto'>
            <div className={`flex items-center bg-blue-300 *:text-center *:font-semibold  xl:*:mx-2 *:text-xs md:*:text-base *:flex-shrink-0 w-full`}>
                <p className={`w-[100px] ml-0 bg-blue-300 py-2 pl-1`}>Created At</p>
                <p className={`w-[150px] bg-blue-300 py-2`}>Order Id</p>
                <p className={`w-[150px] bg-blue-300 py-2`}>LSP</p>
                <p className={`w-[100px] bg-blue-300 py-2`}>PCC</p>
                <p className={`w-[100px] bg-blue-300 py-2`}>DCC</p>
                <p className={`w-[150px] bg-blue-300 py-2`}>Status</p>
                <p className={`w-[160px] bg-blue-300 py-2`}>Customer</p>
                <p className={`w-[150px] bg-blue-300 py-2`}>Rider</p>
                <p className={`w-[100px] bg-blue-300 py-2`}>Distance</p>
                <p className={`w-[100px] bg-blue-300 py-2`}>Price</p>
                <p className={`w-[100px] bg-blue-300 py-2`}>Delivered At</p>
                <p className={`w-[160px] mr-0 bg-blue-300 py-2 pr-1`}>Actions</p>
            </div>
            <div className={`absolute flex items-center flex-col left-0 right-0 bottom-0 top-[30px] lg:left-5 lg:right-5 lg:top-[123px] md:top-[110px] w-full overflow-y-auto`}>
                {orders.map(eachOrder => {
                    return <div key={eachOrder.orderId} className={`flex items-center w-full text-xs relative *:text-center lg:text-sm xl:*:mx-2 ${rowBackground(eachOrder.orderState)}  *:flex-shrink-0 overflow-y-visible h-[40px] w-full`}>
                        <p className={`w-[100px] ml-0 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.createdAt ? dayjs(eachOrder.createdAt).format('hh:mm A') : '--'}</p>
                        <div className={`w-[150px] ${rowBackground(eachOrder.orderState)}`}>
                            <input className={`w-[150px] outline-none  border-none ${rowBackground(eachOrder.orderState)}`} readOnly value={eachOrder.orderId} />
                        </div>
                        <input className={`w-[150px]  border-none outline-none ${rowBackground(eachOrder.orderState)}`} readOnly value={eachOrder.providerId} />
                        <div className={`flex justify-center items-center h-full w-[100px] ${rowBackground(eachOrder.orderState)} `}>
                            <p>{eachOrder.pcc || ' '}</p>
                        </div>
                        <div className={`flex justify-center items-center h-[40px] w-[100px] ${rowBackground(eachOrder.orderState)} `}>
                            <p>{eachOrder.dcc || ' '}</p>
                        </div>
                        <div className={`flex justify-center items-center h-full w-[150px] ${rowBackground(eachOrder.orderState)} `}>
                            <input className={`border-none outline-none text-center ${rowBackground(eachOrder.orderState)}`} readOnly value={eachOrder.orderState} />
                        </div>
                        <div className={`flex-col justify-center items-center h-full w-[160px] pt-1 ${rowBackground(eachOrder.orderState)} `}>
                            <p className='text-xs'>{eachOrder.dropName}</p>
                            <p className='text-xs'>{eachOrder.dropPhone}</p>
                        </div>
                        {eachOrder.riderNumber ? <a className={`w-[150px] underline cursor-pointer font-semibold text-blue-400`} href={`tel:${eachOrder.riderNumber}`}>
                            <div className={`flex-col justify-center items-center h-full py-1 ${rowBackground(eachOrder.orderState)}`}>
                                <p className='text-xs'>{eachOrder.riderName}</p>
                                <p className='text-xs'>{eachOrder.riderNumber}</p>
                            </div>
                        </a> : <p className={`w-[150px] h-full py-1 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.riderName}</p>}
                        {eachOrder.distance ? <a className={`w-[100px] text-blue-600 underline font-semibold py-3 h-full ${rowBackground(eachOrder.orderState)}`} href={mapLink(eachOrder) || ''} target='_blank'>{`${eachOrder.distance.toFixed(2)} km`}</a> :
                            <p className={`w-[100px] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>0</p>}
                        <p className={`w-[100px] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{getPrice(eachOrder) ? `₹ ${getPrice(eachOrder).toFixed(2)}` : 0}</p>
                        <p className={`w-[100px] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{eachOrder.deliveredAt ? dayjs(eachOrder.deliveredAt).format('hh:mm A') : '--'}</p>
                        <div className={`w-[160px] flex justify-around md:justify-between items-center xl:justify-evenly mx-0 ${rowBackground(eachOrder.orderState)} py-2 h-full`}>
                            {eachOrder.trackingUrl ? <a href={eachOrder.trackingUrl} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer w-5' onClick={e => e.stopPropagation()}>
                                <img src={trackIcon} title='Track Shipment' className='w-5' />
                            </a> : <a className='font-semibold underline text-blue-500 cursor-pointer w-5'>
                                <img src={trackIcon} title='Track Shipment' className='w-5 opacity-40' />
                            </a>}
                            <img src={warningIcon} onClick={e => {
                                onIssueReport(eachOrder.orderId)
                                e.stopPropagation()
                            }} title='Raise Issue' className={`w-5 cursor-pointer`} />
                            <img src={cancelIcon} onClick={e => {
                                if (cancellable(eachOrder.orderState)) {
                                    onCancelOrder(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Cancel Order' className={`w-5 ${cancellable(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                            <img src={moreIcon} onClick={e => {
                                chooseOrder(eachOrder.orderId)
                                e.stopPropagation()
                            }} title='Order Details' className={'cursor-pointer w-5 hover:shadow-md'} />
                        </div>
                    </div>
                })}
            </div>
        </div>
        {activity.getOrders || activity.getOrderDetails || activity.getWalletDashboardLink ? <ActivityIndicator /> : null}
    </div>
}