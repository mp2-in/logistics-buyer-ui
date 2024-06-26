import { create } from 'zustand'
import { produce } from 'immer'
import { Api, GooglePlacesApi } from '@lib/utils'
import { LocationAddress, Order, PickupStore, Place, PriceQuote } from '@lib/interfaces'

interface Attributes {
    orders: Order[],
    activity: { [k: string]: boolean },
    pickupStores: PickupStore[],
    orderPriceQuote: PriceQuote[]
}

interface State extends Attributes {
    getOrders: (token: string) => void,
    getPickupList: (token: string) => void,
    googlePlacesApi: (searchText: string, callback: (data: Place[]) => void) => void
    createOrder: (token: string, billNumber: string, storeId: string, drop: LocationAddress, amount: string, callback: (success: boolean) => void) => void
    cancelOrder: (token: string, orderId: string, cancellationReason: string, callback: (success: boolean) => void) => void
    getPriceQuote: (token: string, storeId: string, drop: LocationAddress, orderAmount: number, callback: () => void) => void
    addOutlet: (token: string, storeId: string, drop: LocationAddress, placesId: string, callback: (success: boolean) => void) => void
}

const initialState: Attributes = { orders: [], activity: {}, pickupStores: [], orderPriceQuote: [] };

export const useOrdersStore = create<State>()((set, get) => ({
    ...initialState,
    getOrders: async (token) => {
        set(produce((state: State) => {
            state.activity.getOrders = true
        }))
        Api('/webui/orders', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {} })
            .then(res => {
                set(produce((state: State) => {
                    state.orders = res
                    state.activity.getOrders = false
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getOrders = false
                }))
            })
    },
    getPickupList: async (token: string) => {
        set(produce((state: State) => {
            state.activity.getPickupList = true
        }))
        Api('/webui/pickup/list', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {} })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.getPickupList = false
                    state.pickupStores = res
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getPickupList = false
                }))
            })
    },
    googlePlacesApi: async (searchText, callback) => {
        GooglePlacesApi(searchText)
            .then(res => {
                console.log(res.places)
                callback(res.places)
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getOrders = false
                }))
            })
    },
    createOrder: async (token, billNumber, storeId, drop, amount, callback) => {
        set(produce((state: State) => {
            state.activity.createOrder = true
        }))
        Api('/webui/order/createasync', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {
                client_order_id: billNumber,
                pickup: {
                    code: "1234",
                    store_id: storeId
                },
                drop: drop,
                customer_promised_time: "2024-06-26 16:06:23",
                order_category: "F&B",
                search_category: "Immediate Delivery",
                ready_to_ship: "yes",
                order_amount: amount,
                order_items: [],
                select_criteria: {
                    mode: "auto_select"
                }
            }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.createOrder = false
                }))
                if (res.status === 1) {
                    callback(true)
                } else {
                    callback(false)
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.createOrder = false
                }))
                callback(false)
            })
    },
    cancelOrder: async (token, orderId, cancellationReason, callback) => {
        set(produce((state: State) => {
            state.activity.cancelOrder = true
        }))
        Api('/webui/order/cancel', {
            method: 'post', headers: { token }, data: {
                order: {
                    id: orderId,
                    cancellation_reason_id: cancellationReason
                }
            }
        }).then(res => {
            set(produce((state: State) => {
                state.activity.cancelOrder = false
            }))
            if (res.status === 1) {
                callback(true)
            } else {
                callback(false)
            }
        }).catch(() => {
            set(produce((state: State) => {
                state.activity.cancelOrder = false
            }))
            callback(false)
        })
    },
    getPriceQuote: async (token, storeId, drop, orderAmount, callback) => {
        set(produce((state: State) => {
            state.activity.getPriceQuote = true
        }))

        const storeDetails = get().pickupStores.find(e => e.storeId === storeId)

        if (storeDetails) {
            Api('/webui/quotes', {
                method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {
                    pickup: {
                        lat: storeDetails.latitude,
                        lng: storeDetails.longitude,
                        pincode: storeDetails.pincode
                    },
                    drop: {
                        lat: drop.lat,
                        lng: drop.lng,
                        pincode: drop.pincode
                    },
                    city: storeDetails.address.city,
                    order_category: "F&B",
                    search_category: "Immediate Delivery",
                    order_amount: orderAmount
                }
            })
                .then(res => {
                    set(produce((state: State) => {
                        state.activity.getPriceQuote = false
                        state.orderPriceQuote = res.quotes
                    }))
                    callback()
                })
                .catch(() => {
                    set(produce((state: State) => {
                        state.activity.getPriceQuote = false
                    }))
                })
        }
    },
    addOutlet: async (token, storeId, drop, placesId, callback) => {
        set(produce((state: State) => {
            state.activity.addOutlet = true
        }))
        Api('/webui/pickup/create', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {
                store_id: storeId,
                ...drop,
                google_place_id: placesId
            }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.addOutlet = false
                }))
                if (res.status === 1) {
                    callback(true)
                } else {
                    callback(false)
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.addOutlet = false
                }))
                callback(false)
            })
    },
}))
