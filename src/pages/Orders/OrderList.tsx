import dayjs from 'dayjs'
import Button from "@components/Button";

import moreIcon from '@assets/more.png'
import addIcon from "@assets/add.png"
import refreshIcon from "@assets/refresh.png"

import {Order} from '@lib/interfaces'

import styles from './OrderList.module.scss'


export default ({ onAddOrder, onRefresh, orders }: { onAddOrder: () => void, onRefresh: () => void , orders: Order[]}) => {
    return <div className={styles.container}>
        <div className={styles.btnContainer}>
            <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" iconPosition="left" onClick={onRefresh} />
            <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" iconPosition="left" onClick={onAddOrder} />
        </div>
        <div className={styles.header}>
            <p>Date</p>
            <p>Order Id</p>
            <p>LSP</p>
            <p>Item Id</p>
            <p>Price</p>
            <p>Distance</p>
            <p></p>
        </div>
        <div className={styles.body}>
            {orders.map(e => {
                return <div>
                    <p>{e.created_at ? dayjs(e.created_at).format('DD MMM, hh:mm A') : '--'}</p>
                    <p>{e.client_order_id}</p>
                    <p>{e.lsp.name}</p>
                    <p>{e.lsp.item_id}</p>
                    <p>{e.price ? `₹ ${e.price}` : 0}</p>
                    <p>{e.distance ? `${e.distance}m` : 0}</p>
                    <div>
                        <img src={moreIcon} />
                    </div>
                </div>
            })}
        </div>
        {/* <p>{import.meta.env.VITE_PLACES_KEY}</p> */}
    </div>
}