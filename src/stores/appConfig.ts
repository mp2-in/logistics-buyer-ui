import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    token?: string
    selectedAccount?: string
    role?: string
    isRetail?: boolean
    phone?: string
    accountIds: string[]
    loggedIn: boolean
    toastMessage: string
    toastType?: 'success' | 'warning' | 'error'
    toastVisibility: boolean
    activity: { [k: string]: boolean }
}

interface State extends Attributes {
    checkLoginStatus: (callback: () => void) => void
    clearAuth: () => void
    setToast: (message: string, type: 'success' | 'warning' | 'error') => void,
    hideToast: () => void,
    sendOtp: (phoneNumber: string, callback: (success: boolean) => void) => void,
    verifyOtp: (phoneNumber: string, otp: string, callback: (success: boolean) => void) => void
    switchAccount: (token: string, accountId: string, callback: (success: boolean, token: string) => void) => void
}

const initialState: Attributes = { loggedIn: false, activity: {}, toastMessage: '', toastVisibility: false, accountIds: [] };

export const useAppConfigStore = create<State>()((set) => ({
    ...initialState,
    checkLoginStatus: async (callback) => {
        const token = localStorage.getItem("token");
        const selectedAccount = localStorage.getItem("selectedAccount");
        const phone = localStorage.getItem("phone");
        const accountIds = localStorage.getItem("accountIds");
        const role = localStorage.getItem("role");
        const isRetail = localStorage.getItem("isRetail");

        if (token && selectedAccount && phone && accountIds && role) {
            set(produce((state: State) => {
                state.token = token
                state.selectedAccount = selectedAccount
                state.phone = phone
                state.loggedIn = true
                state.role = role
                state.isRetail = (isRetail === 'true')
                state.accountIds = JSON.parse(accountIds)
            }))
        }
        callback()
    },
    clearAuth: async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('selectedAccount')
        localStorage.removeItem('phone')
        localStorage.removeItem('accountIds')

        set(produce((state: State) => {
            state.token = undefined
            state.selectedAccount = undefined
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
        Api('/webui/sendOTP', { method: 'post', headers: { 'Content-Type': 'application/json' }, data: { phone_number: phoneNumber } })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.sendOtp = false
                }))

                if (res.status === 1) {
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
        Api('/webui/verifyOTP', { method: 'post', headers: { 'Content-Type': 'application/json' }, data: { phone_number: phoneNumber, OTP: otp } })
            .then(res => {
                if (res.status === 1) {
                    set(produce((state: State) => {
                        state.token = res.access_token
                        state.selectedAccount = res.selected_account.id
                        state.role = res.selected_account.role
                        state.isRetail = res.selected_account.is_retail
                        state.phone = phoneNumber
                        state.accountIds = res.account_ids
                        state.loggedIn = true
                        state.activity.verifyOtp = false
                    }))
                    localStorage.setItem("token", res.access_token);
                    localStorage.setItem("accountIds", JSON.stringify(res.account_ids));
                    localStorage.setItem("selectedAccount", res.selected_account.id);
                    localStorage.setItem("phone", phoneNumber);
                    localStorage.setItem("role", res.selected_account.role);
                    localStorage.setItem("isRetail", res.selected_account.is_retail);

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
    switchAccount: async (token, accountId, callback) => {
        set(produce((state: State) => {
            state.activity.switchAccount = true
        }))

        Api('/webui/switchaccount', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { switch_account_id: accountId } })
            .then(res => {
                if (res.status === 1) {
                    localStorage.setItem("selectedAccount", res.selected_account.id);
                    localStorage.setItem("token", res.access_token);
                    localStorage.setItem("role", res.selected_account.role);
                    localStorage.setItem("isRetail", res.selected_account.is_retail);
                    set(produce((state: State) => {
                        state.selectedAccount = res.selected_account.id
                        state.token = res.access_token
                        state.role = res.selected_account.role
                        state.isRetail = res.selected_account.is_retail
                        state.activity.switchAccount = false
                    }))
                    callback(true, res.access_token)
                } else {
                    callback(false, '')
                    set(produce((state: State) => {
                        state.activity.switchAccount = false
                    }))
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.switchAccount = false
                }))
                callback(false, '')
            })
    },
}))
