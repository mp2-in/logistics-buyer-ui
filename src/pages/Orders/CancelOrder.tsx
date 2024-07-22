import { useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Select from "@components/Select"

import Button from "@components/Button"
import { cancellationIdReasonMapping } from "@lib/utils"


export default ({ open, onClose, onCancel, loading }: { 
    open: boolean, 
    onClose: () => void, 
    onCancel: (reason: string) => void, 
    loading: boolean 
}) => {
    
    const [cancellationReason, setCancellationReason] = useState('005')

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Cancel Order</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <Select options={Object.keys(cancellationIdReasonMapping).filter(e => ['005', '012'].includes(e)).map(e => ({ label: cancellationIdReasonMapping[e], value: e }))}
                    onChange={val => setCancellationReason(val)} value={cancellationReason} label="Cancellation Reason"  />
                <div className="mt-[40px] mb-[25px]">
                    <Button title="Cancel Order" variant="primary" onClick={() => onCancel(cancellationReason)} loading={loading} />
                </div>
            </div>
        </div>
    </Modal>
}   