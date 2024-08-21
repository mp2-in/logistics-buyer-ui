import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Issue } from "@lib/interfaces"
import dayjs from "dayjs"

dayjs.extend(advancedFormat)


const ShowValue = ({ label, value, isDate, large, small, textArea }: {
    label: string,
    value: string | number | undefined,
    isDate?: boolean,
    large?: boolean,
    small?: boolean,
    textArea?: boolean
}) => {
    return <div className={`relative border border-gray-100 my-3 py-[4px] px-3 ${large ? `md:w-[530px] w-[290px]` : small ? `md:w-[150px] w-[100px]` : 'md:w-[260px] w-[290px]'} rounded-md`}>
        <p className="absolute -top-2 px-2 bg-white text-xs left-3 text-gray-500">{label}</p>
        {textArea?<div className="overflow-auto">
            <p className="w-full h-[80px] text-sm">{value}</p>
        </div>
        :<input className="font-normal outline-none border-none w-full text-sm" readOnly value={value === undefined || value === '' || !value ? '--' : isDate ? dayjs(value).format('MMM Do, hh:mm A') : value} />}
    </div>
}

export default ({ open, onClose, issueDetails }: {
    open: boolean,
    onClose: () => void,
    issueDetails: Issue | undefined
}) => {
    return <Modal open={open} onClose={onClose}>
        <div className={'md:h-[700px] md:w-[600px] w-[350px] h-[600px] bg-white p-3 rounded-md relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between'}>
                <p className="font-semibold text-lg">Issue Details</p>
                <img src={closeIcon} onClick={onClose} className={'w-6 h-6 cursor-pointer absolute top-1 right-1'} />
            </div>
            <div className="p-4 md:h-[640px] overflow-auto h-[540px]">
                <div className="md:flex justify-between">
                    <ShowValue label="Issue Id" value={issueDetails?.issueId} large />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Network Order Id" value={issueDetails?.networkOrderId} large />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Order Id" value={issueDetails?.orderId} />
                    <ShowValue label="Client Order Id" value={issueDetails?.clientOrderId} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Status" value={issueDetails?.issueStatus} />
                    <ShowValue label="Resolution Status" value={issueDetails?.resolutionStatus} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Created At" value={issueDetails?.createdat} isDate />
                    <ShowValue label="Status Updated At" value={issueDetails?.statusUpdatedat} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Relayed At" value={issueDetails?.relayedat} isDate />
                    <ShowValue label="Closed At" value={issueDetails?.closedat} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Updated At" value={issueDetails?.updatedat} isDate />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Category" value={issueDetails?.category} />
                    <ShowValue label="Sub Category" value={issueDetails?.subCategory} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Short Desc" value={issueDetails?.shortDescription} large />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Long Description" value={issueDetails?.longDescription || ''} textArea large/>
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Resolution Action" value={issueDetails?.resolutionAction} />
                    <ShowValue label="Refund Amount" value={issueDetails?.refundAmount} />
                </div>
                <div className="md:flex justify-between">
                    <ShowValue label="Resolution Desc" value={issueDetails?.resolutionDescription} large />
                </div>
            </div>
        </div>
    </Modal>
}   