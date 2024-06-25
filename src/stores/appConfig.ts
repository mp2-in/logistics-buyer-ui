import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    token?: string,
    accountId?: string,
    loggedIn: boolean,
    activity: {[k: string]: boolean}
}

interface State extends Attributes {
    login: (username: string, password: string, successCallback: () => void, errCallback: () => void) => void,
    checkLoginStatus: (callback: () => void) => void
}

const initialState: Attributes = { loggedIn: false, activity: {} };

export const useAppConfigStore = create<State>()((set) => ({
    ...initialState,
    login: async (username, password, successCallback, errCallback) => {
        set(produce((state: State) => {
            state.activity.login = true
        }))
        Api('/webui/login', { method: 'post', headers: { 'x-mp2-api-key': 'MP2Kktmeeezr309axf9eagfrrds61tqauv1am5qqh6dzyhuzqv4ggb8x7jts4bim', 'Content-Type': 'application/json' }, data: { username, password } })
            .then(res => {
                set(produce((state: State) => {
                    state.token = res.access_token
                    state.accountId = res.account_id
                    state.loggedIn = true
                    state.activity.login = false
                }))
                localStorage.setItem("token", res.access_token);
                localStorage.setItem("accountId",res.account_id);
                successCallback()
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.loggedIn = false
                    state.activity.login = false
                }))
                errCallback()
            })
    },
    checkLoginStatus: async (callback) => {
        const token = localStorage.getItem("token");
        const accountId = localStorage.getItem("accountId");

        if(token && accountId) {
            set(produce((state: State) => {
                state.token = token
                state.accountId = accountId
                state.loggedIn = true
            }))
        }
        callback()
    }
}))
