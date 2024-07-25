import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";

import OrderList from "./OrderList";
import TopBar from "./TopBar";
import AddOrder from "./AddOrder";

import { useAppConfigStore } from "stores/appConfig";
import { useOrdersStore } from "stores/orders";
import ShowPriceQuotes from "./ShowPriceQuotes";
import AddOutlet from "./AddOutlet";
import { LocationAddress, Order } from "@lib/interfaces";
import dayjs from "dayjs";
import OrderInfo from "./OrderInfo";
import CancelOrder from "./CancelOrder";


interface State {
    addOrderDisplay: boolean
    priceQuotesDisplay: boolean
    addOutletDisplay: boolean
    orderInfoDisplay: boolean
    cancelOrderDisplay: boolean
    billNumber?: string
    storeId?: string
    drop?: LocationAddress
    orderAmount?: string
    category?: string
    orderFilterDate: string
    toBeCancelledOrder?: string
    quoteId?: string
    chosenStoreId?: string
    chosenOrder?: string
}

const initialValue: State = {
    addOrderDisplay: false, priceQuotesDisplay: false, orderInfoDisplay: false, 
    addOutletDisplay: false, cancelOrderDisplay: false, orderFilterDate: dayjs().format('YYYY-MM-DD')
}


const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default () => {

    const [state, dispatch] = useReducer(reducer, initialValue)

    const { token, selectedAccount, clearAuth, setToast, accountIds, phone, switchAccount } = useAppConfigStore(state => ({ 
        token: state.token, 
        selectedAccount: state.selectedAccount, 
        clearAuth: state.clearAuth, 
        setToast: state.setToast, 
        accountIds: state.accountIds, 
        phone: state.phone,
        switchAccount: state.switchAccount
    }))

    const { getOrders, orders, googlePlacesApi, getPickupList, activity, pickupStores, createOrder, cancelOrder, getWalletDashboardLink,
        getPriceQuote, addOutlet, saveInStorage, googlePlaceDetailsApi, orderPriceQuote, getCustomerInfo } = useOrdersStore(state => ({
            orders: state.orders,
            getOrders: state.getOrders,
            googlePlacesApi: state.googlePlacesApi,
            activity: state.activity,
            getPriceQuote: state.getPriceQuote,
            getPickupList: state.getPickupList,
            pickupStores: state.pickupStores,
            createOrder: state.createOrder,
            cancelOrder: state.cancelOrder,
            orderPriceQuote: state.orderPriceQuote,
            addOutlet: state.addOutlet,
            saveInStorage: state.saveInStorage,
            googlePlaceDetailsApi: state.googlePlaceDetailsApi,
            getCustomerInfo: state.getCustomerInfo,
            getWalletDashboardLink: state.getWalletDashboardLink
        }))

    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            getOrders(token, state.orderFilterDate)
        } else {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if (token) {
            getOrders(token, state.orderFilterDate)
        }
    }, [state.orderFilterDate])

    return <div>
        <TopBar
            selectedAccount={selectedAccount || ''}
            clearAuth={clearAuth}
            getWalletInfoPageLink={(callback) => {
                getWalletDashboardLink(token || '', (link) => {
                    callback(link)
                })
            }}
            accountIds={accountIds}
            phoneNumber={phone}
            switchAccount={accountId => {
                switchAccount(token || '', accountId, (success) => {
                    if (success) {
                        setToast('Account switched successfully', 'success')
                    } else {
                        setToast('Error switching account', 'error')
                    }
                })
            }}
        />
        <OrderList
            onAddOrder={() => dispatch({ type: 'update', payload: { addOrderDisplay: true } })}
            onRefresh={() => token ? getOrders(token, state.orderFilterDate) : null}
            onCancelOrder={orderId => {
                dispatch({ type: 'update', payload: { toBeCancelledOrder: orderId, cancelOrderDisplay: true } })
            }}
            orders={orders}
            activity={activity}
            filterDate={state.orderFilterDate}
            changeDate={val => dispatch({ type: 'update', payload: { orderFilterDate: val } })}
            chooseOrder={orderId => {
                dispatch({ type: 'update', payload: { chosenOrder: orderId, orderInfoDisplay: true } })
            }}
        />
        <AddOrder
            open={state.addOrderDisplay}
            onClose={() => dispatch({ type: 'update', payload: { addOrderDisplay: false } })}
            onPlacesSearch={(searchText, callback, latitude, longitude) => {
                googlePlacesApi(searchText, callback, latitude, longitude)
            }}
            onPlaceChoose={(placeId, callback) => {
                googlePlaceDetailsApi(placeId, callback)
            }}
            getPickupList={callback => token ? getPickupList(token, callback) : null}
            activity={activity}
            pickupStores={pickupStores}
            createOrder={(billNumber, storeId, amount, category, drop) => {
                createOrder(token || '', billNumber, storeId, drop, amount, category, undefined, undefined, (success) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOrderDisplay: false } })
                        getOrders(token || '', state.orderFilterDate)
                        setToast('Order created successfully', 'success')
                    } else {
                        setToast('Error creating order', 'error')
                    }
                })
            }}
            checkPrice={(billNumber, storeId, orderAmount, category, drop) => {
                getPriceQuote(token || '', storeId, drop, parseFloat(orderAmount), category, (quoteId) => {
                    dispatch({ type: 'update', payload: { priceQuotesDisplay: true, billNumber, storeId, orderAmount, category, drop, quoteId } })
                })
            }}
            showNewOutletForm={(chosenStoreId) => dispatch({ type: 'update', payload: { addOutletDisplay: true, chosenStoreId } })}
            saveInStorage={(keyName, value) => saveInStorage(keyName, value)}
            getCustomerInfo={(phone, callback) => getCustomerInfo(token || '', phone, callback)}
        />
        <ShowPriceQuotes
            open={state.priceQuotesDisplay}
            onClose={() => dispatch({ type: 'update', payload: { priceQuotesDisplay: false } })}
            priceQuotes={orderPriceQuote} createOrder={(chosenLsp) => {
                if (state.billNumber && state.storeId && state.orderAmount && state.drop && state.category) {
                    createOrder(token || '', state.billNumber, state.storeId, state.drop, state.orderAmount, state.category, chosenLsp, state.quoteId, (success) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { addOrderDisplay: false, priceQuotesDisplay: false } })
                            getOrders(token || '', state.orderFilterDate)
                            setToast('Order created successfully', 'success')
                        } else {
                            setToast('Error creating order', 'error')
                        }
                    })
                }
            }}
            loading={activity.createOrder}
        />
        <AddOutlet
            open={state.addOutletDisplay}
            onClose={() => dispatch({ type: 'update', payload: { addOutletDisplay: false } })}
            onPlacesSearch={(searchText, callback) => {
                googlePlacesApi(searchText, callback)
            }}
            activity={activity}
            addOutlet={(storeId, address, placesId) => {
                addOutlet(state.chosenStoreId ? 'update' : 'create', token || '', storeId, address, placesId, (success) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOutletDisplay: false } })
                        getPickupList(token || '', () => null)
                        setToast('Outlet created successfully', 'success')
                    } else {
                        setToast('Error creating outlet', 'error')
                    }
                })
            }}
            onPlaceChoose={(placeId, callback) => {
                googlePlaceDetailsApi(placeId, callback)
            }}
            chosenStore={pickupStores.find(e => e.storeId === state.chosenStoreId)}
        />
        <OrderInfo
            open={state.orderInfoDisplay}
            onClose={() => dispatch({ type: 'update', payload: { orderInfoDisplay: false } })}
            orderInfo={orders.find(e => e.orderId === state.chosenOrder)}
            onCancelOrder={orderId => {
                dispatch({ type: 'update', payload: { toBeCancelledOrder: orderId, cancelOrderDisplay: true } })
            }}
        />
        <CancelOrder
            open={state.cancelOrderDisplay}
            onClose={() => dispatch({ type: 'update', payload: { cancelOrderDisplay: false } })}
            onCancel={reason => {
                cancelOrder(token || '', state.toBeCancelledOrder || '', reason, (success) => {
                    if (success) {
                        setToast('Order cancelled.', 'success')
                        dispatch({ type: 'update', payload: { cancelOrderDisplay: false } })
                    } else {
                        setToast('Error cancelling order', 'error')
                    }
                })
            }}
            loading={activity.cancelOrder}
        />
    </div>
}       