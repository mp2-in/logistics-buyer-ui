import { useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Select from "@components/Select"

import styles from './CancelOrder.module.scss'
import Button from "@components/Button"
import { cancellationIdReasonMapping } from "@lib/utils"


export default ({ open, onClose, onCancel, loading }: { open: boolean, onClose: () => void, onCancel: (reason: string) => void, loading: boolean }) => {
    const [cancellationReason, setCancellationReason] = useState('005')

    return <Modal open={open} onClose={onClose}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <p>Cancel Order</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <Select options={Object.keys(cancellationIdReasonMapping).filter(e => ['005', '012'].includes(e)).map(e => ({ label: cancellationIdReasonMapping[e], value: e }))}
                    onChange={val => setCancellationReason(val)} value={cancellationReason} label="Cancellation Reason" size="large" />
                <Button title="Cancel Order" variant="primary" onClick={() => onCancel(cancellationReason)} loading={loading} />
            </div>
        </div>
    </Modal>
}   