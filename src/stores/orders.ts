import { create } from 'zustand'
import { produce } from 'immer'
import { Api, GooglePlacesApi, PlaceDetailsApi } from '@lib/utils'
import { LocationAddress, Order, PickupStore, PlaceAutoComplete, PlaceDetails, PriceQuote } from '@lib/interfaces'

interface Attributes {
    orders: Order[]
    activity: { [k: string]: boolean }
    pickupStores: PickupStore[]
    orderPriceQuote: PriceQuote[]
}

interface State extends Attributes {
    getOrders: (token: string, forDate: string) => void,
    getPickupList: (token: string, callback: () => void) => void,
    googlePlacesApi: (searchText: string, callback: (data: PlaceAutoComplete[]) => void, latitude?: number, longitude?: number) => void
    googlePlaceDetailsApi: (placeId: string, callback: (data: PlaceDetails) => void) => void
    createOrder: (token: string, billNumber: string, storeId: string, drop: LocationAddress, amount: string, category: string, lspId: string | undefined, quoteId: string | undefined, callback: (success: boolean) => void) => void
    cancelOrder: (token: string, orderId: string, cancellationReason: string, callback: (success: boolean) => void) => void
    getPriceQuote: (token: string, storeId: string, drop: LocationAddress, orderAmount: number, category: string, callback: (success: boolean, quoteId: string) => void) => void
    addOutlet: (action: 'create'|'update', token: string, storeId: string, drop: LocationAddress, placesId: string, callback: (success: boolean) => void) => void
    saveInStorage: (keyName: string, value: string) => void
    getCustomerInfo: (token: string, phone: string, callback: (customerInfo: LocationAddress) => void) => void
    raiseIssue: (token: string, orderId: string, issue: string, description: string, callback: (sucess: boolean) => void) => void
}

const initialState: Attributes = { orders: [], activity: {}, pickupStores: [], orderPriceQuote: [] };

export const useOrdersStore = create<State>()((set, get) => ({
    ...initialState,
    getOrders: async (token, forDate) => {
        set(produce((state: State) => {
            state.activity.getOrders = true
        }))
        Api('/webui/orders_detailed', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { date: forDate } })
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
    getPickupList: async (token: string, callback) => {
        set(produce((state: State) => {
            state.activity.getPickupList = true
        }))
        Api('/webui/pickup/list', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {} })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.getPickupList = false
                    state.pickupStores = res
                }))
                callback()
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getPickupList = false
                }))
            })
    },
    googlePlacesApi: async (searchText, callback, latitude, longitude) => {
        GooglePlacesApi(searchText, latitude, longitude)
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
    createOrder: async (token, billNumber, storeId, drop, amount, category, lspId, quoteId, callback) => {
        set(produce((state: State) => {
            state.activity.createOrder = true
        }))

        let data: { [k: string]: string | number | string[] | LocationAddress | { [j: string]: string }, select_criteria: { mode: string, lsp_id?: string, quote_id?: string } } = {
            client_order_id: billNumber,
            pickup: {
                code: billNumber.slice(-4),
                store_id: storeId
            },
            drop,
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
            data.select_criteria.mode = 'selected_lsp'
            data.select_criteria.lsp_id = lspId
            data.select_criteria.quote_id = quoteId
        }

        Api(`/webui/order/${lspId ? 'create' : 'createasync'}`, {
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
                    if(res.status === 1) {
                        set(produce((state: State) => {
                            state.activity.getPriceQuote = false
                            state.orderPriceQuote = res.quotes
                        }))
                        callback(true, res.quote_id)
                    } else {
                        set(produce((state: State) => {
                            state.activity.getPriceQuote = false
                        }))
                        callback(false, '')
                    }
                })
                .catch(() => {
                    set(produce((state: State) => {
                        state.activity.getPriceQuote = false
                    }))
                })
        }
    },
    addOutlet: async (action,token, storeId, drop, placesId, callback) => {
        set(produce((state: State) => {
            state.activity.addOutlet = true
        }))
        Api(`/webui/pickup/${action}`, {
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
    saveInStorage: async (keyName, value) => {
        localStorage.setItem(keyName, value);
    },
    getCustomerInfo: async (token, phone, callback) => {
        set(produce((state: State) => {
            state.activity.getCustomerInfo = true
        }))
        Api('/webui/customer/info', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {
                phone_number: phone
            }
        })
            .then(res => {
                set(produce((state: State) => {
                    if (res.status === 1) {
                        callback(res.customer)
                    }
                    state.activity.getCustomerInfo = false
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getCustomerInfo = false
                }))
            })
    },
    raiseIssue: async (token, orderId, issue, description,  callback) => {
        set(produce((state: State) => {
            state.activity.raiseIssue = true
        }))
        Api('/webui/order/issue', {
            method: 'post', headers: { token }, data: {
                order: {
                    id: orderId
                },
                description: {
                    line1: issue,
                    line2: description
                }
            }
        }).then(res => {
            set(produce((state: State) => {
                state.activity.raiseIssue = false
            }))
            if (res.status === 1) {
                callback(true)
            } else {
                callback(false)
            }
        }).catch(() => {
            set(produce((state: State) => {
                state.activity.raiseIssue = false
            }))
            callback(false)
        })
    }
}))
