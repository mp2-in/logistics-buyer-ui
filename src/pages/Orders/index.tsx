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
import OrderInfo from "./OrderInfoModal";
import CancelOrder from "./CancelOrder";
import RaiseIssue from "./RaiseIssue";
import OrderFulfillment from "./OrderFulfillment";
import OrderList from "./OrderList";
import InsufficientBalanceDialog from "./InsufficientBalanceDialog";


interface State {
    addOrderDisplay: boolean
    priceQuotesDisplay: boolean
    addOutletDisplay: boolean
    orderInfoDisplay: boolean
    cancelOrderDisplay: boolean
    raiseIssueDisplay: boolean
    fulfillOrderDisplay: boolean
    insufficientBalanceDialogDisplay: boolean
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
    walletBalanceErrorMsg: string
    readyToShip: boolean
}

const initialValue: State = {
    addOrderDisplay: false, priceQuotesDisplay: false, orderInfoDisplay: false, raiseIssueDisplay: false, insufficientBalanceDialogDisplay: false, readyToShip: true,
    addOutletDisplay: false, cancelOrderDisplay: false, fulfillOrderDisplay: false, orderFilterDate: dayjs().format('YYYY-MM-DD'), walletBalanceErrorMsg: ''
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

    const { token, setToast, isRetail, role, setPage, email, phone, accountId } = useAppConfigStore(state => ({
        token: state.token,
        setToast: state.setToast,
        isRetail: state.isRetail,
        role: state.role,
        setPage: state.setPage,
        email: state.email,
        phone: state.phone,
        accountId: state.selectedAccount
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
            setPage('orders')
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
        }} />
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
            onOrderFulfillment={orderId => {
                dispatch({ type: 'update', payload: { toBeFulfilledOrder: orderId, fulfillOrderDisplay: true } })
            }}
            onAddOrder={(orderId) => dispatch({ type: 'update', payload: { addOrderDisplay: true, toBeRebookedOrder: orderId } })}
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
            createOrder={(billNumber, storeId, amount, drop, readyToShip) => {
                createOrder(token || '', billNumber, storeId, drop, amount, undefined, undefined, undefined, readyToShip, (success, message, insufficientBalance) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { addOrderDisplay: false } })
                        getOrders(token || '', state.orderFilterDate)
                        setToast('Order created successfully', 'success')
                    } else {
                        if (insufficientBalance) {
                            dispatch({ type: 'update', payload: { insufficientBalanceDialogDisplay: true, walletBalanceErrorMsg: message } })
                        } else {
                            setToast(message || 'Error creating order', 'error')
                        }
                    }
                })
            }}
            checkPrice={(billNumber, storeId, orderAmount, drop, readyToShip) => {
                getPriceQuote(token || '', storeId, drop, parseFloat(orderAmount), (success, quoteId, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { priceQuotesDisplay: true, billNumber, storeId, orderAmount, drop, quoteId, readyToShip } })
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
            priceQuotes={orderPriceQuote} createOrder={(chosenLsp, chosenItem) => {
                if (state.billNumber && state.storeId && state.orderAmount && state.drop) {
                    createOrder(token || '', state.billNumber, state.storeId, state.drop, state.orderAmount, chosenLsp, state.quoteId, chosenItem, state.readyToShip, (success, message, insufficientBalance) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { addOrderDisplay: false, priceQuotesDisplay: false } })
                            getOrders(token || '', state.orderFilterDate)
                            setToast('Order created successfully', 'success')
                        } else {
                            if (insufficientBalance) {
                                dispatch({ type: 'update', payload: { insufficientBalanceDialogDisplay: true, walletBalanceErrorMsg: message, priceQuotesDisplay: false } })
                            } else {
                                dispatch({ type: 'update', payload: { priceQuotesDisplay: false } })
                                setToast(message || 'Error creating order', 'error')
                            }
                        }
                    })
                }
            }}
            loading={activity.createOrder}
            orderAmount={parseFloat(state.orderAmount || '0')}
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
            orderState={orders.find(e => e.orderId === state.toBeCancelledOrder)?.orderState || ''}
        />
        <RaiseIssue open={state.raiseIssueDisplay} onClose={() => dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })}
            raiseIssue={(issue, description, refundAmount) => raiseIssue(token || '', state.reportedOrderIssue || '', issue, description, refundAmount, (success, message) => {
                if (success) {
                    setToast('Issue had been registered', 'success')
                    dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })
                } else {
                    setToast(message || 'Error registering issue', 'error')
                }
            })} orderAmount={orders.find(e => e.orderId === state.reportedOrderIssue)?.orderAmount || 0} deliveryFee={orders.find(e => e.orderId === state.reportedOrderIssue)?.deliveryFee || 0}
            loading={activity.raiseIssue} orderStatus={orders.find(e => e.orderId === state.reportedOrderIssue)?.orderState || ''} />
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
        <InsufficientBalanceDialog open={state.insufficientBalanceDialogDisplay} onClose={() => dispatch({ type: 'update', payload: { insufficientBalanceDialogDisplay: false } })}
            accountId={accountId} email={email} phone={phone} message={state.walletBalanceErrorMsg} />
    </div>
}       