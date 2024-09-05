import { createRef, useEffect, useState } from "react"

import mp2Icon from "@assets/mp2_logo.png"
import menuIcon from "@assets/menu.png"
import userIcon from "@assets/user.png"
import addAccount from "@assets/add_account.png"
import accountIcon from "@assets/account.png"
import walletIcon from "@assets/wallet.png"
import billingIcon from "@assets/billing.png"
import warningIcon from "@assets/warning_black.png"
import orderIcon from "@assets/orders.png"
import logout from "@assets/logout.png"
import AccountDetails from "./AccountDetails"
import { useNavigate } from "react-router-dom"
import LogoutConfirmation from "./LogoutConfirmation"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"


const AccountMenuItem = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) => {
    return <div className="flex items-center justify-evenly py-1 border-b border-gray-200 hover:bg-blue-200 last:border-none" onClick={onClick}>
        {icon}
        <p className="hover:bg-blue-200 cursor-pointer font-medium w-20">{title}</p>
    </div>
}


const MainMenuItem = ({ title, icon, onClick, selected }: { title: string, icon: React.ReactNode, onClick: () => void, selected?: boolean }) => {
    return <div className={`flex flex-col lg:flex-row items-center w-full lg:pl-6 rounded-md py-1 px-2 lg:px-0 lg:w-[200px] ${selected ? 'bg-slate-200' : 'hover:bg-slate-100 cursor-pointer'}`} onClick={onClick}>
        {icon}
        <p className="lg:text-lg font-medium lg:ml-8 text-xs">{title}</p>
    </div>
}

export default ({ title, onAccountSwitch }: { title: string, onAccountSwitch?: (token: string) => void }) => {
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

    const [showMenu, setMenuDisplay] = useState(false)
    const [showAccountInfo, setAccountInfoDisplay] = useState(false)
    const [showLogoutConfirmation, setLogoutConfirmationDisplay] = useState(false)
    const [showAddAccount, setAddAccountDisplay] = useState(false)
    const [showMainMenu, setMainMenuDisplay] = useState(false)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            divRef.current &&
            !divRef.current.contains(event.target as Node)
        ) {
            setMenuDisplay(false);
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
                <img src={menuIcon} className="w-9 lg:w-10 mx-2 cursor-pointer" onClick={() => setMainMenuDisplay(true)} />
                <p className="font-medium text-2xl hidden md:block">{title}</p>
            </div>
            <div className={'flex items-center cursor-pointer relative'} ref={divRef} onClick={() => setMenuDisplay(!showMenu)}>
                <p className="font-medium text-xs block md:hidden">{selectedAccount}</p>
                <img src={userIcon} className="w-10 mx-1" />
                <p className="font-medium text-lg hidden md:block">{selectedAccount}</p>
                {showMenu ? <div className="absolute top-5 bg-gray-100 cursor-pointer z-20 w-44 right-10 md:top-12 md:right-0 md:bg-gray-100">
                    {/mp2\.in$/.test(email || '') ? <AccountMenuItem icon={<img src={addAccount} className="w-7" />} title="Account" onClick={() => {
                        setAddAccountDisplay(true)
                        setMenuDisplay(false)
                    }} /> : null}
                    <AccountMenuItem icon={<img src={accountIcon} className="w-7" />} title="Profile" onClick={() => {
                        setAccountInfoDisplay(true)
                        setMenuDisplay(false)
                    }} />
                    <AccountMenuItem icon={<img src={logout} className="w-7" />} title="Logout" onClick={() => {
                        setLogoutConfirmationDisplay(true)
                        setMenuDisplay(false)
                    }} />
                </div> : null}
            </div>
        </div>
        <AccountDetails
            open={showAccountInfo}
            onClose={() => setAccountInfoDisplay(false)}
            selectedAccount={selectedAccount || ''}
            onLogout={() => setLogoutConfirmationDisplay(true)}
            accountIds={accountIds}
            phoneNumber={phone}
            switchAccount={(accountId) => switchAccount(token || '', accountId, (success, newToken) => {
                if (success) {
                    onAccountSwitch && onAccountSwitch(newToken)
                    setTimeout(() => {
                        setAccountInfoDisplay(false)
                    }, 200)
                }
            })}
            email={email}
        />
        <LogoutConfirmation open={showLogoutConfirmation} onClose={() => setLogoutConfirmationDisplay(false)} logout={clearAuth} loading={false} />
        <AddAccount open={showAddAccount} onClose={() => setAddAccountDisplay(false)} createAccount={(accountName, gstin, autoSelectMode, contacts, plan, rtoRequired) => {
            validateGst(token || '', gstin, (isValid) => {
                if (isValid) {
                    createAccount(token || '', accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, (success, message) => {
                        if (success) {
                            setAddAccountDisplay(false)
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
        <div className={`absolute left-0 top-0 bottom-0 z-10  ${showMainMenu ? 'w-full' : 'w-0'}`} onClick={() => setMainMenuDisplay(false)}>
            <div className={`bg-white absolute left-0 top-0 bottom-0 transition-all overflow-x-hidden ${showMainMenu ? 'lg:w-[250px] w-[80px] border-r' : 'w-0'} flex flex-col items-center py-10 shadow-lg`} onClick={e => e.stopPropagation()}>
                <img src={mp2Icon} className="w-10 cursor-pointer scale-1 min-w-10 lg:min-w-16 lg:w-16" />
                <div className={`mt-8 *:py-1 *:my-2`}>
                    <MainMenuItem title="Orders" icon={<img src={orderIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/orders')
                        setMenuDisplay(false)
                    }} selected={page === 'orders'} />
                    <MainMenuItem title="Wallet" icon={<img src={walletIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/wallet')
                        setMenuDisplay(false)
                    }} selected={page === 'wallet'}/>
                    <MainMenuItem title="Reports" icon={<img src={billingIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/reports')
                        setMenuDisplay(false)
                    }} selected={page === 'reports'}/>
                    <MainMenuItem title="Issues" icon={<img src={warningIcon} className="w-9 lg:w-8" />} onClick={() => {
                        navigate('/issues')
                        setMenuDisplay(false)
                    }} selected={page === 'issues'}/>
                </div>
            </div>
        </div>
    </div>
}