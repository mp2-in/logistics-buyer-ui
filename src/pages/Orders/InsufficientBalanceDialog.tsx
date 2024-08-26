import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import addIcon from "@assets/add.png"

import Button from "@components/Button"


export default ({ open, onClose, accountId, email, phone, message }: {
    open: boolean,
    onClose: () => void
    accountId?: string
    email?: string
    phone?: string
    message: string
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Recharge Wallet</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <p>{message}</p>
                <div className="mt-[25px] mb-[15px]">
                    <a href={`https://pages.razorpay.com/mp2-wallet-recharge?phone=${phone || ''}&email=${email || ''}&mp2_accountid=${accountId}`} target='_blank'>
                        <Button title="Recharge Wallet" icon={<img src={addIcon} />} variant="primary" onClick={onClose}/>
                    </a>
                </div>
            </div>
        </div>
    </Modal>
}   