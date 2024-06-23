import Button from "@components/Button";
import OrderList from "./OrderList";
import TopBar from "./TopBar";
import addIcon from "@assets/add.png"

import styles from './Orders.module.scss'
import { useState } from "react";
import AddOrder from "./AddOrder";
import { useAppConfigStore } from "stores/appConfig";

export default () => {
    const [showAddOrder, setAddOrderDisplay] = useState(false)
    const { token, accountId } = useAppConfigStore(state => ({ token: state.token, accountId: state.accountId }))


    return <div>
        <TopBar accountId={accountId || ''}/>
        <div className={styles.btnContainer}>
            <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" iconPosition="left" onClick={() => setAddOrderDisplay(false)} />
        </div>
        <OrderList token={token || ''} />
        <AddOrder open={showAddOrder} onClose={() => setAddOrderDisplay(false)} />
    </div>
}       