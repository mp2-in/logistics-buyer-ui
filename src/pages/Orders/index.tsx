import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";

import OrderList from "./OrderList";
import TopBar from "./TopBar";
import AddOrder from "./AddOrder";

import { useAppConfigStore } from "stores/appConfig";
import { useOrdersStore } from "stores/orders";
import AccountDetails from "./AccountDetails";
import ShowPriceQuotes from "./ShowPriceQuotes";
import AddOutlet from "./AddOutlet";
import { LocationAddress } from "@lib/interfaces";


interface State {
    addOrderDisplay: boolean,
    accountDetailsDisplay: boolean,
    priceQuotesDisplay: boolean,
    addOutletDisplay: boolean,
    billNumber?: string,
    storeId?: string
    drop?: LocationAddress,
    orderAmount?: string,
    category?: string
}

export default () => {
    const initialValue: State = { addOrderDisplay: false, accountDetailsDisplay: false, priceQuotesDisplay: false, addOutletDisplay: false }

    const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
        switch (action.type) {
            case "update":
                return { ...state, ...action.payload }
            case "reset":
                return initialValue
        }
    }

    const [state, dispatch] = useReducer(reducer, initialValue)

    const { token, accountId, clearAuth, setToast } = useAppConfigStore(state => ({ token: state.token, accountId: state.accountId, clearAuth: state.clearAuth, setToast: state.setToast }))
    const { getOrders, orders, googlePlacesApi, getPickupList, activity, pickupStores, createOrder, cancelOrder, getPriceQuote, addOutlet, orderPriceQuote } = useOrdersStore(state => ({
        orders: state.orders, getOrders: state.getOrders, googlePlacesApi: state.googlePlacesApi, activity: state.activity, getPriceQuote: state.getPriceQuote,
        getPickupList: state.getPickupList, pickupStores: state.pickupStores, createOrder: state.createOrder, cancelOrder: state.cancelOrder,
        orderPriceQuote: state.orderPriceQuote, addOutlet: state.addOutlet
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
        <TopBar accountId={accountId || ''} showAccountDetails={() => dispatch({ type: 'update', payload: { accountDetailsDisplay: true } })} />
        <OrderList onAddOrder={() => dispatch({ type: 'update', payload: { addOrderDisplay: true } })} onRefresh={() => token ? getOrders(token) : null} onCancelOrder={(orderId, reason, callback) => {
            cancelOrder(token || '', orderId, reason, (success) => {
                if (success) {
                    setToast('Order cancelled.', 'success')
                    callback()
                } else {
                    setToast('Error cancelling order', 'error')
                }
            })
        }} orders={orders} activity={activity} />
        <AddOrder open={state.addOrderDisplay} onClose={() => dispatch({ type: 'update', payload: { addOrderDisplay: false } })} onPlacesSearch={(searchText, callback) => {
            googlePlacesApi(searchText, callback)
        }} getPickupList={() => token ? getPickupList(token) : null} activity={activity}
            pickupStores={pickupStores} createOrder={(billNumber, storeId, amount, category, drop) => {
                createOrder(token || '', billNumber, storeId, drop, amount, category, undefined, (success) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOrderDisplay: false } })
                        getOrders(token || '')
                        setToast('Order created successfully', 'success')
                    } else {
                        setToast('Error creating order', 'error')
                    }
                })
            }} checkPrice={(billNumber, storeId, orderAmount, category, drop) => {
                getPriceQuote(token || '', storeId, drop, parseFloat(orderAmount), category,  () => {
                    dispatch({ type: 'update', payload: { priceQuotesDisplay: true, billNumber, storeId, orderAmount, category, drop } })
                })
            }} showNewOutletForm={() => dispatch({ type: 'update', payload: { addOutletDisplay: true } })} />
        <AccountDetails open={state.accountDetailsDisplay} onClose={() => dispatch({ type: 'update', payload: { accountDetailsDisplay: false } })} accountId={accountId || ''}
            onLogout={() => clearAuth()} />
        <ShowPriceQuotes open={state.priceQuotesDisplay} onClose={() => dispatch({ type: 'update', payload: { priceQuotesDisplay: false } })}
            priceQuotes={orderPriceQuote} createOrder={(chosenLsp) => {
                if(state.billNumber && state.storeId && state.orderAmount && state.drop && state.category) {
                    createOrder(token || '', state.billNumber, state.storeId, state.drop, state.orderAmount, state.category, chosenLsp, (success) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { addOrderDisplay: false, priceQuotesDisplay: false } })
                            getOrders(token || '')
                            setToast('Order created successfully', 'success')
                        } else {
                            setToast('Error creating order', 'error')
                        }
                    })
                }
            }} loading={activity.createOrder}/>
        <AddOutlet open={state.addOutletDisplay} onClose={() => dispatch({ type: 'update', payload: { addOutletDisplay: false } })} onPlacesSearch={(searchText, callback) => {
            googlePlacesApi(searchText, callback)
        }} activity={activity} addOutlet={(storeId, address, placesId) => {
            addOutlet(token || '', storeId, address, placesId, (success) => {
                if (success) {
                    dispatch({ type: 'update', payload: { addOutletDisplay: false } })
                    getPickupList(token || '')
                    setToast('Outlet created successfully', 'success')
                } else {
                    setToast('Error creating outlet', 'error')
                }
            })
        }} />
    </div>
}       