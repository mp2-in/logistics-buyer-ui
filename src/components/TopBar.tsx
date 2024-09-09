import { createRef, useEffect, useReducer } from "react"

import mp2Icon from "@assets/mp2_logo.png"
import menuIcon from "@assets/menu.png"
import userIcon from "@assets/user.png"
import addAccount from "@assets/add_account.png"
import accountIcon from "@assets/account.png"
import walletIcon from "@assets/wallet.png"
import billingIcon from "@assets/billing.png"
import warningIcon from "@assets/warning_black.png"
import searchIcon from "@assets/search_order.png"
import orderIcon from "@assets/orders.png"
import logout from "@assets/logout.png"
import AccountDetails from "./AccountDetails"
import { useNavigate } from "react-router-dom"
import LogoutConfirmation from "./LogoutConfirmation"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"
import OrderSearch from "./OrderSearch"


const AccountMenuItem = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) => {
    return <div className="flex items-center justify-evenly py-1 border-b border-gray-200 hover:bg-blue-200 last:border-none" onClick={onClick}>
        {icon}
        <p className="hover:bg-blue-200 cursor-pointer font-medium w-20">{title}</p>
    </div>
}


const MainMenuItem = ({ title, icon, onClick, selected }: { title: string, icon: React.ReactNode, onClick: () => void, selected?: boolean }) => {
    return <div className={`flex flex-col lg:flex-row items-center w-full lg:pl-6 rounded-md py-1 px-2 lg:px-0 lg:w-[230px] ${selected ? 'bg-slate-200' : 'hover:bg-slate-100 cursor-pointer'}`} onClick={onClick}>
        {icon}
        <p className="lg:text-lg font-medium lg:ml-8 text-xs text-center">{title}</p>
    </div>
}

interface State {
    showMenu: boolean
    showAccountInfo: boolean
    showLogoutConfirmation: boolean
    showAddAccount: boolean
    showMainMenu: boolean
    showOrderSearch: boolean
}

const initialValue: State = { showMenu: false, showAccountInfo: false, showLogoutConfirmation: false, showAddAccount: false, showMainMenu: false, showOrderSearch: false}

const reducer = (state: State, action: { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
    }
}

