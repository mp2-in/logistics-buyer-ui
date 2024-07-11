import dayjs from 'dayjs'
import { useEffect, useState } from 'react';

import addIcon from "@assets/add.png"
import cancelIcon from "@assets/cancel.png"
import trackIcon from "@assets/track.png"
import moreIcon from "@assets/more.png"
import refreshIcon from "@assets/refresh.png"
import ActivityIndicator from '@components/ActivityIndicator';

import { Order } from '@lib/interfaces'

import CancelOrder from './CancelOrder';

import Input from '@components/Input';
import Button from '@components/Button';


export default ({ onAddOrder, onRefresh, onCancelOrder, changeDate, getOrderDetails, orders, activity, filterDate }: {
    onAddOrder: () => void, onRefresh: () => void, onCancelOrder: (orderId: string, reason: string, callback: () => void) => void,
    orders: Order[], activity: { [k: string]: boolean }, filterDate: string, changeDate: (date: string) => void, getOrderDetails: (orderId: string) => void
}) => {
    const [cancelOrderId, setCancelOrderId] = useState('')
    const [showCancelOrder, setCancelOrderDisplay] = useState(false)

    const cancellable = (orderState: string) => {
        return ['UnFulfilled', 'Searching-for-Agent', 'Pending'].includes(orderState)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            onRefresh()
        }, 90000);
        return () => clearInterval(interval);
    }, [filterDate])

    return <div className={`absolute left-0 right-0 top-12 bottom-3 md:px-5 md:py-3 px-2 overflow-hidden md:top-16`}>
        <div className={`flex md:items-end items-start justify-between p-2 md:flex-row-reverse flex-col mb-2`}>
            <div className={`flex flex-row-reverse w-full mb-3 md:mb-0`}>
                <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} />
            </div>
            <div className={'flex items-end md:*:mr-4 justify-between mt-2 md:mt-0 w-full md:w-auto'}>
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => changeDate(val)} />
            </div>
        </div>
        <div className={`flex items-center py-2 px-3 bg-blue-300 rounded-tl-lg rounded-tr-lg *:text-center *:font-semibold *:text-md`}>
            <p className={`flex-[4] md:flex[3]`}>Date</p>
            <p className={`flex-[5] hidden md:block`}>Order Id</p>
            <p className={`flex-[5] hidden md:block`}>LSP</p>
            <p className={`flex-[6] md:flex[4]`}>Status</p>
            <p className={`flex-[2] hidden md:block`}>Rider</p>
            <p className={`flex-[2] hidden md:block`}>Distance</p>
            <p className={`flex-[3] md:flex[2]`}>Actions</p>
        </div>
        <div className={`absolute flex items-center flex-col left-2 right-2 bottom-2 top-[145px] overflow-auto md:left-5 md:right-5 md:top-[123px]`}>
            {orders.map(eachOrder => {
                return <div key={eachOrder.id} className={`flex items-center w-full py-1 px-1 border-b border-l border-r text-xs relative *:text-center md:text-sm`}>
                    <p className={`flex-[4] md:flex[3]`}>{eachOrder.created_at ? dayjs(eachOrder.created_at).format('DD MMM, hh:mm A') : '--'}</p>
                    <p className={`flex-[5] hidden md:block`}>{eachOrder.client_order_id}</p>
                    <p className={`flex-[5] hidden md:block`}>{eachOrder.lsp.name}</p>
                    <p className={`flex-[6] md:flex[4]`}>{eachOrder.state}</p>
                    <p className={`flex-[2] hidden md:block`}>{eachOrder.rider.name}</p>
                    <p className={`flex-[2] hidden md:block`}>{eachOrder.distance ? `${eachOrder.distance}m` : 0}</p>
                    <div className={`flex-[3] md:flex[2] flex justify-between items-center md:justify-evenly`}>
                        {eachOrder.tracking_url ? <a href={eachOrder.tracking_url} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer' onClick={e => e.stopPropagation()}>
                            <img src={trackIcon} title='Track Shipment' className='w-6' />
                        </a> : <img src={trackIcon} title='Track Shipment' className='w-6 opacity-40' />}
                        <img src={cancelIcon} onClick={e => {
                            if (cancellable(eachOrder.state)) {
                                setCancelOrderDisplay(true)
                                setCancelOrderId(eachOrder.id)
                            }
                            e.stopPropagation()
                        }} title='Cancel Order' className={`w-5 ${cancellable(eachOrder.state) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                        <img src={moreIcon} onClick={e => {
                            getOrderDetails(eachOrder.id)
                            e.stopPropagation()
                        }} title='Order Details' className={'cursor-pointer w-6 hover:shadow-md'} />
                    </div>
                </div>
            })}
        </div>
        {activity.getOrders || activity.getOrderDetails ? <ActivityIndicator /> : null}
        <CancelOrder open={showCancelOrder} onClose={() => setCancelOrderDisplay(false)} onCancel={reason => onCancelOrder(cancelOrderId, reason, () => {
            setCancelOrderDisplay(false)
        })} loading={activity.cancelOrder} />
    </div>
}