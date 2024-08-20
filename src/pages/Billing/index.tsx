import { useEffect, useState } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { useWalletState } from 'stores/wallet'
import ActivityIndicator from '@components/ActivityIndicator'
import TopBar from '@components/TopBar'
import { useOrdersStore } from 'stores/orders'

export default () => {

    const { token } = useAppConfigStore(state => ({
        token: state.token,
    }))

    const { activity, getBillingInfoLink } = useWalletState(state => ({ getBillingInfoLink: state.getBillingInfoLink, activity: state.activity }))
    const { clearPickupList } = useOrdersStore(state => ({ clearPickupList: state.clearPickupList }))

    const [billingInfoLink, setBillingInfoLink] = useState<string | undefined>(undefined)

    useEffect(() => {
        getBillingInfoLink(token || '', (link) => {
            setBillingInfoLink(link)
        })
    }, [])

    return <div>
        <TopBar title='Reports' onAccountSwitch={() => clearPickupList()}/>
        <div className={`absolute left-0 right-0 md:top-[80px] top-[50px] bottom-3 md:px-5 md:py-3 px-2`}>
            <div className={`absolute left-2 right-2 bottom-2 top-[60px] overflow-auto lg:left-5 lg:right-5 md:top-[85px]`}>
                {billingInfoLink ? <div onMouseDown={e => e.stopPropagation()}>
                    <iframe src={billingInfoLink} className="hidden md:block absolute right-0 top-0 bottom-0 left-0 w-full h-full" />
                    <iframe src={billingInfoLink} className="block md:hidden absolute right-0 top-0 bottom-0 left-0 w-full h-full" />
                </div> : activity.getWalletDashboardLink ? <ActivityIndicator /> : null}
            </div>
        </div>
    </div>
}