import searchIcon from '@assets/search.png'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import dayjs from "dayjs"
import { useNavigate, useParams } from 'react-router-dom'
import { useOrdersStore } from 'stores/orders'
import { useEffect, useReducer, useState } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { LocationAddress, Order } from '@lib/interfaces'
import TopBar from '@components/TopBar'
import Input from '@components/Input'
import OrderDetails from './OrderDetails'
import AddOrder from './AddOrder'
import ShowPriceQuotes from './ShowPriceQuotes'
import AddOutlet from './AddOutlet'
import CancelOrder from './CancelOrder'
import RaiseIssue from './RaiseIssue'
import OrderFulfillment from './OrderFulfillment'
import InsufficientBalanceDialog from './InsufficientBalanceDialog'

dayjs.extend(advancedFormat)


interface State {
    addOrderDisplay: boolean
    insufficientBalanceDialogDisplay: boolean
    walletBalanceErrorMsg: string
    priceQuotesDisplay: boolean
    billNumber?: string
    storeId?: string
    orderAmount?: string
    drop?: LocationAddress
    quoteId?: string
    addOutletDisplay: boolean
    chosenStoreId?: string
    cancelOrderDisplay: boolean
    raiseIssueDisplay: boolean
    fulfillOrderDisplay: boolean
    readyToShip: boolean
}

const initialValue: State = {
    addOrderDisplay: false, insufficientBalanceDialogDisplay: false, walletBalanceErrorMsg: '',
    priceQuotesDisplay: false, addOutletDisplay: false, cancelOrderDisplay: false,
    raiseIssueDisplay: false, fulfillOrderDisplay: false, readyToShip: true
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
    const { orderId } = useParams() as { orderId: string | undefined }

    const { token, setToast, role, accountId, phone, email, setPage } = useAppConfigStore(state => ({
        token: state.token,
        setToast: state.setToast,
        setPage: state.setPage,
        role: state.role,
        accountId: state.selectedAccount,
        email: state.email,
        phone: state.phone
    }))

    const { getOrderInfo, googlePlacesApi, googlePlaceDetailsApi, getPickupList, activity, orderPriceQuote, addOutlet, assignAgent,
        pickupStores, createOrder, getPriceQuote, saveInStorage, getCustomerInfo, cancelOrder, raiseIssue } = useOrdersStore(state => ({
            getOrderInfo: state.getOrderInfo,
            googlePlacesApi: state.googlePlacesApi,
            googlePlaceDetailsApi: state.googlePlaceDetailsApi,
            getPickupList: state.getPickupList,
            activity: state.activity,
            pickupStores: state.pickupStores,
            createOrder: state.createOrder,
            getPriceQuote: state.getPriceQuote,
            saveInStorage: state.saveInStorage,
            getCustomerInfo: state.getCustomerInfo,
            orderPriceQuote: state.orderPriceQuote,
            addOutlet: state.addOutlet,
            cancelOrder: state.cancelOrder,
            raiseIssue: state.raiseIssue,
            assignAgent: state.assignAgent
        }))

    const [orderInfo, setOrderInfo] = useState<Order | undefined>(undefined)
    const [mp2OrderId, setOrderId] = useState('')
    const [error, setError] = useState(false)

    const [state, dispatch] = useReducer(reducer, initialValue)

    const navigate = useNavigate()

    useEffect(() => {
        if(orderId) {
            setOrderId(orderId)
            getOrderInfo(token || '', orderId, (success, orderInfo) => {
                if (success) {
                    setOrderInfo(orderInfo)
                    setError(false)
                } else {
                    setOrderInfo(undefined)
                    setError(true)
                }
            })
        }
        setPage('search')
    }, [orderId])

    return <div>
        <TopBar title="Order Details" />
        <div className={'absolute left-1 right-1 bottom-5 top-12 flex items-center  overflow-auto flex-col md:top-16'}>
            <div className='mt-3 flex items-end'>
                <Input label='Order Id' value={mp2OrderId} onChange={val => setOrderId(val)} />
                <div className='bg-blue-500 flex justify-center items-center ml-2 p-1 rounded-full mb-1 cursor-pointer' onClick={() => navigate(`/order/${mp2OrderId}`)}>
                    <img src={searchIcon} className='w-4 md:w-6' />
                </div>
            </div>
            <div className='h-[40px] flex items-center justify-center'>
                {error ? <p className='text-sm text-red-500 font-medium'>Invalid order id</p> : null}
            </div>
            <div className={`w-[350px] md:w-[700px] border overflow-auto pb-3 px-3 md:pb-5 md:px-10 lg:px-40 lg:w-[1000px] rounded-md flex flex-col items-center md:block ${error || !orderInfo ? `opacity-35` : ''} relative`}>
                <OrderDetails orderInfo={orderInfo} onAddOrder={() => dispatch({ type: 'update', payload: { addOrderDisplay: true } })}
                    onCancelOrder={() => dispatch({ type: 'update', payload: { cancelOrderDisplay: true } })}
                    onIssueReport={() => dispatch({ type: 'update', payload: { raiseIssueDisplay: true } })}
                    onOrderFulfillment={() => dispatch({ type: 'update', payload: { fulfillOrderDisplay: true } })} actionAtTop />
            </div>
        </div>
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
            orderDetails={orderInfo}
        />
        <ShowPriceQuotes
            open={state.priceQuotesDisplay}
            onClose={() => dispatch({ type: 'update', payload: { priceQuotesDisplay: false } })}
            priceQuotes={orderPriceQuote} createOrder={(chosenLsp, chosenItem) => {
                if (state.billNumber && state.storeId && state.orderAmount && state.drop) {
                    createOrder(token || '', state.billNumber, state.storeId, state.drop, state.orderAmount, chosenLsp, state.quoteId, chosenItem, state.readyToShip, (success, message, insufficientBalance) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { addOrderDisplay: false, priceQuotesDisplay: false } })
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
                cancelOrder(token || '', orderInfo?.orderId || '', reason, (success, message) => {
                    if (success) {
                        setToast('Order cancelled.', 'success')
                        dispatch({ type: 'update', payload: { cancelOrderDisplay: false } })
                    } else {
                        setToast(message || 'Error cancelling order', 'error')
                    }
                })
            }}
            loading={activity.cancelOrder}
            orderState={orderInfo?.orderState || ''}
        />
        <RaiseIssue open={state.raiseIssueDisplay} onClose={() => dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })}
            raiseIssue={(issue, description, refundAmount) => raiseIssue(token || '', orderInfo?.orderId || '', issue, description, refundAmount, (success, message) => {
                if (success) {
                    setToast('Issue had been registered', 'success')
                    dispatch({ type: 'update', payload: { raiseIssueDisplay: false } })
                } else {
                    setToast(message || 'Error registering issue', 'error')
                }
            })} orderAmount={orderInfo?.orderAmount || 0} deliveryFee={orderInfo?.deliveryFee || 0} loading={activity.raiseIssue} orderStatus={orderInfo?.orderState || ''} />
        <OrderFulfillment open={state.fulfillOrderDisplay} onClose={() => dispatch({ type: 'update', payload: { fulfillOrderDisplay: false } })} assignRider={() => {
            assignAgent(token || '', orderInfo?.orderId || '', orderInfo?.pcc || '', (success, message) => {
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