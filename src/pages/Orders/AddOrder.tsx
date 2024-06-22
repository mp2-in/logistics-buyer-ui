import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import styles from './AddOrder.module.scss'

export default ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    return <Modal open={open} onClose={onClose}>
        <div className={styles.container}>
            <div>
                <p>Add Order</p>
                <img src={closeIcon} onClick={onClose}/>
            </div>
            <div>

            </div>
        </div>
    </Modal>
}