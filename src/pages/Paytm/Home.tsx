import backIcon from "@assets/back.png"
import walletIcon from "@assets/wallet.png"
import AddOutlet from "./AddOutlet"
import { useOrdersStore } from "stores/orders"
import { useAppConfigStore } from "stores/appConfig"
import { useEffect, useReducer } from "react"
import PlaceOrderForm from "./PlaceOrderForm"
import { OrderFormData } from "./interfaces"
import NavMenu from "./NavMenu"
import ShowQuote from "./ShowQuote"
import { useNavigate, useParams } from "react-router-dom"
import OrderList from "./OrderList"
import dayjs from "dayjs"
import Settings from "./Settings"
import CancelOrder from "./CancelOrder"


const initialValue: OrderFormData = {
    showAddAddress: false, storeId: '', address: '', placesResponse: [], dropPlaceId: '', phoneNumber: '', billNumber: '', showQuotes: false,
    dropFormattedAddressLine1: '', dropFormattedAddressLine2: '', city: '', pincode: '', name: '', state: '', orderAmount: '', pickupOtp: '',
    showCancelOrderModal: false
}

const reducer = (state: OrderFormData, action: { type: 'reset' } | { type: 'update', payload: Partial<OrderFormData> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default () => {
    const { page } = useParams() as { page: string | undefined }
    const [state, dispatch] = useReducer(reducer, initialValue)

    const navigate = useNavigate()

    const { googlePlacesApi, activity, googlePlaceDetailsApi, addOutlet, getPickupList,
        pickupStores, getPriceQuote, createOrder, getOrders, orders, cancelOrder } = useOrdersStore(state => ({
            googlePlacesApi: state.googlePlacesApi,
            activity: state.activity,
            googlePlaceDetailsApi: state.googlePlaceDetailsApi,
            addOutlet: state.addOutlet,
            getPickupList: state.getPickupList,
            pickupStores: state.pickupStores,
            getPriceQuote: state.getPriceQuote,
            createOrder: state.createOrder,
            getOrders: state.getOrders,
            orders: state.orders,
            cancelOrder: state.cancelOrder
        }))

    const { token, setToast, role } = useAppConfigStore(state => ({ token: state.token, setToast: state.setToast, role: state.role }))

    useEffect(() => {
        getPickupList(token || '', () => null)
        getOrders(token || '', dayjs().format('YYYY-MM-DD'))
    }, [])

    const isDisabled = () => {
        let keys: (keyof OrderFormData)[] = ['storeId', 'dropPlaceId', 'phoneNumber', 'billNumber', 'city', 'pincode', 'name', 'orderAmount']
        return keys.findIndex(e => !state[e]) > -1
    }

    return <><div className="absolute left-0 right-0 top-0 bottom-0">
        <div className="w-full h-[60px] border-b border-gray-500 flex justify-between items-center px-3 absolute">
            <img src={backIcon} className="w-10" onClick={() => navigate(-1)} />
            <div className="flex items-center">
                <p className="font-semibold text-xl" >Paytm Swift</p>
                <img src={walletIcon} className="w-6 ml-4 mr-2" />
                <p>Rs 254</p>
            </div>
        </div>
        {state.showQuotes && state.quote ? <ShowQuote minPrice={state.quote.minPrice} maxPrice={state.quote.maxPrice}
            pickupEta={state.quote.pickupEta} sla={state.quote.sla} distance={state.quote.distance} onClick={callback => {
                if (state.storeLatitude && state.storeLongitude) {
                    createOrder(token || '', state.billNumber, state.pickupOtp, state.storeId, {
                        lat: state.storeLatitude, lng: state.storeLongitude, address: {
                            name: state.name, line1: state.dropFormattedAddressLine1,
                            line2: state.dropFormattedAddressLine2,
                            city: state.city, state: state.state
                        }, pincode: state.pincode, phone: state.phoneNumber
                    }, state.orderAmount, undefined, undefined, undefined, (success, message) => {
                        if (success) {
                            getOrders(token || '', dayjs().format('YYYY-MM-DD'))
                            callback(message || '')
                        }
                    })
                }
            }} loading={activity.createOrder} reset={() => dispatch({ type: 'reset' })} /> : page === 'orders' ? <>
                <OrderList orders={orders} onCancelOrder={orderId => {
                     dispatch({ type: 'update', payload: { showCancelOrderModal: true, toBeCancelledOrder: orderId } })
                }} />
                <NavMenu page="orders" />
            </> : page === 'settings' ? <>
                <Settings />
                <NavMenu page="settings" />
            </> : <>
            <PlaceOrderForm data={state} update={payload => dispatch({ type: 'update', payload })} />
            <NavMenu onClick={() => {
                if (state.storeLatitude && state.storeLongitude) {
                    getPriceQuote(token || '', state.storeId, {
                        lat: state.storeLatitude, lng: state.storeLongitude, address: {
                            name: state.name, line1: state.dropFormattedAddressLine1,
                            line2: state.dropFormattedAddressLine2,
                            city: state.city, state: state.state
                        }, pincode: state.pincode, phone: state.phoneNumber
                    }, parseFloat(state.orderAmount), (success, _q, _m, orderPriceQuote) => {
                        if (success && orderPriceQuote) {
                            const quotes = [...orderPriceQuote].sort((a, b) => a.price_forward < b.price_forward ? -1 : 1)
                            dispatch({
                                type: 'update', payload: {
                                    showQuotes: true, quote: {
                                        minPrice: quotes[0].price_forward, maxPrice: quotes[quotes.length - 1].price_forward,
                                        distance: orderPriceQuote[0].distance, pickupEta: orderPriceQuote[0].pickup_eta, sla: orderPriceQuote[0].sla
                                    }
                                }
                            })
                        }
                    })
                }
            }} disabled={isDisabled()} loading={activity.getPriceQuote} page={'neworder'} />
        </>}
    </div>
        <AddOutlet
            open={state.showAddAddress}
            onClose={() => dispatch({ type: 'update', payload: { showAddAddress: false } })}
            onPlacesSearch={(searchText, callback) => {
                googlePlacesApi(searchText, callback)
            }}
            activity={activity}
            addOutlet={(storeId, address, placesId) => {
                addOutlet(storeId ? 'update' : 'create', token || '', storeId, address, placesId, (success, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { showAddAddress: false } })
                        getPickupList(token || '', () => null)
                        setToast('Address updated successfully', 'success')
                    } else {
                        setToast(message || 'Error creating outlet', 'error')
                    }
                })
            }}
            onPlaceChoose={(placeId, callback) => {
                googlePlaceDetailsApi(placeId, callback)
            }}
            chosenStore={pickupStores.find(e => e.storeId === state.storeId)}
        />
        <CancelOrder
            open={state.showCancelOrderModal}
            onClose={() => dispatch({ type: 'update', payload: { showCancelOrderModal: false } })}
            onCancel={reason => {
                cancelOrder(token || '', state.toBeCancelledOrder || '', reason, /super_admin/.test(role || ''), (success, message) => {
                    if (success) {
                        setToast('Order cancelled.', 'success')
                        dispatch({ type: 'update', payload: { showCancelOrderModal: false } })
                    } else {
                        setToast(message || 'Error cancelling order', 'error')
                    }
                })
            }}
            loading={activity.cancelOrder}
            orderState={orders.find(e => e.orderId === state.toBeCancelledOrder)?.orderState || ''}
            isInternalUser={/super_admin/.test(role || '')}
        />
    </>
}