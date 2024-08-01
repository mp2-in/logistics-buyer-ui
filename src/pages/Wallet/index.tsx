import { useEffect, useState } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { useWalletState } from 'stores/wallet'
import backIcon from "@assets/back.png"
import { useNavigate } from 'react-router-dom'
import ActivityIndicator from '@components/ActivityIndicator'

export default () => {

    const { token } = useAppConfigStore(state => ({ token: state.token }))
    const { activity, getWalletDashboardLink } = useWalletState(state => ({ getWalletDashboardLink: state.getWalletDashboardLink, activity: state.activity }))

    const [walletLink, setWalletLink] = useState<string | undefined>(undefined)

    const navigate = useNavigate()

    useEffect(() => {
        getWalletDashboardLink(token || '', (link) => {
            setWalletLink(link)
        })
    }, [])

    return <div className='flex items-center justify-center flex-col relative'>
        <div className='flex items-center absolute left-1 top-1 cursor-pointer' onClick={() => navigate('/u/orders')}>
            <img src={backIcon} alt='Dashboard' className='w-8 mr-5' />
            <p className='font-semibold text-lg hidden md:block'>Dashboard</p>
        </div>
        <a href='https://pages.razorpay.com/mp2-wallet-recharge' target='_blank'>
            <div className='px-5 py-2 bg-sky-600 rounded-md md:my-20 mt-6 mb-4'>
                <p className='text-white font-semibold'>Recharge Wallet</p>
            </div>
        </a>
        {walletLink ? <div className={`bg-white rounded flex flex-col items-center py-3 px-5 md:h-[700px] w-[350px] h-[600px] relative md:w-[550px]`} onMouseDown={e => e.stopPropagation()}>
            <iframe src={walletLink} height={'700'} width={'500'} className="hidden md:block" />
            <iframe src={walletLink} height={'550'} width={'330'} className="block md:hidden" />
        </div> : activity.getWalletDashboardLink ? <ActivityIndicator /> : null}
    </div>
}