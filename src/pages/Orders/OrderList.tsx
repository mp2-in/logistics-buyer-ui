import dayjs from 'dayjs'
import { useEffect, useState } from 'react';

import cancelIcon from "@assets/cancel.png"
import retryIcon from "@assets/retry.png"
import moreIcon from "@assets/info.png"
import warningIcon from "@assets/warning.png"
import driverSearch from "@assets/driver_search.png"
import trackIcon from "@assets/track.png"
import copyIcon from "@assets/copy.png"
import ActivityIndicator from '@components/ActivityIndicator';
import sortBlackDownIcon from "@assets/sort_black_down.png"
import sortBlackUpIcon from "@assets/sort_black_up.png"
import sortGreyDownIcon from "@assets/sort_grey_down.png"
import sortGreyUpIcon from "@assets/sort_grey_up.png"
import blockIcon from "@assets/block.png"

import addLoggs from "@assets/lsp_logos/adloggs.png"
import lsn from "@assets/lsp_logos/lsn.png"
import mp2 from "@assets/lsp_logos/mp2_logo.png"
import ola from "@assets/lsp_logos/ola.png"
import pidge from "@assets/lsp_logos/pidge.png"
import porter from "@assets/lsp_logos/porter.png"
import shadowFax from "@assets/lsp_logos/shadowfax.png"
import zypp from "@assets/lsp_logos/zypp.png"
import telyport from "@assets/lsp_logos/telyport.png"
import defaultLsp from "@assets/lsp_logos/lsp_default.png"

import { Order } from '@lib/interfaces'

import { cancellable, trimTextValue } from '@lib/utils';
import ActionsAndFilters from './ActionsAndFilters';


const HeaderField = ({ cssClass, label, sort, hidden, onClick }: { cssClass: string, label: string, sort?: 'asc' | 'dsc', hidden?: boolean, onClick: () => void }) => {
    return <div className={`${cssClass} ${hidden ? 'hidden xl:flex' : 'flex'} items-center cursor-pointer justify-center`} onClick={onClick}>
        <p className='mx-2'>{label}</p>
        <div className={'flex-col items-center'}>
            <img src={sort === 'asc' ? sortBlackUpIcon : sortGreyUpIcon} className='w-2 mb-1' />
            <img src={sort === 'dsc' ? sortBlackDownIcon : sortGreyDownIcon} className='w-2' />
        </div>
    </div>
}


