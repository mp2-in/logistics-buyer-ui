import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    activity: { [k: string]: boolean }
}

interface State extends Attributes {
    getWalletDashboardLink: (token: string, callback: (link: string) => void) => void
}

const initialState: Attributes = { activity: {} };

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
    }
}))