export default ({ title, onAccountSwitch }: { title: string, onAccountSwitch?: (token: string) => void}) => {
    const { token, selectedAccount, clearAuth, accountIds, phone, switchAccount, createAccount, setToast, email, validateGst, activity, page } = useAppConfigStore(state => ({
        selectedAccount: state.selectedAccount,
        clearAuth: state.clearAuth,
        setToast: state.setToast,
        accountIds: state.accountIds,
        phone: state.phone,
        email: state.email,
        switchAccount: state.switchAccount,
        token: state.token,
        createAccount: state.createAccount,
        validateGst: state.validateGst,
        activity: state.activity,
        page: state.page
    }))


    let divRef = createRef<HTMLInputElement>();

    const [state, dispatch] = useReducer(reducer, initialValue)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            divRef.current &&
            !divRef.current.contains(event.target as Node)
        ) {
            dispatch({ type: 'update', payload: { showMenu: false } })
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    const navigate = useNavigate()

    return <div>
        <div className={'flex justify-between items-center border-b border-gray-300 md:py-3 md:px-3 py-1 px-1'}>
            <div className={'flex items-center'}>
                <img src={menuIcon} className="w-9 lg:w-10 mx-2 cursor-pointer" onClick={() => dispatch({ type: 'update', payload: { showMainMenu: true } })} />
                <p className="font-medium text-2xl hidden md:block">{title}</p>
            </div>
            <div className={'flex items-center cursor-pointer relative'} ref={divRef} onClick={() => dispatch({ type: 'update', payload: { showMenu: !state.showMenu } })}>
                <p className="font-medium text-xs block md:hidden">{selectedAccount}</p>
                <img src={userIcon} className="w-10 mx-1" />
                <p className="font-medium text-lg hidden md:block">{selectedAccount}</p>
                {state.showMenu ? <div className="absolute top-5 bg-gray-100 cursor-pointer z-20 w-44 right-10 md:top-12 md:right-0 md:bg-gray-100">
                    {/mp2\.in$/.test(email || '') ? <AccountMenuItem icon={<img src={addAccount} className="w-7" />} title="Account" onClick={() => {
                        dispatch({ type: 'update', payload: { showMenu: false, showAddAccount: true } })
                    }} /> : null}
                    <AccountMenuItem icon={<img src={accountIcon} className="w-7" />} title="Profile" onClick={() => {
                        dispatch({ type: 'update', payload: { showMenu: false, showAccountInfo: true } })
                    }} />
                    <AccountMenuItem icon={<img src={logout} className="w-7" />} title="Logout" onClick={() => {
                        dispatch({ type: 'update', payload: { showMenu: false, showLogoutConfirmation: true } })
                    }} />
                </div> : null}
            </div>
        </div>
        <AccountDetails
            open={state.showAccountInfo}
            onClose={() => dispatch({ type: 'update', payload: { showAccountInfo: false } })}
            selectedAccount={selectedAccount || ''}
            onLogout={() => dispatch({ type: 'update', payload: { showLogoutConfirmation: true } })}
            accountIds={accountIds}
            phoneNumber={phone}
            switchAccount={(accountId) => switchAccount(token || '', accountId, (success, newToken) => {
                if (success) {
                    onAccountSwitch && onAccountSwitch(newToken)
                    setTimeout(() => {
                        dispatch({ type: 'update', payload: { showAccountInfo: false } })
                    }, 200)
                }
            })}
            email={email}
        />
        <LogoutConfirmation open={state.showLogoutConfirmation} onClose={() => dispatch({ type: 'update', payload: { showLogoutConfirmation: false } })} logout={clearAuth} loading={false} />
        <OrderSearch open={state.showOrderSearch} onClose={() => dispatch({ type: 'update', payload: { showOrderSearch: false } })}/>
        <AddAccount open={state.showAddAccount} onClose={() => dispatch({ type: 'update', payload: { showAddAccount: false } })} createAccount={(accountName, gstin, autoSelectMode, contacts, plan, rtoRequired) => {
            validateGst(token || '', gstin, (isValid) => {
                if (isValid) {
                    createAccount(token || '', accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, (success, message) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { showAddAccount: false } })
                            setToast(message, 'success')
                        } else {
                            setToast(message || 'Error creating account', 'error')
                        }
                    })
                } else {
                    setToast('Invalid GSTIN', 'error')
                }
            })
        }} loading={activity.createAccount || activity.validateGst} />
        <div className={`absolute left-0 top-0 bottom-0 z-10  ${state.showMainMenu ? 'w-full' : 'w-0'}`} onClick={() => dispatch({ type: 'update', payload: { showMainMenu: false } })}>
            <div className={`bg-white absolute left-0 top-0 bottom-0 transition-all overflow-x-hidden ${state.showMainMenu ? 'lg:w-[250px] w-[80px] border-r' : 'w-0'} flex flex-col items-center py-10 shadow-lg`}
                onClick={e => e.stopPropagation()}>
                <img src={mp2Icon} className="w-10 cursor-pointer scale-1 min-w-10 lg:min-w-16 lg:w-16" />
                <div className={`mt-8 *:py-1 *:my-2`}>
                    <MainMenuItem title="Orders" icon={<img src={orderIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/orders')
                        dispatch({ type: 'update', payload: { showMainMenu: false } })
                    }} selected={page === 'orders'} />
                    <MainMenuItem title="Wallet" icon={<img src={walletIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/wallet')
                        dispatch({ type: 'update', payload: { showMainMenu: false } })
                    }} selected={page === 'wallet'} />
                    <MainMenuItem title="Reports" icon={<img src={billingIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/reports')
                        dispatch({ type: 'update', payload: { showMainMenu: false } })
                    }} selected={page === 'reports'} />
                    <MainMenuItem title="Issues" icon={<img src={warningIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/issues')
                        dispatch({ type: 'update', payload: { showMainMenu: false } })
                    }} selected={page === 'issues'} />
                    <MainMenuItem title="Search Order" icon={<img src={searchIcon} className="w-9 lg:w-8" />} onClick={() => {
                        dispatch({ type: 'update', payload: { showMainMenu: false, showOrderSearch: true} })
                    }} />
                </div>
            </div>
        </div>
    </div>
}