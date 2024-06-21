import moreIcon from '@assets/more.png'

import styles from './OrderList.module.scss'


export default () => {
    return <div className={styles.container}>
        <div className={styles.header}>
            <p>Date</p>
            <p>Order Id</p>
            <p>Customer</p>
            <p>Address</p>
            <p>Amount</p>
            <p>Items</p>
            <p></p>
        </div>
        <div className={styles.body}>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
            <div>
                <p>5th June, 04:15 pm</p>
                <p>6128613</p>
                <p>Jonathon Carroll</p>
                <p>31586 Brain Manor North Ian, WA 62944-0907</p>
                <p>4900</p>
                <p>2</p>
                <div>
                    <img src={moreIcon} />
                </div>
            </div>
        </div>
        <p>{import.meta.env.VITE_PLACES_KEY}</p>
    </div>
}