import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'


import { PriceQuote } from '@lib/interfaces'

import styles from './ShowPriceQuotes.module.scss'
import RadioBtn from "@components/RadioBtn"
import { useState } from "react"
import Button from "@components/Button"


export default ({ open, onClose, priceQuotes, createOrder, loading }: { open: boolean, onClose: () => void, priceQuotes: PriceQuote[], createOrder: (lspId: string) => void, loading: boolean }) => {
    const [chosenLsp, setChosenLsp] = useState('')

    return <Modal open={open} onClose={onClose} >
        <div className={styles.container} onMouseDown={e => e.stopPropagation()}>
            <div className={styles.title}>
                <p>Price Quotes</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <p></p>
                    <p>LSP</p>
                    <p>ETA</p>
                    <p>SLA</p>
                    <p>Forward</p>
                    <p>RTO</p>
                </div>
                <div className={styles.body}>
                    {priceQuotes.map(e => {
                        return <div key={e.lsp_id}>
                            <RadioBtn checked={chosenLsp === e.lsp_id} onClick={() => setChosenLsp(e.lsp_id)} />
                            <p>{e.logistics_seller}</p>
                            <p>{e.pickup_eta} min</p>
                            <p>{e.sla} min</p>
                            <p>{e.price_forward ? `₹ ${e.price_forward}` : 0}</p>
                            <p>{e.price_rto ? `₹ ${e.price_rto}` : 0}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className={styles.createOrderBtn}>
                <Button title="Place Order" variant='primary' disabled={!chosenLsp} onClick={() => createOrder(chosenLsp)} loading={loading}/>
            </div>
        </div>
    </Modal>
}