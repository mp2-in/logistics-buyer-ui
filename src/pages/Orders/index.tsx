import Button from "@components/Button";
import OrderList from "./OrderList";
import TopBar from "./TopBar";
import addIcon from "@assets/add.png"

import styles from './Orders.module.scss'

export default () => {
    return <div>
        <TopBar />
        <div className={styles.btnContainer}>
            <Button title="Add Order" icon={<img src={addIcon}/>} variant="primary" iconPosition="left"/>
        </div>
        <OrderList />
    </div>
}