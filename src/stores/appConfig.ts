import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    token?: string,
    accountId?: string,
    loggedIn: boolean,
    toastMessage: string,
    toastType?: 'success' | 'warning' | 'error',
    toastVisibility: boolean,
    activity: {[k: string]: boolean}
}

interface State extends Attributes {
    checkLoginStatus: (callback: () => void) => void
    clearAuth: () => void
    setToast: (message: string, type: 'success' | 'warning' | 'error') => void,
    hideToast: () => void,
    sendOtp: (phoneNumber: string, callback: (success: boolean) => void) => void,
    verifyOtp: (phoneNumber: string, otp: string, callback: (success: boolean) => void) => void
}

const initialState: Attributes = { loggedIn: false, activity: {}, toastMessage: '', toastVisibility: false };

export const useAppConfigStore = create<State>()((set) => ({
    ...initialState,
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
    },
    clearAuth: async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('accountId')

        set(produce((state: State) => {
            state.token = undefined
            state.accountId = undefined
            state.loggedIn = false
        }))
    },
    setToast: (message, type) => {
        set(produce((state: State) => {
            state.toastMessage = message
            state.toastType = type
            state.toastVisibility = true
        }))
    },
    hideToast: () => {
        set(produce((state: State) => {
            state.toastVisibility = false
        }))
    },
    sendOtp: async (phoneNumber, callback) => {
        set(produce((state: State) => {
            state.activity.sendOtp = true
        }))
        Api('/webui/sendOTP', { method: 'post',headers: {'Content-Type': 'application/json' }, data: { phone_number: phoneNumber } })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.sendOtp = false
                }))

                if(res.status === 1) {
                    callback(true)
                } else {
                    callback(false)
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.sendOtp = false
                }))
                callback(false)
            })
    },
    verifyOtp: async (phoneNumber, otp, callback) => {
        set(produce((state: State) => {
            state.activity.verifyOtp = true
        }))
        Api('/webui/verifyOTP', { method: 'post', headers: {'Content-Type': 'application/json' }, data: {phone_number: phoneNumber, OTP: otp} })
            .then(res => {
                if(res.status === 1) {
                    set(produce((state: State) => {
                        state.token = res.access_token
                        state.accountId = res.selected_account_id
                        state.loggedIn = true
                        state.activity.verifyOtp = false
                    }))
                    localStorage.setItem("token", res.access_token);
                    localStorage.setItem("accountId",res.selected_account_id);
                    callback(true)
                } else {
                    callback(false)
                    set(produce((state: State) => {
                        state.loggedIn = false
                        state.activity.verifyOtp = false
                    }))
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.loggedIn = false
                    state.activity.verifyOtp = false
                }))
                callback(false)
            })
    },
}))
