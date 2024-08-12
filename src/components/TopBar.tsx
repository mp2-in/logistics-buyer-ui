import { createRef, useEffect, useState } from "react"

import mp2Icon from "@assets/mp2-logo.png"
import userIcon from "@assets/user.png"
import accountIcon from "@assets/account.png"
import walletIcon from "@assets/wallet.png"
import AccountDetails from "./AccountDetails"
import { useNavigate } from "react-router-dom"


export default ({ selectedAccount, clearAuth, accountIds, phoneNumber, switchAccount, title }: {
    selectedAccount: string,
    clearAuth: () => void,
    accountIds: string[]
    phoneNumber?: string
    switchAccount: (accountId: string, callback: () => void) => void
    title: string
}) => {
    let divRef = createRef<HTMLInputElement>();

    const [showMenu, setMenuDisplay] = useState(false)
    const [showAccountInfo, setAccountInfoDisplay] = useState(false)

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

    const  navigate = useNavigate()

    return <div>
        <div className={'flex justify-between items-center border-b border-gray-300 md:py-3 md:px-3 py-1 px-1'}>
            <div className={'flex items-center'}>
                <img src={mp2Icon} className="w-9 md:w-12 mx-2 cursor-pointer" />
                <p className="font-semibold text-2xl hidden md:block">{title}</p>
            </div>
            <div className={'flex items-center cursor-pointer relative'} ref={divRef} onClick={() => setMenuDisplay(!showMenu)}>
                <img src={userIcon} className="w-10 mr-1" />
                <p className="font-semibold text-lg hidden md:block">{selectedAccount}</p>
                {showMenu ? <div className="absolute top-5 border  bg-gray-100 cursor-pointer z-20 w-40 right-10 md:top-12 md:right-0 md:bg-gray-100">
                    <div className="flex items-center justify-evenly py-1 border-b border-gray-200 hover:bg-blue-200" onClick={() => {
                        setAccountInfoDisplay(true)
                        setMenuDisplay(false)
                    }}>
                        <img src={accountIcon} className="w-7" />
                        <p className="font-semibold">Profile</p>
                    </div>
                    <div className="flex items-center justify-evenly py-1 hover:bg-blue-200" onClick={() => {
                        navigate('/u/wallet')
                        setMenuDisplay(false)
                    }}>
                        <img src={walletIcon} className="w-7" />
                        <p className="hover:bg-blue-200 cursor-pointer font-semibold">Wallet</p>
                    </div>
                </div> : null}
            </div>
        </div>
        <AccountDetails
            open={showAccountInfo}
            onClose={() => setAccountInfoDisplay(false)}
            selectedAccount={selectedAccount || ''}
            onLogout={clearAuth}
            accountIds={accountIds}
            phoneNumber={phoneNumber}
            switchAccount={(accountId) => switchAccount(accountId, () => {
                setTimeout(() => {
                    setAccountInfoDisplay(false)
                }, 200)
            })}
        />
    </div>
}