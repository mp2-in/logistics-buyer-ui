import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from 'utils'

interface Order {
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
    activity: {[k: string]: boolean}
}

interface State extends Attributes {
    getOrders: (token: string) => void,
}

const initialState: Attributes = { orders: [], activity: {}};

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
    }
}))