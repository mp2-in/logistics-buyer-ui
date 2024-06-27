import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import OrderList from "./OrderList";
import TopBar from "./TopBar";
import AddOrder from "./AddOrder";

import { useAppConfigStore } from "stores/appConfig";
import { useOrdersStore } from "stores/orders";
import AccountDetails from "./AccountDetails";
import ShowPriceQuotes from "./ShowPriceQuotes";


export default () => {
    const [showAddOrder, setAddOrderDisplay] = useState(false)
    const [showAccountDetails, setAccountDetailsDisplay] = useState(false)
    const [showPriceQuotes, setQuotesDisplay] = useState(false)

    const { token, accountId, clearAuth, setToast } = useAppConfigStore(state => ({ token: state.token, accountId: state.accountId, clearAuth: state.clearAuth, setToast: state.setToast }))
    const { getOrders, orders, googlePlacesApi, getPickupList, activity, pickupStores, createOrder, cancelOrder, getPriceQuote, orderPriceQuote } = useOrdersStore(state => ({
        orders: state.orders, getOrders: state.getOrders, googlePlacesApi: state.googlePlacesApi, activity: state.activity, getPriceQuote: state.getPriceQuote,
        getPickupList: state.getPickupList, pickupStores: state.pickupStores, createOrder: state.createOrder, cancelOrder: state.cancelOrder,
        orderPriceQuote: state.orderPriceQuote
    }))

    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            getOrders(token)
        } else {
            navigate('/login')
        }
    }, [])

    return <div>
        <TopBar accountId={accountId || ''} showAccountDetails={() => setAccountDetailsDisplay(true)} />
        <OrderList onAddOrder={() => setAddOrderDisplay(true)} onRefresh={() => token ? getOrders(token) : null} onCancelOrder={(orderId, reason, callback) => {
            cancelOrder(token || '', orderId, reason, (success) => {
                if (success) {
                    setToast('Order cancelled.', 'success')
                    callback()
                } else {
                    setToast('Error cancelling order', 'error')
                }
            })
        }} orders={orders} activity={activity} />
        <AddOrder open={showAddOrder} onClose={() => setAddOrderDisplay(false)} onPlacesSearch={(searchText, callback) => {
            googlePlacesApi(searchText, callback)
        }} getPickupList={() => token ? getPickupList(token) : null} activity={activity}
            pickupStores={pickupStores} createOrder={(billNumber, storeId, amount, drop) => {
                createOrder(token || '', billNumber, storeId, drop, amount, (success) => {
                    if (success) {
                        setAddOrderDisplay(false)
                        getOrders(token || '')
                        setToast('Order created successfully', 'success')
                    } else {
                        setToast('Error creating order', 'error')
                    }
                })
            }} checkPrice={(storeId, orderAmount, drop) => {
                getPriceQuote(token || '', storeId, drop, parseFloat(orderAmount), () => {
                    setQuotesDisplay(true)
                })
            }} />
        <AccountDetails open={showAccountDetails} onClose={() => setAccountDetailsDisplay(false)} accountId={accountId || ''} onLogout={() => clearAuth()} />
        <ShowPriceQuotes open={showPriceQuotes} onClose={() => setQuotesDisplay(false)} priceQuotes={orderPriceQuote}/>
    </div>
}       