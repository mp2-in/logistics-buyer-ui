import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import accountIcon from "@assets/account.png"


import styles from './AccountDetails.module.scss'

export default ({ open, onClose, onLogout, accountId }: {
    open: boolean, onClose: () => void, onLogout: () => void, accountId: string
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <div>
                    <img src={accountIcon} />
                    <p>{accountId}</p>
                </div>
                <Button title="Logout" onClick={onLogout} variant="primary"/>
            </div>
        </div>
    </Modal>
}