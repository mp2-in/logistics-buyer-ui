import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    walletBalance: number | undefined
    walletStatus: number | undefined
    activity: { [k: string]: boolean }
}

interface State extends Attributes {
    getWalletDashboardLink: (token: string, callback: (link: string) => void) => void
    getBillingInfoLink: (token: string, callback: (link: string) => void) => void
    getWalletBalance: (token: string) => void
}

const initialState: Attributes = { activity: {}, walletBalance: undefined, walletStatus: undefined };

export const useWalletState = create<State>()((set) => ({
    ...initialState,
    getWalletDashboardLink: async (token, callback) => {
        set(produce((state: State) => {
            state.activity.getWalletDashboardLink = true
        }))
        Api('/webui/wallet_info', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {}
        })
            .then(res => {
                set(produce((state: State) => {
                    if (res.status === 1) {
                        callback(res.embed_link)
                    }
                    state.activity.getWalletDashboardLink = false
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getWalletDashboardLink = false
                }))
            })
    },
    getBillingInfoLink: async (token, callback) => {
        set(produce((state: State) => {
            state.activity.getBillingInfoLink = true
        }))
        Api('/webui/billing_info', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {}
        })
            .then(res => {
                set(produce((state: State) => {
                    if (res.status === 1) {
                        callback(res.embed_link)
                    }
                    state.activity.getBillingInfoLink = false
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getBillingInfoLink = false
                }))
            })
    },
    getWalletBalance: async (token) => {
        Api('/webui/wallet_balance', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {}
        })
            .then(res => {
                set(produce((state: State) => {
                    if (res.status === 1) {
                        state.walletBalance = res.wallet_balance
                        state.walletStatus = res.wallet_status
                    }
                }))
            })
            .catch(() => { })
    }
}))
