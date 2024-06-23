import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

import { useOrdersStore } from 'stores/orders'
import { useAppConfigStore } from 'stores/appConfig'

import moreIcon from '@assets/more.png'

import styles from './OrderList.module.scss'


export default () => {
    const { getOrders, orders } = useOrdersStore(state => ({ orders: state.orders, getOrders: state.getOrders, activity: state.activity }))
    const { token } = useAppConfigStore(state => ({ token: state.token }))
    const navigate  = useNavigate()

    useEffect(() => {
        if(token) {
            getOrders(token)
        } else {
            navigate('/login')
        }
    }, [])

    return <div className={styles.container}>
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
                    <p>{e.created_at}</p>
                    <p>{e.client_order_id}</p>
                    <p>{e.lsp.name}l</p>
                    <p>{e.lsp.item_id}</p>
                    <p>{e.price}</p>
                    <p>{e.distance}m</p>
                    <div>
                        <img src={moreIcon} />
                    </div>
                </div>
            })}
        </div>
        {/* <p>{import.meta.env.VITE_PLACES_KEY}</p> */}
    </div>
}