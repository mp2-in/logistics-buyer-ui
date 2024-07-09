import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import { Order } from "@lib/interfaces"
import dayjs from "dayjs"
import { cancellationIdReasonMapping } from "@lib/utils"


const ShowValue = ({ label, value, isDate, large }: { label: string, value: string | number | undefined, isDate?: boolean, large?: boolean }) => {
    return <div className={`relative border border-gray-100 my-3 py-[4px] px-3 ${large?`w-[500px]`:'w-[260px]'} rounded-md overflow-`}>
        <p className="absolute -top-2 px-2 bg-white text-xs left-3 text-gray-500">{label}</p>
        <input className="font-semibold outline-none border-none w-full" readOnly value={value === undefined || value === '' ? '--' : isDate ? dayjs(value).format('DD MMM, hh:mm A') : value} />
    </div>
}

export default ({ open, onClose, orderInfo }: { open: boolean, onClose: () => void, orderInfo: Order | undefined }) => {
    return <Modal open={open} onClose={onClose}>
        <div className={'h-[700px] w-[600px] bg-white p-3 rounded-md'} onClick={e => e.stopPropagation()}>
            <div className={'flex justify-between'}>
                <p className="font-semibold text-lg">Order Info</p>
                <img src={closeIcon} onClick={onClose} className={'w-6 h-6 cursor-pointer'} />
            </div>
            <div className="p-4 h-[640px] overflow-auto">
                <div className="flex justify-between">
                    <ShowValue label="ID" value={orderInfo?.id} />
                    <ShowValue label="Client Order Id" value={orderInfo?.client_order_id} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="State" value={orderInfo?.state} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Price" value={orderInfo?.price} />
                    <ShowValue label="Distance" value={orderInfo?.distance} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Created At" value={orderInfo?.created_at} isDate />
                    <ShowValue label="Assigned At" value={orderInfo?.assigned_at} isDate />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Picked At" value={orderInfo?.pickedup_at} isDate />
                    <ShowValue label="Delivered At" value={orderInfo?.delivered_at} isDate />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="RTO Initiated At" value={orderInfo?.rto_initiated_at} isDate />
                    <ShowValue label="RTO Delivered At" value={orderInfo?.rto_delivered_at} isDate />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">LSP</p>
                <div className="flex justify-between">
                    <ShowValue label="ID" value={orderInfo?.lsp.id} />
                    <ShowValue label="Name" value={orderInfo?.lsp.name} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Item Id" value={orderInfo?.lsp.item_id} />
                    <ShowValue label="Network Order Id" value={orderInfo?.lsp.network_order_id} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Rider</p>
                <div className="flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.rider.name} />
                    <ShowValue label="Phone" value={orderInfo?.rider.phone} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Cancellation</p>
                <div className="flex justify-between">
                    <ShowValue label="Cancelled At" value={orderInfo?.cancelled_at} isDate />
                    <ShowValue label="Cancelled by" value={orderInfo?.cancellation.cancelled_by} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Reason" value={cancellationIdReasonMapping[orderInfo?.cancellation.reason_id || '']} large/>
                </div>
            </div>
        </div>
    </Modal>
}   