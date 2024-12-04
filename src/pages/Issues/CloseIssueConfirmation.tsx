import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import thumbsDown from '@assets/thumb_down.png'
import thumbsDownFilled from '@assets/thumb_down_filled.png'
import thumbsUp from '@assets/thumbs_up.png'
import thumbsUpFilled from '@assets/thumb_up_filled.png'
import { useState } from "react"
import Button from "@components/Button"


export default ({ open, onClose, closeIssue, loading }: {
    open: boolean,
    onClose: () => void,
    closeIssue: (rating: 'THUMBS-UP' | 'THUMBS-DOWN' | undefined) => void,
    loading: boolean
}) => {

    const [feedback, setFeedback] = useState<'THUMBS-UP' | 'THUMBS-DOWN' | undefined>(undefined)

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded py-[10px] px-[20px] md:w-[600px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Close Issue</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'mt-1'}>
                <p className="ml-3 mt-5">Are you sure you want to close this issue?</p>
                <div className="flex cursor-pointer">
                    <div className="rounded-full hover:bg-blue-50 p-2" onClick={() => setFeedback(feedback === 'THUMBS-UP' ? undefined : 'THUMBS-UP')}>
                        <img src={feedback === 'THUMBS-UP' ? thumbsUpFilled : thumbsUp} className="w-6" />
                    </div>
                    <div className="rounded-full hover:bg-blue-50 p-2" onClick={() => setFeedback(feedback === 'THUMBS-DOWN' ? undefined : 'THUMBS-DOWN')}>
                        <img src={feedback === 'THUMBS-DOWN' ? thumbsDownFilled : thumbsDown} className="w-6" />
                    </div>
                </div>
                <div className="mt-[5px] mb-[15px] w-full flex justify-end">
                    <Button title="Cancel" variant="light" onClick={onClose} disabled={loading} />
                    <div className="ml-3">
                        <Button title="Close Issue" variant="primary" onClick={() => closeIssue(feedback)} loading={loading}/>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
}   