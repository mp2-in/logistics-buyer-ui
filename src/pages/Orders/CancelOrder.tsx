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
                <Select options={[{label: 'Order / fulfillment not ready for pickup', value: '008'}, {label: 'Buyer not found or cannot be contacted', value: '011'},
                    {label: 'Buyer refused to accept delivery', value: '013'}, {label: 'Address not found', value: '014'}, {label: 'Buyer not available at location', value: '015'},
                    {label: 'Accident / rain / strike / vehicle issues', value: '016'}, {label: 'Order delivery delayed or not possible', value: '017'},
                    {label: 'Delivery delayed or not possible', value: '018'}
                ]} onChange={val => setCancellationReason(val)} value={cancellationReason} label="Cancellation Reason" size="large"/>
                <Button title="Cancel Order" variant="primary" onClick={() => onCancel(cancellationReason)} loading={loading}/>
            </div>
        </div>
    </Modal>
}   