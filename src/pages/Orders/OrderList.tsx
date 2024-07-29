import dayjs from 'dayjs'
import { useEffect } from 'react';

import addIcon from "@assets/add.png"
import cancelIcon from "@assets/cancel.png"
import moreIcon from "@assets/info.png"
import warningIcon from "@assets/warning.png"
import refreshIcon from "@assets/refresh.png"
import ActivityIndicator from '@components/ActivityIndicator';

import { Order } from '@lib/interfaces'

import Input from '@components/Input';
import Button from '@components/Button';


export default ({ onAddOrder, onRefresh, changeDate, onCancelOrder, orders, activity, filterDate, chooseOrder, onIssueReport }: {
    onAddOrder: () => void,
    onRefresh: () => void,
    onCancelOrder: (orderId: string) => void,
    orders: Order[],
    activity: { [k: string]: boolean },
    filterDate: string,
    changeDate: (date: string) => void,
    chooseOrder: (orderId: string) => void,
    onIssueReport: (orderId: string) => void
}) => {

    const cancellable = (orderState: string) => {
        return ['Pending', 'Accepted', 'UnFulFilled', 'Searching-for-Agent', 'Agent-assigned', 'At-pickup', 'UnFulfilled'].includes(orderState)
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

    return <div className={`absolute left-0 right-0 top-12 bottom-3 lg:px-5 lg:py-3 px-2 overflow-hidden sm:top-16`}>
        <div className={`flex sm:items-end items-start justify-between p-2 sm:flex-row-reverse flex-col mb-2`}>
            <div className={`flex flex-row-reverse w-full mb-3 sm:mb-0`}>
                <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} />
            </div>
            <div className={'flex items-end sm:*:mr-4 justify-between mt-2 sm:mt-0 w-full sm:w-auto'}>
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => changeDate(val)} />
            </div>
        </div>
        <div className={`flex items-center py-2 px-1 bg-blue-300 rounded-tl-lg rounded-tr-lg *:text-center *:font-semibold  xl:*:mx-2 *:text-xs md:*:text-base`}>
            <p className={`flex-[4] ml-0`}>Created At</p>
            <p className={`flex-[4] hidden xl:block`}>Order Id</p>
            <p className={`flex-[4] hidden xl:block`}>LSP</p>
            <p className={`flex-[2] hidden xl:block`}>PCC</p>
            <p className={`flex-[2] hidden xl:block`}>DCC</p>
            <p className={`flex-[5] xl:flex[2]`}>Status</p>
            <p className={`flex-[4] hidden xl:block`}>Customer</p>
            <p className={`flex-[4]`}>Rider</p>
            <p className={`flex-[3] hidden xl:block`}>Distance</p>
            <p className={`flex-[3] hidden xl:block`}>Price</p>
            <p className={`flex-[4] hidden xl:block`}>Delivered At</p>
            <p className={`flex-[4] hidden xl:block mr-0`}>Actions</p>
            <p className={`flex-[4] xl:hidden`}></p>
        </div>
        <div className={`absolute flex items-center flex-col left-2 right-2 bottom-2 top-[148px] overflow-auto lg:left-5 lg:right-5 lg:top-[123px] md:top-[110px]`}>
            {orders.map(eachOrder => {
                return <div key={eachOrder.orderId} className={`flex items-center w-full py-1 px-1 border-b border-l border-r text-xs relative *:text-center lg:text-sm xl:*:mx-2`}>
                    <p className={`flex-[4] ml-0`}>{eachOrder.createdAt ? dayjs(eachOrder.createdAt).format('hh:mm A') : '--'}</p>
                    <input className={`flex-[4] hidden xl:block  border-none outline-none w-full`} readOnly value={eachOrder.orderId} />
                    <input className={`flex-[4] hidden xl:block  border-none outline-none w-full`} readOnly value={eachOrder.providerId} />
                    <p className={`flex-[2] hidden xl:block`} >{eachOrder.pcc}</p>
                    <p className={`flex-[2] hidden xl:block`} >{eachOrder.dcc}</p>
                    <input className={`flex-[5] xl:flex[2] border-none outline-none w-full`} readOnly value={eachOrder.orderState} />
                    <div className={`flex-[4] xl:block  hidden`}>
                        <p className='text-xs'>{eachOrder.dropName}</p>
                        <p className='text-xs'>{eachOrder.dropPhone}</p>
                    </div>
                    {eachOrder.riderNumber ? <a className={`flex-[4] underline cursor-pointer font-semibold text-blue-400`} href={`tel:${eachOrder.riderNumber}`}>{eachOrder.riderName}</a> :
                        <p className={`flex-[4]`}>{eachOrder.riderName}</p>}
                    {eachOrder.distance ? <a className={`flex-[3] hidden xl:block text-blue-400 underline font-semibold`} href={mapLink(eachOrder) || ''} target='_blank'>{`${eachOrder.distance.toFixed(2)} km`}</a> :
                        <p className={`flex-[3] hidden xl:block`}>0</p>}
                    <p className={`flex-[3] hidden xl:block`}>{getPrice(eachOrder) ? `₹ ${getPrice(eachOrder).toFixed(2)}` : 0}</p>
                    <p className={`flex-[4] hidden xl:block`}>{eachOrder.deliveredAt ? dayjs(eachOrder.createdAt).format('hh:mm A') : '--'}</p>
                    <div className={`flex-[4] flex justify-between items-center xl:justify-evenly mx-0`}>
                        <img src={warningIcon} onClick={e => {
                            onIssueReport(eachOrder.orderId)
                            e.stopPropagation()
                        }} title='Raise Issue' className={`w-5 cursor-pointer`} />
                        <img src={cancelIcon} onClick={e => {
                            if (cancellable(eachOrder.orderState)) {
                                onCancelOrder(eachOrder.orderId)
                            }
                            e.stopPropagation()
                        }} title='Cancel Order' className={`w-5 hidden xl:block ${cancellable(eachOrder.orderState) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                        <img src={moreIcon} onClick={e => {
                            chooseOrder(eachOrder.orderId)
                            e.stopPropagation()
                        }} title='Order Details' className={'cursor-pointer w-6 hover:shadow-md'} />
                    </div>
                </div>
            })}
        </div>
        {activity.getOrders || activity.getOrderDetails || activity.getWalletDashboardLink ? <ActivityIndicator /> : null}
    </div>
}