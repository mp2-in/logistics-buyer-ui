import dayjs from 'dayjs'
import cn from 'classnames';
import { createRef, useEffect, useState } from 'react';

import Button from "@components/Button";
import moreIcon from '@assets/more.png'
import addIcon from "@assets/add.png"
import refreshIcon from "@assets/refresh.png"
import ActivityIndicator from '@components/ActivityIndicator';

import { Order } from '@lib/interfaces'

import CancelOrder from './CancelOrder';

import styles from './OrderList.module.scss'
import Input from '@components/Input';


export default ({ onAddOrder, onRefresh, onCancelOrder, changeDate, getOrderDetails, orders, activity, filterDate }: {
    onAddOrder: () => void, onRefresh: () => void, onCancelOrder: (orderId: string, reason: string, callback: () => void) => void,
    orders: Order[], activity: { [k: string]: boolean }, filterDate: string, changeDate: (date: string) => void, getOrderDetails: (orderId: string) => void
}) => {
    const [clickedId, setClickedId] = useState('')
    const [cancelOrderId, setCancelOrderId] = useState('')
    const [showCancelOrder, setCancelOrderDisplay] = useState(false)

    let actionBtnContainerRef = createRef<HTMLInputElement>();

    const handleClickOutside = (event: MouseEvent) => {
        if (
            actionBtnContainerRef.current &&
            !actionBtnContainerRef.current.contains(event.target as Node)
        ) {
            setClickedId('');
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });


    return <div className={styles.container}>
        <div className={styles.btnContainer}>
            <div className={styles.dateRefresh}>
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" iconPosition="left" onClick={onRefresh} />
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => changeDate(val)}/>
            </div>
            <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" iconPosition="left" onClick={onAddOrder} />
        </div>
        <div className={styles.header}>
            <p>Date</p>
            <p>Order Id</p>
            <p>LSP</p>
            <p>Status</p>
            <p>Price</p>
            <p>Distance</p>
            <p>Track</p>
            <p></p>
        </div>
        <div className={styles.body}>
            {orders.map(eachOrder => {
                return <div key={eachOrder.id} onClick={() => getOrderDetails(eachOrder.id)}>
                    <p>{eachOrder.created_at ? dayjs(eachOrder.created_at).format('DD MMM, hh:mm A') : '--'}</p>
                    <p>{eachOrder.client_order_id}</p>
                    <p>{eachOrder.lsp.name}</p>
                    <p>{eachOrder.state}</p>
                    <p>{eachOrder.price ? `₹ ${eachOrder.price}` : 0}</p>
                    <p>{eachOrder.distance ? `${eachOrder.distance}m` : 0}</p>
                    {eachOrder.tracking_url?<a href={eachOrder.tracking_url} target='_blank' className='font-semibold underline text-blue-500 cursor-pointer'>Track</a>:<p className='text-gray-500'>Track</p>}
                    <div className='flex justify-center'>
                        <img src={moreIcon} onClick={e => {
                            setClickedId(eachOrder.id)
                            e.stopPropagation()
                        }} />
                    </div>
                    <div className={cn({ [styles.actionBtns]: true, [styles.visible]: clickedId === eachOrder.id })} ref={actionBtnContainerRef}>
                        <p onClick={() => {
                            setCancelOrderDisplay(true)
                            setCancelOrderId(eachOrder.id)
                        }}>Cancel Order</p>
                        <p>Retry Fulfillment</p>
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