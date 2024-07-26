import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import trackIcon from '@assets/track.png'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Order } from "@lib/interfaces"
import dayjs from "dayjs"
import { cancellationIdReasonMapping } from "@lib/utils"
import Button from "@components/Button"

dayjs.extend(advancedFormat)


const ShowValue = ({ label, value, isDate, large, small }: { label: string, value: string | number | undefined, isDate?: boolean, large?: boolean, small?: boolean }) => {
    return <div className={`relative border border-gray-100 my-3 py-[4px] px-3 ${large ? `md:w-[500px] w-[290px]` : small ? `md:w-[260px] w-[100px]` : 'md:w-[260px] w-[290px]'} rounded-md`}>
        <p className="absolute -top-2 px-2 bg-white text-xs left-3 text-gray-500">{label}</p>
        <input className="font-semibold outline-none border-none w-full text-sm" readOnly value={value === undefined || value === '' || !value ? '--' : isDate ? dayjs(value).format('MMM Do, hh:mm A') : value} />
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
                    <ShowValue label="ID" value={orderInfo?.orderId} />
                    <ShowValue label="Client Order Id" value={orderInfo?.clientOrderId} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="State" value={orderInfo?.orderState} />
                    <ShowValue label="Selection Mode" value={orderInfo?.selectionMode} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Delivery Charge" value={orderInfo?.totalDeliveryCharge ? `₹ ${orderInfo?.totalDeliveryCharge}` : '₹ 0'} />
                    <ShowValue label="SAAS Fee" value={orderInfo?.saasFee ? `₹ ${orderInfo?.saasFee}` : '₹ 0'} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Order Amount" value={orderInfo?.orderAmount ? `₹ ${orderInfo?.orderAmount}` : '₹ 0'} />
                    <ShowValue label="Distance" value={orderInfo?.distance ? `${orderInfo?.distance} km` : '0 km'} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Created At" value={orderInfo?.createdAt} isDate />
                    <ShowValue label="Assigned At" value={orderInfo?.assignedAt} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Picked At" value={orderInfo?.pickedupAt} isDate />
                    <ShowValue label="Delivered At" value={orderInfo?.deliveredAt} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="RTO Initiated At" value={orderInfo?.rtoPickedupAt} isDate />
                    <ShowValue label="RTO Delivered At" value={orderInfo?.rtoDeliveredAt} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="LSP" value={orderInfo?.providerId} />
                    <ShowValue label="Category" value={orderInfo?.orderCategory} />
                </div>
                <div className="flex justify-between items-center">
                    {orderInfo?.trackingUrl ? <a className="font-semibold underline cursor-pointer text-blue-500 ml-4" href={orderInfo?.trackingUrl} target="_blank">Track Order</a> :
                        <p className="font-semibold underline text-gray-300 ml-1">Track Order</p>}
                    <Button title="Cancel Order" variant="danger" disabled={!['UnFulfilled', 'Searching-for-Agent', 'Pending'].includes(orderInfo?.orderState || '')} onClick={() => {
                        if (orderInfo?.orderId) {
                            onCancelOrder(orderInfo.orderId)
                        }
                    }} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Rider</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.riderName} />
                    <ShowValue label="Phone" value={orderInfo?.riderNumber} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Pickup</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.pickupName} />
                    <ShowValue label="Phone" value={orderInfo?.pickupPhone} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Address Line 1" value={orderInfo?.pickupAddress?.line1} />
                    <ShowValue label="Address Line 2" value={orderInfo?.pickupAddress?.line2} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="City" value={orderInfo?.pickupAddress?.city} />
                    <ShowValue label="State" value={orderInfo?.pickupAddress?.state} />
                </div>
                <div className="flex items-center">
                    <ShowValue label="Pincode" value={orderInfo?.pickupPincode} small/>
                    {orderInfo?.pickupLatitude && orderInfo?.pickupLongitude ? <a href={`https://maps.google.com/?q=${orderInfo?.pickupLatitude},${orderInfo?.pickupLongitude}`} target="_blank"><img src={trackIcon} className="w-6 ml-5"/></a> : null}
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Drop</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.dropName} />
                    <ShowValue label="Phone" value={orderInfo?.dropPhone} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Address Line 1" value={orderInfo?.dropAddress?.line1} />
                    <ShowValue label="Address Line 2" value={orderInfo?.dropAddress?.line2} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="City" value={orderInfo?.dropAddress?.city} />
                    <ShowValue label="State" value={orderInfo?.dropAddress?.state} />
                </div>
                <div className="flex items-center">
                    <ShowValue label="Pincode" value={orderInfo?.dropPincode} small/>
                    {orderInfo?.dropLatitude && orderInfo?.dropLongitude ? <a href={`https://maps.google.com/?q=${orderInfo?.dropLatitude},${orderInfo?.dropLongitude}`} target="_blank"><img src={trackIcon} className="w-6 ml-5"/></a> : null}
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3">Cancellation</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Cancelled At" value={orderInfo?.cancelledAt} isDate />
                    <ShowValue label="Cancelled by" value={orderInfo?.cancelledBy} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Reason" value={cancellationIdReasonMapping[orderInfo?.cancellationReason || '']} large />
                </div>
            </div>
        </div>
    </Modal>
}   