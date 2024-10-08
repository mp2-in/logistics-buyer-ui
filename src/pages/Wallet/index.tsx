import { useEffect, useState } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { useWalletState } from 'stores/wallet'
import addIcon from "@assets/add.png"
import ActivityIndicator from '@components/ActivityIndicator'
import TopBar from '@components/TopBar'
import Button from '@components/Button'
import { useOrdersStore } from 'stores/orders'

export default () => {

    const { token, selectedAccount, phone, email, setPage } = useAppConfigStore(state => ({
        token: state.token,
        selectedAccount: state.selectedAccount,
        phone: state.phone,
        email: state.email,
        role: state.role,
        setPage: state.setPage
    }))

    const { activity, getWalletDashboardLink } = useWalletState(state => ({ getWalletDashboardLink: state.getWalletDashboardLink, activity: state.activity }))
    const { clearPickupList } = useOrdersStore(state => ({ clearPickupList: state.clearPickupList }))

    const [walletLink, setWalletLink] = useState<string | undefined>(undefined)

    useEffect(() => {
        getWalletDashboardLink(token || '', (link) => {
            setWalletLink(link)
        })
        setPage('wallet')
    }, [])

    return <div>
        <TopBar title='Wallet' onAccountSwitch={() => clearPickupList()}/>
        <div className={`absolute left-0 right-0 md:top-[80px] top-[50px] bottom-3 md:px-5 md:py-3 px-2`}>
            <div className={`flex flex-row-reverse sm:items-end items-start justify-between p-2 sm:flex-row-reverse  mb-2`}>
                <a href={`https://pages.razorpay.com/mp2-wallet-recharge?phone=${phone || ''}&email=${email || ''}&mp2_accountid=${selectedAccount}`} target='_blank'>
                    <Button title="Recharge Wallet" icon={<img src={addIcon} />} variant="primary" />
                </a>
            </div>
            <div className={`absolute left-2 right-2 bottom-2 top-[60px] overflow-auto lg:left-5 lg:right-5 md:top-[85px]`}>
                {walletLink ? <div onMouseDown={e => e.stopPropagation()}>
                    <iframe src={walletLink} className="absolute right-0 top-0 bottom-0 left-0 w-full h-full" />
                </div> : activity.getWalletDashboardLink ? <ActivityIndicator /> : null}
            </div>
        </div>
    </div>
}