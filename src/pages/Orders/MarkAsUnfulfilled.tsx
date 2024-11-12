import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import Select from "@components/Select"
import { useState } from "react"


export default ({ open, onClose, markAsUnfulfilled, loading, accountId }: {
    open: boolean,
    onClose: () => void,
    markAsUnfulfilled: (reasonCode: string) => void,
    loading: boolean
    accountId: string
}) => {

    const [reason, setReason] = useState('')

    const reasons = [
        { label: "Order / fulfillment not ready for pickup", value: "008", accountId: 'any' },
        { label: "Rider not moving", value: "006", accountId: 'any' },
        { label: "More Retail - Another rider picked up item already", value: "005", accountId: 'moreretail' }
    ]


    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Mark as Unfulfilled</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <Select options={reasons.filter(e => e.accountId === 'any' || e.accountId === accountId)}
                    onChange={val => setReason(val)} value={reason} label="Reason" hideSearch />
                <div className="mt-[40px] mb-[25px]">
                    <Button title="Mark as Unfulfilled" variant="primary" onClick={() => markAsUnfulfilled(reason)} loading={loading} disabled={!reason}/>
                </div>
            </div>
        </div>
    </Modal>
}   