import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Button from "@components/Button"
import Input from "./Input"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


export default ({ open, onClose, showError, orderId }: {
    open: boolean,
    onClose: () => void,
    showError?: boolean,
    orderId?: string
}) => {
    const navigate = useNavigate()
    const [mp2OrderId, setOrderId] = useState('')

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded py-[10px] px-[20px] md:w-[600px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Search Order</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'mt-1'}>
                {showError?<p className="mb-4 text-red-600">{orderId?`Order Id ${orderId} is invalid!`:`Invalid order id!`}</p>:null}
                <Input label="Order Id" value={mp2OrderId} onChange={val => setOrderId(val)}/>
                <div className="mt-[20px] mb-[15px] w-full flex justify-end">
                    <Button title="Search" variant="primary" onClick={() => {
                        onClose()
                        navigate(`/orders/${mp2OrderId}`)
                    }} disabled={!mp2OrderId} />
                </div>
            </div>
        </div>
    </Modal>
}       