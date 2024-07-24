import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Order } from "@lib/interfaces"
import dayjs from "dayjs"
import { cancellationIdReasonMapping } from "@lib/utils"
import Button from "@components/Button"

dayjs.extend(advancedFormat)


const ShowValue = ({ label, value, isDate, large }: { label: string, value: string | number | undefined, isDate?: boolean, large?: boolean }) => {
    return <div className={`relative border border-gray-100 my-3 py-[4px] px-3 ${large ? `md:w-[500px] w-[290px]` : 'md:w-[260px] w-[290px]'} rounded-md`}>
        <p className="absolute -top-2 px-2 bg-white text-xs left-3 text-gray-500">{label}</p>
        <input className="font-semibold outline-none border-none w-full text-sm" readOnly value={value === undefined || value === '' ? '--' : isDate ? dayjs(value).format('MMM Do, hh:mm A') : value} />
    </div>
}

export default ({ open, onClose, orderInfo, onCancelOrder }: { 
    open: boolean, 
    onClose: () => void, 
    orderInfo: Order | undefined, 
    onCancelOrder: (orderId: string) => void 
}) => {
    return <Modal open={open} onClose={onClose}>
        <div className={'md:h-[700px] md:w-[600px] w-[350px] h-[600px] bg-white p-3 rounded-md relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between'}>
                <p className="font-semibold text-lg">Order Info</p>
                <img src={closeIcon} onClick={onClose} className={'w-6 h-6 cursor-pointer absolute top-1 right-1'} />
            </div>
            <div className="p-4 md:h-[640px] overflow-auto h-[540px]">
                <div className="md:flex justify-between">
                    <ShowValue label="ID" value={orderInfo?.id} />
                    <ShowValue label="Client Order Id" value={orderInfo?.client_order_id} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="State" value={orderInfo?.state} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Price" value={orderInfo?.price ? `₹ ${orderInfo?.price}` : '₹ 0'} />
                    <ShowValue label="Distance" value={orderInfo?.distance ? `${orderInfo?.distance} km` : '0 km'} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Created At" value={orderInfo?.created_at} isDate />
                    <ShowValue label="Assigned At" value={orderInfo?.assigned_at} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Picked At" value={orderInfo?.pickedup_at} isDate />
                    <ShowValue label="Delivered At" value={orderInfo?.delivered_at} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="RTO Initiated At" value={orderInfo?.rto_initiated_at} isDate />
                    <ShowValue label="RTO Delivered At" value={orderInfo?.rto_delivered_at} isDate />
                </div>
                <div className="flex justify-between items-center">
                    {orderInfo?.tracking_url ? <a className="font-semibold underline cursor-pointer text-blue-500 ml-4" href={orderInfo?.tracking_url} target="_blank">Track Order</a> :
                        <p className="font-semibold underline text-gray-300 ml-1">Track Order</p>}
                    <Button title="Cancel Order" variant="danger" disabled={!['UnFulfilled', 'Searching-for-Agent', 'Pending'].includes(orderInfo?.state || '')} onClick={() => {
                        if(orderInfo?.id) {
                            onCancelOrder(orderInfo.id)
                        }
                    }}/>
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">LSP</p>
                <div className="md:flex justify-between">
                    <ShowValue label="ID" value={orderInfo?.lsp.id} />
                    <ShowValue label="Name" value={orderInfo?.lsp.name} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Item Id" value={orderInfo?.lsp.item_id} />
                    <ShowValue label="Network Order Id" value={orderInfo?.lsp.network_order_id} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Rider</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.rider.name} />
                    <ShowValue label="Phone" value={orderInfo?.rider.phone} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Cancellation</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Cancelled At" value={orderInfo?.cancelled_at} isDate />
                    <ShowValue label="Cancelled by" value={orderInfo?.cancellation.cancelled_by} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Reason" value={cancellationIdReasonMapping[orderInfo?.cancellation.reason_id || '']} large />
                </div>
            </div>
        </div>
    </Modal>
}   