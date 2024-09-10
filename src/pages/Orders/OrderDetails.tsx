import trackIcon from '@assets/track.png'

import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Order } from "@lib/interfaces"
import dayjs from "dayjs"
import { cancellationIdReasonMapping } from "@lib/utils"
import ShowValue from "@components/ShowValue"
import OrderActions from "./OrderActions"

dayjs.extend(advancedFormat)


export default ({ orderInfo, onCancelOrder, onIssueReport, onOrderFulfillment, onAddOrder, actionAtTop }: {
    orderInfo: Order | undefined,
    onCancelOrder: (orderId: string) => void
    onIssueReport: (orderId: string) => void
    onOrderFulfillment: (orderId: string) => void
    onAddOrder: (orderId?: string) => void
    actionAtTop?: boolean
}) => {
    return <>
        {actionAtTop ? <div className='sticky top-0 bg-white z-[1] py-5 w-full'>
            <OrderActions orderInfo={orderInfo} onAddOrder={onAddOrder} onCancelOrder={onCancelOrder} onOrderFulfillment={onOrderFulfillment} onIssueReport={onIssueReport} />
        </div> : null}
        <div className="md:flex justify-between">
            <ShowValue label="Order Id" value={orderInfo?.orderId} />
            <ShowValue label="Client Order Id" value={orderInfo?.clientOrderId} />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Network Order Id" value={orderInfo?.networkOrderId} large />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="State" value={orderInfo?.orderState} />
            <ShowValue label="Selction Mode" value={orderInfo?.selectionMode} />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="LSP" value={orderInfo?.providerId} />
            <ShowValue label="Order Category" value={orderInfo?.orderCategory} />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Delivery Fee" value={orderInfo?.deliveryFee ? `₹ ${orderInfo?.deliveryFee}` : '₹ 0'} />
            <ShowValue label="Platform Fee" value={orderInfo?.platformFee ? `₹ ${orderInfo?.platformFee}` : '₹ 0'} />
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
            <ShowValue label="Reached Pickup At" value={orderInfo?.atpickupAt} isDate />
            <ShowValue label="Picked At" value={orderInfo?.pickedupAt} isDate />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Reached Delivery At" value={orderInfo?.atdeliveryAt} isDate />
            <ShowValue label="Delivered At" value={orderInfo?.deliveredAt} isDate />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="RTO Initiated At" value={orderInfo?.rtoPickedupAt} isDate />
            <ShowValue label="RTO Delivered At" value={orderInfo?.rtoDeliveredAt} isDate />
        </div>
        {!actionAtTop?<OrderActions orderInfo={orderInfo} onAddOrder={onAddOrder} onCancelOrder={onCancelOrder} onOrderFulfillment={onOrderFulfillment} onIssueReport={onIssueReport} />:null}
        <p className="font-bold bg-slate-100 my-2 py-1 px-3 w-full rounded-md">Rider</p>
        <div className="md:flex justify-between">
            <ShowValue label="Name" value={orderInfo?.riderName} />
            <ShowValue label="Phone" value={orderInfo?.riderNumber} />
        </div>
        <p className="font-bold bg-slate-100 my-2 py-1 px-3 w-full rounded-md">Pickup</p>
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
            <ShowValue label="Pincode" value={orderInfo?.pickupPincode} small />
            {orderInfo?.pickupLatitude && orderInfo?.pickupLongitude ? <a href={`https://maps.google.com/?q=${orderInfo?.pickupLatitude},${orderInfo?.pickupLongitude}`} target="_blank">
                <img src={trackIcon} className="w-6 mx-5" /></a> : <img src={trackIcon} className="w-6 mx-5 opacity-30" />}
            <ShowValue label="Pcc" value={orderInfo?.pcc} small />
        </div>
        <p className="font-bold bg-slate-100 my-2 py-1 px-3 w-full rounded-md">Drop</p>
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
            <ShowValue label="Pincode" value={orderInfo?.dropPincode} small />
            {orderInfo?.dropLatitude && orderInfo?.dropLongitude ? <a href={`https://maps.google.com/?q=${orderInfo?.dropLatitude},${orderInfo?.dropLongitude}`} target="_blank">
                <img src={trackIcon} className="w-6 mx-5" /></a> : <img src={trackIcon} className="w-6 mx-5 opacity-30" />}
            <ShowValue label="Dcc" value={orderInfo?.dcc} small />
        </div>
        <p className="font-bold bg-slate-100 my-2 py-1 px-3 w-full rounded-md">Cancellation</p>
        <div className="md:flex justify-between">
            <ShowValue label="Cancelled At" value={orderInfo?.cancelledAt} isDate />
            <ShowValue label="Cancelled by" value={orderInfo?.cancelledBy} />
        </div>
        <div className="flex justify-between">
            <ShowValue label="Reason" value={cancellationIdReasonMapping[orderInfo?.cancellationReason || '']} large />
        </div>
    </>
}   