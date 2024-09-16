import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'

interface Attributes {
    token?: string
    selectedAccount?: string
    role?: string
    isRetail?: boolean
    phone?: string
    email?: string
    apiKey?: string
    accountIds: string[]
    loggedIn: boolean
    toastMessage: string
    toastType?: 'success' | 'warning' | 'error'
    toastVisibility: boolean
    activity: { [k: string]: boolean }
    page?: string
}

interface State extends Attributes {
    checkLoginStatus: (callback: () => void) => void
    setPage: (page: 'orders' | 'issues' | 'wallet' | 'reports') => void
    clearAuth: () => void
    setToast: (message: string, type: 'success' | 'warning' | 'error') => void,
    hideToast: () => void,
    sendOtp: (phoneNumber: string, callback: (success: boolean, message: string) => void) => void,
    verifyOtp: (phoneNumber: string, otp: string, callback: (success: boolean, message: string) => void) => void
    switchAccount: (token: string, accountId: string, callback: (success: boolean, token: string) => void) => void
    verifyGmail: (emailId: string, tokenId: string, callback: (success: boolean, message: string) => void) => void
    createAccount: (token: string, accountName: string, gstin: string, autoSelectMode: string, contacts: string, plan: string, rtoRequired: boolean, callback: (sucess: boolean, message: string) => void) => void
    addUser: (token: string, phoneNumber: string, username: string, email: string | undefined, accountId: string, callback: (success: boolean, message: string) => void) => void
    validateGst: (token: string, gstIn: string, callback: (valid: boolean) => void) => void
}

const initialState: Attributes = { loggedIn: false, activity: {}, toastMessage: '', toastVisibility: false, accountIds: [] };

