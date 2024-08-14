import { createRef, useEffect, useState } from "react"

import mp2Icon from "@assets/mp2_logo.png"
import userIcon from "@assets/user.png"
import addAccount from "@assets/add_account.png"
import accountIcon from "@assets/account.png"
import walletIcon from "@assets/wallet.png"
import orderIcon from "@assets/orders.png"
import logout from "@assets/logout.png"
import AccountDetails from "./AccountDetails"
import { useNavigate } from "react-router-dom"
import LogoutConfirmation from "./LogoutConfirmation"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"


const MenuItem = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) => {
    return <div className="flex items-center justify-evenly py-1 border-b border-gray-200 hover:bg-blue-200 last:border-none" onClick={onClick}>
        {icon}
        <p className="hover:bg-blue-200 cursor-pointer font-medium w-20">{title}</p>
    </div>
}


export default ({ title, onAccountSwitch }: { title: string, onAccountSwitch?: (token: string) => void }) => {
    const { token, selectedAccount, clearAuth, accountIds, phone, switchAccount, createAccount, setToast, email } = useAppConfigStore(state => ({
        selectedAccount: state.selectedAccount,
        clearAuth: state.clearAuth,
        setToast: state.setToast,
        accountIds: state.accountIds,
        phone: state.phone,
        email: state.email,
        switchAccount: state.switchAccount,
        token: state.token,
        createAccount: state.createAccount
    }))

    let divRef = createRef<HTMLInputElement>();

    const [showMenu, setMenuDisplay] = useState(false)
    const [showAccountInfo, setAccountInfoDisplay] = useState(false)
    const [showLogoutConfirmation, setLogoutConfirmationDisplay] = useState(false)
    const [showAddAccount, setAddAccountDisplay] = useState(false)

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
                <img src={mp2Icon} className="w-9 md:w-12 mx-2 cursor-pointer" />
                <p className="font-medium text-2xl hidden md:block">{title}</p>
            </div>
            <div className={'flex items-center cursor-pointer relative'} ref={divRef} onClick={() => setMenuDisplay(!showMenu)}>
                <img src={userIcon} className="w-10 mr-1" />
                <p className="font-medium text-lg hidden md:block">{selectedAccount}</p>
                {showMenu ? <div className="absolute top-5 bg-gray-100 cursor-pointer z-20 w-44 right-10 md:top-12 md:right-0 md:bg-gray-100">
                    {/mp2\.in$/.test(email || '') ? <MenuItem icon={<img src={addAccount} className="w-7" />} title="Account" onClick={() => {
                        setAddAccountDisplay(true)
                        setMenuDisplay(false)
                    }} /> : null}
                    <MenuItem icon={<img src={orderIcon} className="w-7" />} title="Orders" onClick={() => {
                        navigate('/u/orders')
                        setMenuDisplay(false)
                    }} />
                    <MenuItem icon={<img src={walletIcon} className="w-7" />} title="Wallet" onClick={() => {
                        navigate('/u/wallet')
                        setMenuDisplay(false)
                    }} />
                    <MenuItem icon={<img src={accountIcon} className="w-7" />} title="Profile" onClick={() => {
                        setAccountInfoDisplay(true)
                        setMenuDisplay(false)
                    }} />
                    <MenuItem icon={<img src={logout} className="w-7" />} title="Logout" onClick={() => {
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
                if(success) {
                    onAccountSwitch && onAccountSwitch(newToken)
                    setTimeout(() => {
                        setAccountInfoDisplay(false)
                    }, 200)
                }
            })}
        />
        <LogoutConfirmation open={showLogoutConfirmation} onClose={() => setLogoutConfirmationDisplay(false)} logout={clearAuth} loading={false} />
        <AddAccount open={showAddAccount} onClose={() => setAddAccountDisplay(false)} createAccount={(accountName, gstId, autoSelectMode, contacts, plan, rtoRequired) => {
            createAccount(token || '', accountName, gstId, autoSelectMode, contacts, plan, rtoRequired, (success, message) => {
                if (success) {
                    setAddAccountDisplay(false)
                    setToast(message, 'success')
                } else {
                    setToast(message || 'Error creating account', 'error')
                }
            })
        }} />
    </div>
}