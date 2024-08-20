import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";

import TopBar from "@components/TopBar";
import AddOrder from "./AddOrder";

import { useAppConfigStore } from "stores/appConfig";
import { useOrdersStore } from "stores/orders";
import ShowPriceQuotes from "./ShowPriceQuotes";
import AddOutlet from "./AddOutlet";
import { LocationAddress } from "@lib/interfaces";
import dayjs from "dayjs";
import OrderInfo from "./OrderInfo";
import CancelOrder from "./CancelOrder";
import RaiseIssue from "./RaiseIssue";
import OrderFulfillment from "./OrderFulfillment";
import OrderList from "./OrderList";


interface State {
    addOrderDisplay: boolean
    priceQuotesDisplay: boolean
    addOutletDisplay: boolean
    orderInfoDisplay: boolean
    cancelOrderDisplay: boolean
    raiseIssueDisplay: boolean
    fulfillOrderDisplay: boolean
    billNumber?: string
    storeId?: string
    drop?: LocationAddress
    orderAmount?: string
    orderFilterDate: string
    toBeCancelledOrder?: string
    quoteId?: string
    chosenStoreId?: string
    chosenOrder?: string
    reportedOrderIssue?: string
    toBeFulfilledOrder?: string
    toBeRebookedOrder?: string
}

const initialValue: State = {
    addOrderDisplay: false, priceQuotesDisplay: false, orderInfoDisplay: false, raiseIssueDisplay: false,
    addOutletDisplay: false, cancelOrderDisplay: false, fulfillOrderDisplay: false, orderFilterDate: dayjs().format('YYYY-MM-DD')
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

    const { token, setToast, isRetail, role } = useAppConfigStore(state => ({
        token: state.token,
        setToast: state.setToast,
        isRetail: state.isRetail,
        role: state.role
    }))

    const { getOrders, orders, googlePlacesApi, getPickupList, activity, pickupStores, createOrder, cancelOrder, assignAgent,
        getPriceQuote, addOutlet, saveInStorage, googlePlaceDetailsApi, orderPriceQuote, getCustomerInfo, raiseIssue, clearPickupList } = useOrdersStore(state => ({
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
            raiseIssue: state.raiseIssue,
            assignAgent: state.assignAgent,
            clearPickupList: state.clearPickupList
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
        <TopBar title="Orders" onAccountSwitch={(newToken) => {
            getOrders(newToken, state.orderFilterDate)
            clearPickupList()
        }}/>
        <OrderList
            onAddOrder={(orderId) => dispatch({ type: 'update', payload: { addOrderDisplay: true, toBeRebookedOrder: orderId } })}
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
            onIssueReport={orderId => {
                dispatch({ type: 'update', payload: { reportedOrderIssue: orderId, raiseIssueDisplay: true } })
            }}
            onOrderFulfillment={orderId => {
                dispatch({ type: 'update', payload: { toBeFulfilledOrder: orderId, fulfillOrderDisplay: true } })
            }}
            isRetail={isRetail || false}
            token={token}
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
            createOrder={(billNumber, storeId, amount, drop) => {
                createOrder(token || '', billNumber, storeId, drop, amount, undefined, undefined, (success, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOrderDisplay: false } })
                        getOrders(token || '', state.orderFilterDate)
                        setToast('Order created successfully', 'success')
                    } else {
                        setToast(message || 'Error creating order', 'error')
                    }
                })
            }}
            checkPrice={(billNumber, storeId, orderAmount, drop) => {
                getPriceQuote(token || '', storeId, drop, parseFloat(orderAmount), (success, quoteId, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { priceQuotesDisplay: true, billNumber, storeId, orderAmount, drop, quoteId } })
                    } else {
                        setToast(message || 'Error fetching price quotes', 'error')
                    }
                })
            }}
            showNewOutletForm={(chosenStoreId) => dispatch({ type: 'update', payload: { addOutletDisplay: true, chosenStoreId } })}
            saveInStorage={(keyName, value) => saveInStorage(keyName, value)}
            getCustomerInfo={(phone, callback) => getCustomerInfo(token || '', phone, callback)}
            role={role || ''}
            orderDetails={orders.find(e => e.orderId === state.toBeRebookedOrder)}
        />
        <ShowPriceQuotes
            open={state.priceQuotesDisplay}
            onClose={() => dispatch({ type: 'update', payload: { priceQuotesDisplay: false } })}
            priceQuotes={orderPriceQuote} createOrder={(chosenLsp) => {
                if (state.billNumber && state.storeId && state.orderAmount && state.drop) {
                    createOrder(token || '', state.billNumber, state.storeId, state.drop, state.orderAmount, chosenLsp, state.quoteId, (success, message) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { addOrderDisplay: false, priceQuotesDisplay: false } })
                            getOrders(token || '', state.orderFilterDate)
                            setToast('Order created successfully', 'success')
                        } else {
                            setToast(message || 'Error creating order', 'error')
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
                addOutlet(state.chosenStoreId ? 'update' : 'create', token || '', storeId, address, placesId, (success, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOutletDisplay: false } })
                        getPickupList(token || '', () => null)
                        setToast('Outlet created successfully', 'success')
                    } else {
                        setToast(message || 'Error creating outlet', 'error')
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
            onIssueReport={orderId => {
                dispatch({ type: 'update', payload: { reportedOrderIssue: orderId, raiseIssueDisplay: true } })
            }}
        />
        <CancelOrder
            open={state.cancelOrderDisplay}
            onClose={() => dispatch({ type: 'update', payload: { cancelOrderDisplay: false } })}
            onCancel={reason => {
                cancelOrder(token || '', state.toBeCancelledOrder || '', reason, (success, message) => {
                    if (success) {
                        setToast('Order cancelled.', 'success')
                        dispatch({ type: 'update', payload: { cancelOrderDisplay: false } })
                    } else {
                        setToast(message || 'Error cancelling order', 'error')
                    }
                })
            }}
            loading={activity.cancelOrder}
        />
        <RaiseIssue open={state.raiseIssueDisplay} onClose={() => dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })}
            raiseIssue={(issue, description) => raiseIssue(token || '', state.reportedOrderIssue || '', issue, description, (success, message) => {
                if (success) {
                    setToast('Issue had been registered', 'success')
                    dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })
                } else {
                    setToast(message || 'Error registering issue', 'error')
                }
            })} loading={activity.raiseIssue} />
        <OrderFulfillment open={state.fulfillOrderDisplay} onClose={() => dispatch({ type: 'update', payload: { fulfillOrderDisplay: false } })} assignRider={() => {
            assignAgent(token || '', state.toBeFulfilledOrder || '', orders.find(e => e.orderId === state.toBeFulfilledOrder)?.pcc || '', (success, message) => {
                if (success) {
                    setToast(message || 'Agent successfully assigned', 'success')
                    dispatch({ type: 'update', payload: { fulfillOrderDisplay: false } })
                } else {
                    setToast(message || 'Error proceeding with fulfillment of the order', 'error')
                }
            })
        }} loading={activity.assignAgent} />
    </div>
}       