export const useAppConfigStore = create<State>()((set) => ({
    ...initialState,
    checkLoginStatus: async (callback) => {
        const token = localStorage.getItem("token");
        const selectedAccount = localStorage.getItem("selectedAccount");
        const phone = localStorage.getItem("phone");
        const email = localStorage.getItem("email");
        const accountIds = localStorage.getItem("accountIds");
        const role = localStorage.getItem("role");
        const isRetail = localStorage.getItem("isRetail");
        const apiKey = localStorage.getItem("apiKey");

        if (token && selectedAccount && accountIds && role && (email || phone) && ((/admin/.test(role) && apiKey) || !/admin/.test(role))) {
            set(produce((state: State) => {
                state.token = token
                state.selectedAccount = selectedAccount
                state.phone = phone || undefined
                state.email = email || undefined
                state.loggedIn = true
                state.role = role
                state.apiKey = apiKey || undefined
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
        localStorage.removeItem('email')
        localStorage.removeItem('accountIds')
        localStorage.removeItem('role')
        localStorage.removeItem('isRetail')
        localStorage.removeItem('apiKey')

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
    setPage: (page) => {
        set(produce((state: State) => {
            state.page = page
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
                    callback(true, '')
                } else {
                    callback(false, res.message || "Phone number is not registered")
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.sendOtp = false
                }))
                callback(false, "Phone number is not registered")
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
                        state.apiKey = res.api_key
                        state.selectedAccount = res.selected_account.id
                        state.role = res.selected_account.role
                        state.isRetail = res.selected_account.is_retail
                        state.phone = res.phone_number
                        state.email = res.mail_id
                        state.accountIds = res.account_ids
                        state.loggedIn = true
                        state.activity.verifyOtp = false
                    }))
                    localStorage.setItem("token", res.access_token);
                    localStorage.setItem("apiKey", res.api_key);
                    localStorage.setItem("accountIds", JSON.stringify(res.account_ids));
                    localStorage.setItem("selectedAccount", res.selected_account.id);
                    localStorage.setItem("phone", res.phone_number);
                    localStorage.setItem("email", res.mail_id);
                    localStorage.setItem("role", res.selected_account.role);
                    localStorage.setItem("isRetail", res.selected_account.is_retail);

                    callback(true, '')
                } else {
                    callback(false, res.message || 'OTP is not valid !')
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
                callback(false, 'OTP is not valid !')
            })
    },
    switchAccount: async (token, accountId, callback) => {
        set(produce((state: State) => {
            state.activity.switchAccount = true
        }))

        Api('/webui/switchaccount', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { switch_account_id: accountId } })
            .then(res => {
                if (res.status === 1) {
                    localStorage.setItem("selectedAccount", res.selected_account.id)
                    localStorage.setItem("token", res.access_token)
                    localStorage.setItem("apiKey", res.api_key)
                    localStorage.setItem("role", res.selected_account.role)
                    localStorage.setItem("isRetail", res.selected_account.is_retail)
                    localStorage.setItem("accountIds", JSON.stringify(res.account_ids))
                    set(produce((state: State) => {
                        state.selectedAccount = res.selected_account.id
                        state.token = res.access_token
                        state.apiKey = res.api_key
                        state.role = res.selected_account.role
                        state.isRetail = res.selected_account.is_retail
                        state.activity.switchAccount = false
                        state.accountIds = res.account_ids
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
    verifyGmail: async (emailId, tokenId, callback) => {
        set(produce((state: State) => {
            state.activity.verifyGmail = true
        }))

        Api('/webui/verifyGmail', { method: 'post', headers: { 'Content-Type': 'application/json' }, data: { mail_id: emailId, token_id: tokenId } })
            .then(res => {
                if (res.status === 1) {
                    set(produce((state: State) => {
                        state.token = res.access_token
                        state.apiKey = res.api_key
                        state.selectedAccount = res.selected_account.id
                        state.role = res.selected_account.role
                        state.isRetail = res.selected_account.is_retail
                        state.phone = res.phone_number
                        state.email = res.mail_id
                        state.accountIds = res.account_ids
                        state.loggedIn = true
                        state.activity.verifyGmail = false
                    }))
                    localStorage.setItem("token", res.access_token);
                    localStorage.setItem("apiKey", res.api_key);
                    localStorage.setItem("accountIds", JSON.stringify(res.account_ids));
                    localStorage.setItem("selectedAccount", res.selected_account.id);
                    localStorage.setItem("phone", res.phone_number);
                    localStorage.setItem("email", res.mail_id);
                    localStorage.setItem("role", res.selected_account.role);
                    localStorage.setItem("isRetail", res.selected_account.is_retail);

                    callback(true, '')
                } else {
                    callback(false, res.message || 'Unregistered email id')
                    set(produce((state: State) => {
                        state.loggedIn = false
                        state.activity.verifyGmail = false
                    }))
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.verifyGmail = false
                }))
                callback(false, 'Unregistered email id')
            })
    },
    createAccount: async (token, accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, callback) => {
        set(produce((state: State) => {
            state.activity.createAccount = true
        }))

        Api('/webui/create_account', {
            method: 'post', headers: { 'Content-Type': 'application/json', token },
            data: { account_name: accountName, gst_number: gstin, auto_select_mode: autoSelectMode, phone_numbers: contacts.trim().split(/\s*,\s*/), plan, rto_required: rtoRequired }
        })
            .then(res => {
                if (res.status === 1) {
                    set(produce((state: State) => {
                        state.accountIds = res.account_ids
                        state.activity.createAccount = false
                    }))
                    callback(true, res.message || 'Account created succesfully')
                } else {
                    callback(false, res.message || 'Error: Account creation failed')
                    set(produce((state: State) => {
                        state.activity.createAccount = false
                    }))
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.createAccount = false
                }))
                callback(false, 'Error: Account creation failed')
            })
    },
    validateGst: async (token, gstin, callback) => {
        set(produce((state: State) => {
            state.activity.validateGst = true
        }))

        Api('/webui/validate_gst', {
            method: 'post', headers: { 'Content-Type': 'application/json', token },
            data: { gst_number: gstin }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.validateGst = false
                }))
                callback(!!res.is_valid)
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.validateGst = false
                }))
                callback(false)
            })
    },
    addUser: async (token, phoneNumber, username, email, accountId, callback) => {
        set(produce((state: State) => {
            state.activity.addUser = true
        }))

        Api('/webui/create_account_user', {
            method: 'post', headers: { 'Content-Type': 'application/json', token },
            data: { phone_number: phoneNumber, username, mail_id: email, role: 'staff', account_ids: accountId }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.addUser = false
                }))
                
                if (res.status === 1) {
                    callback(true, 'User added to account successfully')
                } else {
                    callback(false, res.message || 'Error creating account user')
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.addUser = false
                }))
                callback(false, 'Error creating account user')
            })
    },
}))
