import { createRef, useEffect, useState } from "react"

import WalletInfo from "./WalletInfo"

import menuIcon from "@assets/menu.png"
import userIcon from "@assets/user.png"
import accountIcon from "@assets/account.png"
import walletIcon from "@assets/wallet.png"
import AccountDetails from "./AccountDetails"


export default ({ selectedAccount, clearAuth, getWalletInfoPageLink, accountIds, phoneNumber, switchAccount }: {
    selectedAccount: string,
    clearAuth: () => void,
    getWalletInfoPageLink: (callback: (link: string) => void) => void
    accountIds: string[]
    phoneNumber?: string
    switchAccount: (accountId: string) => void
}) => {
    let divRef = createRef<HTMLInputElement>();

    const [showMenu, setMenuDisplay] = useState(false)
    const [showWalletInfo, setWalletInfoDisplay] = useState(false)
    const [showAccountInfo, setAccountInfoDisplay] = useState(false)
    const [walletPageLink, setWalletPageLink] = useState('')

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

    return <div>
        <div className={'flex justify-between items-center border-b border-gray-300 md:py-3 md:px-5 py-1 px-1'}>
            <div className={'flex items-center'}>
                <img src={menuIcon} className="w-9 mx-2 cursor-pointer" />
                <p className="font-semibold text-2xl hidden md:block">Orders</p>
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
                        getWalletInfoPageLink((link) => {
                            setWalletPageLink(link)
                            setWalletInfoDisplay(true)
                        })
                        setMenuDisplay(false)
                    }}>
                        <img src={walletIcon} className="w-7" />
                        <p className="hover:bg-blue-200 cursor-pointer font-semibold">Wallet</p>
                    </div>
                </div> : null}
            </div>
        </div>
        <WalletInfo
            open={showWalletInfo}
            onClose={() => setWalletInfoDisplay(false)}
            link={walletPageLink}
        />
        <AccountDetails
            open={showAccountInfo}
            onClose={() => setAccountInfoDisplay(false)}
            selectedAccount={selectedAccount || ''}
            onLogout={clearAuth}
            accountIds={accountIds}
            phoneNumber={phoneNumber}
            switchAccount={(accountId) => switchAccount(accountId)}
        />
    </div>
}