import { useEffect, useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Select from "@components/Select"

import styles from './CancelOrder.module.scss'
import Button from "@components/Button"


export default ({ open, onClose, onCancel, loading}: { open: boolean, onClose: () => void, onCancel: (reason: string) => void, loading: boolean}) => {
    const [cancellationReason, setCancellationReason] = useState('')

    useEffect(() => {
        setCancellationReason('')
    }, [open])

    return <Modal open={open} onClose={onClose}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <p>Cancel Order</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <Select options={[{label: 'One or more items in the Order not available', value: '002'}, {label: 'Merchant rejected the order', value: '005'},
                    {label: 'Order not shipped as per buyer app SLA', value: '006'}, {label: 'Buyer wants to modify details', value: '010'}, {label: 'Buyer does not want product any more', value: '012'},
                ]} onChange={val => setCancellationReason(val)} value={cancellationReason} label="Cancellation Reason" size="large"/>
                <Button title="Cancel Order" variant="primary" onClick={() => onCancel(cancellationReason)} loading={loading}/>
            </div>
        </div>
    </Modal>
}   