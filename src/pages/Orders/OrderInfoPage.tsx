import trackIcon from '@assets/track.png'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import dayjs from "dayjs"
import { cancellationIdReasonMapping } from "@lib/utils"
import ShowValue from "@components/ShowValue"
import { useParams } from 'react-router-dom'
import { useOrdersStore } from 'stores/orders'
import { useEffect, useState } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { Order } from '@lib/interfaces'
import TopBar from '@components/TopBar'

dayjs.extend(advancedFormat)


export default () => {
    const { orderId } = useParams() as { orderId: string }
    const { token } = useAppConfigStore(state => ({ token: state.token }))
    const { getOrderInfo } = useOrdersStore(state => ({ getOrderInfo: state.getOrderInfo }))
    const [orderInfo, setOrderInfo] = useState<Order | undefined>(undefined)

    useEffect(() => {
        getOrderInfo(token || '', orderId, (success, orderInfo) => {
            if (success) {
                setOrderInfo(orderInfo)
            }
        })
    }, [orderId])

    return <div>
        <TopBar title="Order Details"/>
        <div className={'absolute left-1 right-1 bottom-5 top-14 flex items-center  overflow-auto md:top-10 flex-col'}>
            <p className='md:invisible text-lg my-1 font-medium w-full text-left pl-5'>Order Details</p>
            <div className="w-[350px] md:w-[700px] border overflow-auto py-3 px-3 md:py-5 md:px-10 lg:px-40 lg:w-[1000px] rounded-md flex flex-col items-center md:block">
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
                <p className="font-bold bg-slate-100 my-2 py-1 px-3 rounded-md w-full">Rider</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Name" value={orderInfo?.riderName} />
                    <ShowValue label="Phone" value={orderInfo?.riderNumber} />
                </div>
                <p className="font-bold bg-slate-100 my-2 py-1 px-3 rounded-md w-full">Pickup</p>
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
                <p className="font-bold bg-slate-100 my-2 py-1 px-3 rounded-md w-full">Drop</p>
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
                <p className="font-bold bg-slate-100 my-2 py-1 px-3 rounded-md w-full">Cancellation</p>
                <div className="md:flex justify-between">
                    <ShowValue label="Cancelled At" value={orderInfo?.cancelledAt} isDate />
                    <ShowValue label="Cancelled by" value={orderInfo?.cancelledBy} />
                </div>
                <div className="flex justify-between">
                    <ShowValue label="Reason" value={cancellationIdReasonMapping[orderInfo?.cancellationReason || '']} large />
                </div>
            </div>
        </div>
    </div>
}   