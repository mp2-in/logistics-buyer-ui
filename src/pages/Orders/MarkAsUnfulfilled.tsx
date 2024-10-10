import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"


export default ({ open, onClose, markAsUnfulfilled, loading }: { 
    open: boolean, 
    onClose: () => void, 
    markAsUnfulfilled: () => void, 
    loading: boolean 
}) => {
    
    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Mark as Unfulfilled</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <p>The Order will be marked as Unfulfilled. Are you sure?</p>
                <div className="mt-[40px] mb-[25px]">
                    <Button title="Mark as Unfulfilled" variant="primary" onClick={() => markAsUnfulfilled()} loading={loading} />
                </div>
            </div>
        </div>
    </Modal>
}   