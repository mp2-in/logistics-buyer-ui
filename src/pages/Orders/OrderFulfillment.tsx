import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"


export default ({ open, onClose, assignRider, loading }: {
    open: boolean,
    onClose: () => void,
    assignRider: () => void,
    loading: boolean
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded py-[5px] px-[20px] md:w-[500px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-lg font-semibold">Assign Rider</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'mt-5'}>
                <p>Do you want to look for riders?</p>
                <div className="mt-[40px] mb-[25px] flex justify-end">
                    <div className="mr-3">
                        <Button title="Cancel" variant="light" onClick={onClose} disabled={loading} />
                    </div>
                    <Button title="Yes" variant="primary" onClick={() => assignRider()} loading={loading} />
                </div>
            </div>
        </div>
    </Modal>
}   