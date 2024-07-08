import { create } from 'zustand'
import { produce } from 'immer'
import { Api, GooglePlacesApi, PlaceDetailsApi } from '@lib/utils'
import { LocationAddress, Order, PickupStore, PlaceAutoComplete, PlaceDetails, PriceQuote } from '@lib/interfaces'

interface Attributes {
    orders: Order[],
    activity: { [k: string]: boolean },
    pickupStores: PickupStore[],
    orderPriceQuote: PriceQuote[],
    orderInfo?: Order
}

interface State extends Attributes {
    getOrders: (token: string, forDate: string) => void,
    getPickupList: (token: string) => void,
    googlePlacesApi: (searchText: string, callback: (data: PlaceAutoComplete[]) => void) => void
    googlePlaceDetailsApi: (placeId: string, callback: (data: PlaceDetails) => void) => void
    createOrder: (token: string, billNumber: string, storeId: string, drop: LocationAddress, amount: string, category: string, lspId: string | undefined, callback: (success: boolean) => void) => void
    cancelOrder: (token: string, orderId: string, cancellationReason: string, callback: (success: boolean) => void) => void
    getPriceQuote: (token: string, storeId: string, drop: LocationAddress, orderAmount: number, category: string, callback: () => void) => void
    addOutlet: (token: string, storeId: string, drop: LocationAddress, placesId: string, callback: (success: boolean) => void) => void
    saveInStorage: (keyName: string, value: string) => void
    getOrderDetails: (token: string, orderId: string, callback: (success: boolean, message?: string) => void) => void
}

const initialState: Attributes = { orders: [], activity: {}, pickupStores: [], orderPriceQuote: [] };

export const useOrdersStore = create<State>()((set, get) => ({
    ...initialState,
    getOrders: async (token, forDate) => {
        set(produce((state: State) => {
            state.activity.getOrders = true
        }))
        Api('/webui/orders', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {date: forDate} })
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
                callback(res.suggestions)
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.googlePlacesApi = false
                }))
            })
    },
    googlePlaceDetailsApi: async (placeId, callback) => {
        PlaceDetailsApi(placeId)
            .then(res => {
                callback(res)
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.googlePlacesApi = false
                }))
            })
    },
    createOrder: async (token, billNumber, storeId, drop, amount, category, lspId, callback) => {
        set(produce((state: State) => {
            state.activity.createOrder = true
        }))

        let data: { [k: string]: string | number | string[] | LocationAddress | { [j: string]: string }, select_criteria: { mode: string, lsp_id?: string } } = {
            client_order_id: billNumber,
            pickup: {
                code: "1234",
                store_id: storeId
            },
            drop: drop,
            order_category: category,
            search_category: "Immediate Delivery",
            ready_to_ship: "yes",
            order_amount: amount,
            order_items: [],
            select_criteria: {
                mode: "auto_select"
            }
        }

        if (lspId) {
            data.select_criteria.mode = 'preferred_lsp'
            data.select_criteria.lsp_id = lspId
        }

        Api('/webui/order/createasync', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data
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
    getPriceQuote: async (token, storeId, drop, orderAmount, category, callback) => {
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
                    order_category: category,
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
    saveInStorage: async(keyName, value) => {
        localStorage.setItem(keyName, value);
    },
    getOrderDetails: async (token, orderId, callback) => {
        set(produce((state: State) => {
            state.activity.getOrderDetails = true
        }))
        Api('/webui/order/info', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {
                order: {
                    id: orderId
                }
            }
        })
            .then(res => {
                set(produce((state: State) => {
                    if(res.status === 1) {
                        state.orderInfo = res.order
                        callback(true)
                    } else {
                        callback(false, res.message)
                    }
                    state.activity.getOrderDetails = false
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getOrderDetails = false
                }))
            })
    },
}))