export default ({ onAddOrder, onRefresh, changeDate, onCancelOrder, orders, activity, filterDate, chooseOrder, onIssueReport, isRetail, onOrderFulfillment, token, role, markAsUnfulfilled }: {
    onAddOrder: (orderId?: string) => void,
    onRefresh: () => void,
    onCancelOrder: (orderId: string) => void,
    markAsUnfulfilled: (orderId: string) => void,
    orders: Order[],
    activity: { [k: string]: boolean },
    filterDate: string,
    changeDate: (date: string) => void,
    chooseOrder: (orderId: string) => void,
    onIssueReport: (orderId: string) => void
    isRetail: boolean
    onOrderFulfillment: (orderId: string) => void
    token?: string
    role: string
}) => {

    const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('dsc')
    const [sortField, setSortField] = useState<keyof Order>('createdAt')
    const [chosenOutlets, chooseOutlets] = useState<string[]>([])

    const rowBackground = (orderState: string) => {
        return orderState === 'Order-delivered' ? 'bg-green-100' : orderState === 'Cancelled' ? 'bg-red-100' : orderState === 'RTO-Delivered' ? 'bg-orange-100' : ''
    }

    useEffect(() => {
        const interval = setInterval(() => {
            onRefresh()
        }, 90000);
        return () => clearInterval(interval);
    }, [filterDate, token])

    const mapLink = (order: Order): string | undefined => {
        if (order.pickupLatitude && order.pickupLongitude && order.dropLatitude && order.dropLongitude) {
            return `https://www.google.com/maps/dir/?api=1&origin=${order.pickupLatitude},${order.pickupLongitude}&destination=${order.dropLatitude},${order.dropLongitude}&travelmode=driving`
        }
    }

    const sortOrders = (a: Order, b: Order) => {
        return (a[sortField] || '') > (b[sortField] || '') ? sortOrder === 'asc' ? 1 : -1 : (a[sortField] || '') < (b[sortField] || '') ? sortOrder === 'asc' ? -1 : 1 : 0
    }

    const updateSortField = (field: keyof Order) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'dsc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('dsc')
        }
    }

    const getLogo = (provider?: string) => {
        if (!provider) {
            return ''
        }

        switch (provider) {
            case 'Pidge':
                return pidge
            case 'LoadShare Networks':
                return lsn
            case 'Porter':
                return porter
            case 'AdLoggs':
                return addLoggs
            case 'Shadowfax':
                return shadowFax
            case 'OLA':
                return ola
            case 'Zypp':
                return zypp
            case 'MP2':
                return mp2
            case 'Telyport':
                return telyport
            default:
                return defaultLsp
        }
    }

    const getOutlets = (): { label: string, value: string }[] => {
        return orders.map(e => e.pickupName).filter((v, i, a) => {
            return a.indexOf(v) === i;
        }).map(e => {
            return { label: e, value: e }
        })
    }

    const copyOrderDataToClipboard = (order: Order) => {
        let keys: (keyof Order)[] = ['orderId', 'clientOrderId', 'networkOrderId', 'orderState', 'providerId', 'riderName', 'riderNumber', 'trackingUrl']
        navigator.clipboard.writeText(keys.map(e => `${e} : ${order[e]}`).join("\n"))
    }

    const canMarkAsUnfulfilled = (orderState: string) => {
        return ['Pending', 'Searching-for-Agent', 'Agent-assigned', 'At-pickup'].includes(orderState) && /super_admin/.test(role || '')
    }

    return <div className={`absolute left-0 right-0 top-14 bottom-3 lg:px-5 px-2 md:top-[70px]`} >
        <ActionsAndFilters onAddOrder={isRetail ? onAddOrder : undefined} onRefresh={onRefresh} outlets={getOutlets()}
            chooseOutlets={chooseOutlets} chosenOutlets={chosenOutlets} changeDate={changeDate} filterDate={filterDate} />
        <div className='absolute top-[100px] left-2 right-2 bottom-1 overflow-auto md:top-[130px] lg:top-[70px]   '>
            <div className={`flex items-center bg-blue-300 *:text-center *:font-medium  *:text-sm xl:*:text-sm w-[1265px] xl:w-full`}>
                <HeaderField cssClass='flex-[3] ml-0 bg-blue-300 py-2 pl-1' label='Creation' sort={sortField === 'createdAt' ? sortOrder : undefined} onClick={() => updateSortField('createdAt')} />
                <HeaderField cssClass='flex-[6] bg-blue-300 py-2' label='Bill Number' sort={sortField === 'orderId' ? sortOrder : undefined} onClick={() => updateSortField('orderId')} />
                <p className={`flex-[2] bg-blue-300 py-2`}>PCC</p>
                <p className={`flex-[2] bg-blue-300 py-2`}>DCC</p>
                <HeaderField cssClass='flex-[5] bg-blue-300 py-2' label='Status' sort={sortField === 'orderState' ? sortOrder : undefined} onClick={() => updateSortField('orderState')} />
                <HeaderField cssClass='flex-[4] bg-blue-300 py-2' label='Customer' sort={sortField === 'dropName' ? sortOrder : undefined} onClick={() => updateSortField('dropName')} />
                <HeaderField cssClass='flex-[2] bg-blue-300 py-2' label='LSP' sort={sortField === 'providerId' ? sortOrder : undefined} onClick={() => updateSortField('providerId')} />
                <p className={`flex-[4] bg-blue-300 py-2`}>Rider</p>
                <HeaderField cssClass='flex-[3] bg-blue-300 py-2' label='Distance' sort={sortField === 'distance' ? sortOrder : undefined} onClick={() => updateSortField('distance')} />
                <HeaderField cssClass='flex-[3] bg-blue-300 py-2' label='Price' sort={sortField === 'deliveryFee' ? sortOrder : undefined} onClick={() => updateSortField('deliveryFee')} />
                <HeaderField cssClass='flex-[4] bg-blue-300 py-2' label='Delivery' sort={sortField === 'deliveredAt' ? sortOrder : undefined} onClick={() => updateSortField('deliveredAt')} />
                <p className={`flex-[5] mr-0 bg-blue-300 py-2 pr-1`}>Actions</p>
            </div>
            <div className={`absolute  top-[35px] bottom-0 lg:right-5 left-0 w-[1265px] xl:w-full xl:overflow-auto`}>
                {[...orders].filter(e => chosenOutlets.includes(e.pickupName) || chosenOutlets.length === 0).sort(sortOrders).map(eachOrder => {
                    return <div key={eachOrder.orderId} className={`flex items-center w-full text-xs relative border-b *:text-center xl:text-sm ${rowBackground(eachOrder.orderState)} h-[40px]`}>
                        <p className={`flex-[3] ml-0 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.createdAt ? dayjs(eachOrder.createdAt).format('hh:mm A') : '--'}</p>
                        <div className={`flex-[6] flex items-center ${rowBackground(eachOrder.orderState)}`}>
                            <input className={`w-full outline-none  border-none ${rowBackground(eachOrder.orderState)} text-center`} readOnly value={eachOrder.clientOrderId} />
                            <img src={copyIcon} className='w-4 cursor-pointer ml-1 active:opacity-30' onClick={() => copyOrderDataToClipboard(eachOrder)} title='Copy order details' />
                        </div>
                        <div className={`flex justify-center items-center h-full flex-[2] ${rowBackground(eachOrder.orderState)} `}>
                            <p>{eachOrder.pcc || ' '}</p>
                        </div>
                        <div className={`flex justify-center items-center h-full flex-[2] ${rowBackground(eachOrder.orderState)} `}>
                            <p>{eachOrder.dcc || ' '}</p>
                        </div>
                        <div className={`flex flex-col justify-center items-center h-full flex-[5] ${rowBackground(eachOrder.orderState)} `}>
                            <input className={`border-none outline-none text-center w-full ${rowBackground(eachOrder.orderState)}`} readOnly value={eachOrder.orderState} />
                            {eachOrder.orderState==='Cancelled'?<p className='text-xs'><span className='text-gray-600'>By</span>: <span className='font-medium'>{eachOrder.cancelledBy}</span></p>:null}
                        </div>
                        <div className={`flex-col justify-center items-center h-full flex-[4] pt-1 ${rowBackground(eachOrder.orderState)} `}>
                            <p className='text-xs'>{trimTextValue(eachOrder.dropName, 12)}</p>
                            <p className='text-xs'>{eachOrder.dropPhone}</p>
                        </div>
                        <div className='flex-[2] flex justify-center items-center'>
                            <img src={getLogo(eachOrder.providerId)} className='w-7' alt={eachOrder.providerId} title={eachOrder.providerId} />
                        </div>
                        {eachOrder.riderNumber ? <div className={`flex-col justify-center items-center h-full py-1 flex-[4] ${rowBackground(eachOrder.orderState)}`}>
                            <p className='text-xs'>{trimTextValue(eachOrder.riderName, 12)}</p>
                            <p className='text-xs'>{eachOrder.riderNumber}</p>
                        </div> : <p className={`flex-[4] h-full py-1 ${rowBackground(eachOrder.orderState)}`}>{eachOrder.riderName}</p>}
                        {(eachOrder.distance || eachOrder['f.distance']) && mapLink(eachOrder) ? <a className={`flex-[3] text-blue-600 underline font-semibold py-3 h-full ${rowBackground(eachOrder.orderState)}`}
                            href={mapLink(eachOrder)} target='_blank'>{`${(eachOrder.distance || eachOrder['f.distance']).toFixed(2)} km`}</a> :
                            <p className={`flex-[3] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{(eachOrder.distance || eachOrder['f.distance']) ? `${(eachOrder.distance || eachOrder['f.distance']).toFixed(2)} km` : 0}</p>}
                        <p className={`flex-[3] py-3 h-full ${rowBackground(eachOrder.orderState)}`}>{eachOrder.priceWithGST ? `₹ ${eachOrder.priceWithGST.toFixed(2)}` : 0}</p>
                        <div className={`flex-[4] h-full flex flex-col justify-center items-center ${rowBackground(eachOrder.orderState)}`}>
                            <p className='text-xs'>{eachOrder.deliveredAt ? dayjs(eachOrder.deliveredAt).format('hh:mm A') : '--'}</p>
                            {eachOrder.deliveredAt && eachOrder.rtsAt ? <p className='text-xs font-medium'>{`(${dayjs(eachOrder.deliveredAt).diff(eachOrder.rtsAt, 'minute')} min)`}</p> : null}
                        </div>
                        <div className={`flex-[5] flex justify-around md:justify-evenly items-center mx-0 ${rowBackground(eachOrder.orderState)} py-2 h-full`}>
                            <img src={driverSearch} onClick={e => {
                                if (/unfulfilled/i.test(eachOrder.orderState)) {
                                    onOrderFulfillment(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Search Rider' className={`w-5 ${/unfulfilled/i.test(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30'}`} />
                            {eachOrder.trackingUrl ? <a href={eachOrder.trackingUrl} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer w-5' onClick={e => e.stopPropagation()}>
                                <img src={trackIcon} title='Track Shipment' className='w-5' />
                            </a> : <a className='font-semibold underline text-blue-500 cursor-pointer w-5'>
                                <img src={trackIcon} title='Track Shipment' className='w-5 opacity-40' />
                            </a>}
                            <img src={blockIcon} onClick={e => {
                                if (canMarkAsUnfulfilled(eachOrder.orderState)) {
                                    markAsUnfulfilled(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Mark as Unfulfilled'  className={`w-5 ${canMarkAsUnfulfilled(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                            <img src={warningIcon} onClick={e => {
                                if (eachOrder.networkOrderId) {
                                    onIssueReport(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Raise Issue' className={`w-5 ${eachOrder.networkOrderId ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                            <img src={cancelIcon} onClick={e => {
                                if (cancellable(eachOrder.orderState)) {
                                    onCancelOrder(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Cancel Order' className={`w-5 ${cancellable(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                            <img src={retryIcon} onClick={e => {
                                if (eachOrder.orderState === 'Cancelled') {
                                    onAddOrder(eachOrder.orderId)
                                }
                                e.stopPropagation()
                            }} title='Re-Book' className={`w-5 ${eachOrder.orderState === 'Cancelled' ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
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