import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Button from "@components/Button"


export default ({ open, onClose, closeIssue, loading }: {
    open: boolean,
    onClose: () => void,
    closeIssue: () => void,
    loading: boolean
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded py-[10px] px-[20px] md:w-[600px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Logout</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'mt-1'}>
                <p className="ml-3">Are you sure you want to close this issue?</p>
                <div className="mt-[20px] mb-[15px] w-full flex justify-end">
                    <Button title="Cancel" variant="light" onClick={onClose} disabled={loading} />
                    <div className="ml-3">
                        <Button title="Close Issue" variant="primary" onClick={closeIssue} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    </Modal>
}   