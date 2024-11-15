import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import { Issue } from "@lib/interfaces"
import IssueDetails from "./IssueDetails"


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
                <IssueDetails issueDetails={issueDetails}/>
            </div>
        </div>
    </Modal>
}   