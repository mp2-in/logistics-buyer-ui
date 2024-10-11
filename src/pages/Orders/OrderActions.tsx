import trackIcon from '@assets/track.png'
import cancelIcon from '@assets/cancel.png'
import issueIcon from '@assets/warning.png'
import driverSearch from "@assets/driver_search.png"
import retryIcon from "@assets/retry.png"
import blockIcon from "@assets/block.png"
import { cancellable } from "@lib/utils"
import { Order } from '@lib/interfaces'

export default ({ orderInfo, onCancelOrder, onIssueReport, onOrderFulfillment, onAddOrder, role, markOrderAsUnfulfilled }: {
    orderInfo: Order | undefined,
    onCancelOrder: (orderId: string) => void
    markOrderAsUnfulfilled: (orderId: string) => void
    onIssueReport: (orderId: string) => void
    onOrderFulfillment: (orderId: string) => void
    onAddOrder: (orderId?: string) => void
    role: string
}) => {

    const canMarkAsUnfulfilled = (orderState: string) => {
        return ['Pending', 'Searching-for-Agent', 'Agent-assigned', 'At-pickup'].includes(orderState) && /super_admin/.test(role)
    }

    return <div className="grid grid-cols-4 gap-5">
        <div className="flex items-center flex-col" onClick={() => {
            if (/unfulfilled/i.test(orderInfo?.orderState || '')) {
                onOrderFulfillment(orderInfo?.orderId || '')
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center ${/unfulfilled/i.test(orderInfo?.orderState || '') ? 'cursor-pointer' : 'opacity-30'}`}>
                <img src={driverSearch} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-blue-500 font-semibold ${/unfulfilled/i.test(orderInfo?.orderState || '') ? '' : 'opacity-30'}`}>Assign</p>
        </div>
        <div className="flex items-center flex-col">
            {orderInfo?.trackingUrl ? <a className={`w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center`} href={orderInfo?.trackingUrl} target="_blank">
                <img src={trackIcon} className="w-6" /></a> : <a className={`w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center opacity-25`}><img src={trackIcon} className="w-6" /></a>}
            <p className={`text-sm mt-1 hidden md:block text-blue-500 font-semibold ${!orderInfo?.trackingUrl ? 'opacity-30' : ''}`}>Track</p>
        </div>
        <div className="flex items-center flex-col" onClick={() => {
            if (orderInfo?.networkOrderId && orderInfo?.orderId) {
                onIssueReport(orderInfo.orderId)
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center ${orderInfo?.networkOrderId && orderInfo?.orderId ? 'cursor-pointer' : 'opacity-30'}`}><img src={issueIcon} className="w-6" /></div>
            <p className={`text-sm mt-1 hidden md:block text-red-500 font-semibold ${orderInfo?.networkOrderId && orderInfo?.orderId ? '' : 'opacity-30'}`}>Issue</p>
        </div>
        <div className="flex items-center flex-col" onClick={() => {
            if (orderInfo?.orderId && cancellable(orderInfo?.orderState || '')) {
                onCancelOrder(orderInfo.orderId)
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center ${cancellable(orderInfo?.orderState || '') ? 'cursor-pointer' : 'opacity-30'}`}>
                <img src={cancelIcon} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-red-500 font-semibold ${!cancellable(orderInfo?.orderState || '') ? 'opacity-30' : ''}`}>Cancel</p>
        </div>
        <div className="flex items-center flex-col" onClick={() => {
            if (orderInfo?.orderState === 'Cancelled') {
                onAddOrder(orderInfo?.orderId)
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center ${orderInfo?.orderState === 'Cancelled' ? 'cursor-pointer' : 'opacity-30'}`}>
                <img src={retryIcon} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-blue-500 font-semibold ${orderInfo?.orderState !== 'Cancelled' ? 'opacity-30' : ''}`}>Re-Book</p>
        </div>
        <div className="flex items-center flex-col" onClick={() => {
            if (canMarkAsUnfulfilled(orderInfo?.orderState || '')) {
                markOrderAsUnfulfilled(orderInfo?.orderId || '')
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center ${canMarkAsUnfulfilled(orderInfo?.orderState || '') ? 'cursor-pointer' : 'opacity-30'}`}>
                <img src={blockIcon} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-red-500 font-semibold ${canMarkAsUnfulfilled(orderInfo?.orderState || '')? '' : 'opacity-30'}`}>Unfulfill</p>
        </div>
    </div>
}