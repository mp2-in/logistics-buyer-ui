import dayjs from 'dayjs'
import { useEffect, useState } from 'react';

import addIcon from "@assets/add.png"
import cancelIcon from "@assets/cancel.png"
import retryIcon from "@assets/retry.png"
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

    return <div className={`absolute left-0 right-0 top-16 bottom-3 px-5 py-3 overflow-hidden`}>
        <div className={`flex items-end justify-between p-4`}>
            <div className={'flex items-end *:mr-4'}>
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => changeDate(val)} />
            </div>
            <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} />
        </div>
        <div className={`flex items-center py-2 px-3 bg-blue-300 rounded-tl-lg rounded-tr-lg *:text-center *:font-semibold *:text-lg`}>
            <p className={`flex-[3]`}>Date</p>
            <p className={`flex-[5]`}>Order Id</p>
            <p className={`flex-[5]`}>LSP</p>
            <p className={`flex-[4]`}>Status</p>
            <p className={`flex-[2]`}>Price</p>
            <p className={`flex-[2]`}>Distance</p>
            <p className={`flex-[2]`}>Track</p>
            <p className={`flex-[2]`}></p>
        </div>
        <div className={`absolute flex items-center flex-col left-5 right-5 bottom-2 top-[134px] overflow-auto`}>
            {orders.map(eachOrder => {
                return <div key={eachOrder.id} onClick={() => getOrderDetails(eachOrder.id)} className={`flex items-center w-full py-1 px-2 border-b border-l border-r text-sm relative cursor-pointer *:text-center`}>
                    <p className={`flex-[3]`}>{eachOrder.created_at ? dayjs(eachOrder.created_at).format('DD MMM, hh:mm A') : '--'}</p>
                    <p className={`flex-[5]`}>{eachOrder.client_order_id}</p>
                    <p className={`flex-[5]`}>{eachOrder.lsp.name}</p>
                    <p className={`flex-[4]`}>{eachOrder.state}</p>
                    <p className={`flex-[2]`}>{eachOrder.price ? `₹ ${eachOrder.price}` : 0}</p>
                    <p className={`flex-[2]`}>{eachOrder.distance ? `${eachOrder.distance}m` : 0}</p>
                    <div className={`flex-[2]`}>
                        {eachOrder.tracking_url ? <a href={eachOrder.tracking_url} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer' onClick={e => e.stopPropagation()}>Track</a> : <p className='text-gray-500'>Track</p>}
                    </div>
                    <div className='flex justify-around *:w-6 flex-[2]'>
                        <img src={cancelIcon} onClick={e => {
                            if (cancellable(eachOrder.state)) {
                                setCancelOrderDisplay(true)
                                setCancelOrderId(eachOrder.id)
                            }
                            e.stopPropagation()
                        }} title='Cancel Order' className={`${cancellable(eachOrder.state) ? 'cursor-pointer' : 'opacity-30 cursor-default'}`} />
                        <img src={retryIcon} title='Retry Fulfillment' onClick={e => e.stopPropagation()} />
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