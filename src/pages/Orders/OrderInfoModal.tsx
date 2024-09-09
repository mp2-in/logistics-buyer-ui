import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import trackIcon from '@assets/track.png'

import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Order } from "@lib/interfaces"
import dayjs from "dayjs"
import OrderDetails from "./OrderDetails"

dayjs.extend(advancedFormat)


export default ({ open, onClose, orderInfo, onCancelOrder, onIssueReport, onOrderFulfillment, onAddOrder }: {
    open: boolean,
    onClose: () => void,
    orderInfo: Order | undefined,
    onCancelOrder: (orderId: string) => void
    onIssueReport: (orderId: string) => void
    onOrderFulfillment: (orderId: string) => void
    onAddOrder: (orderId?: string) => void
}) => {
    return <Modal open={open} onClose={onClose}>
        <div className={'md:h-[700px] md:w-[600px] w-[350px] h-[600px] bg-white p-3 rounded-md relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between'}>
                <p className="font-semibold text-lg">Order Info</p>
                <img src={closeIcon} onClick={onClose} className={'w-6 h-6 cursor-pointer absolute top-1 right-1'} />
            </div>
            <div className="p-4 md:h-[640px] overflow-auto h-[540px]">
                <OrderDetails orderInfo={orderInfo} onAddOrder={onAddOrder} onCancelOrder={onCancelOrder} onIssueReport={onIssueReport} onOrderFulfillment={onOrderFulfillment}/>
            </div>
        </div>
    </Modal>
}   