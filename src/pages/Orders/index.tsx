import Button from "@components/Button";
import OrderList from "./OrderList";
import TopBar from "./TopBar";
import addIcon from "@assets/add.png"

import styles from './Orders.module.scss'
import { useState } from "react";
import AddOrder from "./AddOrder";

export default () => {
    const [showAddOrder, setAddOrderDisplay] = useState(false)

    return <div>
        <TopBar />
        <div className={styles.btnContainer}>
            <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" iconPosition="left" onClick={() => setAddOrderDisplay(false)} />
        </div>
        <OrderList />
        <AddOrder open={showAddOrder} onClose={() => setAddOrderDisplay(false)} />
    </div>
}       