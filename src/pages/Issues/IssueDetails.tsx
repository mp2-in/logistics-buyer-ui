import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Issue } from "@lib/interfaces"
import dayjs from "dayjs"
import ShowValue from "@components/ShowValue"
import IssueActions from './IssueActions'

dayjs.extend(advancedFormat)


export default ({ issueDetails, actionOnTop, onClose, onRefresh }: {
    issueDetails: Issue | undefined
    actionOnTop?: boolean
    onClose?: () => void
    onRefresh?: () => void
}) => {
    return <div>
        {actionOnTop ? <IssueActions onClose={onClose ? () => onClose() : undefined}  onRefresh={onRefresh ? () => onRefresh() : undefined}/> : null}
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
            <ShowValue label="Resolved At" value={issueDetails?.resolvedat} isDate />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Category" value={issueDetails?.category} />
            <ShowValue label="Sub Category" value={issueDetails?.subCategory} />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Short Description" value={issueDetails?.shortDescription} large />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Long Description" value={issueDetails?.longDescription || ''} textArea large />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Resolution Action" value={issueDetails?.resolutionAction} />
            <ShowValue label="Refund Amount" value={issueDetails?.refundAmount} number />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Expected Refund Amount" value={issueDetails?.expectedRefundAmount} number />
            <ShowValue label="Issued Refund Amount" value={issueDetails?.issuedRefundAmount} number />
        </div>
        <div className="md:flex justify-between">
            <ShowValue label="Resolution Description" value={issueDetails?.resolutionDescription} textArea large />
        </div>
    </div>
}   