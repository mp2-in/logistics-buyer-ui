import { create } from 'zustand'
import { produce } from 'immer'
import { Api, GooglePlacesApi } from 'utils'

export interface Order {
    [k: string]: any,
    id: string,
    client_order_id: string,
    state: string,
    lsp: {
        id: string,
        name: string,
        item_id: string,
        network_order_id: string
    },
    price: number,
    distance: number,
    rider: {
        name: string,
        phone: string
    }
    created_at: string,
    assigned_at: string,
    pickedup_at: string,
    delivered_at: string,
    cancelled_at: string
}

interface Attributes {
    orders: Order[],
    activity: { [k: string]: boolean }
}

export interface Place {
    id: string,
    formattedAddress: string,
    location: {
        latitude: number,
        longitude: number
    },
    displayName: {
        text: string,
    }
}

interface State extends Attributes {
    getOrders: (token: string) => void,
    getPickupList: (token: string) => void,
    googlePlacesApi: (searchText: string, callback: (data: Place[]) => void) => void
}

const initialState: Attributes = { orders: [], activity: {} };

export const useOrdersStore = create<State>()((set) => ({
    ...initialState,
    getOrders: async (token: string) => {
        set(produce((state: State) => {
            state.activity.getOrders = false
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
            state.activity.getPickupList = false
        }))
        Api('/webui/pickup/list', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {} })
            .then(() => {
                set(produce((state: State) => {
                    state.activity.getPickupList = false
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
    }
}))
