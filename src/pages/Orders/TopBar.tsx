import menuIcon from "@assets/menu.png"
import accountIcon from "@assets/account.png"

import styles from './TopBar.module.scss'

export default ({ accountId }: { accountId: string }) => {
    return <div className={styles.container}>
        <div className={styles.menuAndTitle}>
            <img src={menuIcon} />
            <p>Orders</p>
        </div>
        <div className={styles.account}>
            <img src={accountIcon} />
            <p>{accountId}</p>
        </div>
    </div>
}