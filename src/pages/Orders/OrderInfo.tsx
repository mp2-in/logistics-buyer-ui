import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import { Order } from "@lib/interfaces"


const ShowValue = ({ label, value }: { label: string, value: string | number | undefined }) => {
    return <div>
        <p>{label}</p>
        <p>{value}</p>
    </div>
}

export default ({ open, onClose, orderInfo }: { open: boolean, onClose: () => void, orderInfo: Order | undefined }) => {
    return <Modal open={open} onClose={onClose}>
        <div className={'h-[700px] w-[800px] bg-white p-3 rounded-md'} onClick={e => e.stopPropagation()}>
            <div className={'flex justify-between'}>
                <p className="font-semibold text-lg">Cancel Order</p>
                <img src={closeIcon} onClick={onClose} className={'w-6 h-6'} />
            </div>
            <ShowValue label="ID" value={orderInfo?.id}/>
            <ShowValue label="LSP" value={orderInfo?.lsp.name}/>
            <ShowValue label="ID" value={orderInfo?.id}/>
            <ShowValue label="ID" value={orderInfo?.id}/>
            <ShowValue label="ID" value={orderInfo?.id}/>
        </div>
    </Modal>
}   