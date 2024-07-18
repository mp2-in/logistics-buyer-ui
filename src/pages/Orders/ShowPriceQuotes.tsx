import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'


import { PriceQuote } from '@lib/interfaces'

import RadioBtn from "@components/RadioBtn"
import { useState } from "react"
import Button from "@components/Button"


export default ({ open, onClose, priceQuotes, createOrder, loading }: { open: boolean, onClose: () => void, priceQuotes: PriceQuote[], createOrder: (lspId: string) => void, loading: boolean }) => {
    const [chosenLsp, setChosenLsp] = useState('')

    return <Modal open={open} onClose={onClose} >
        <div className={'bg-white rounded flex flex-col items-center py-[10px] md:px-[20px] w-[350px] h-[530px] md:w-[800px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold ml-3">Price Quotes</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute top-1 right-1" />
            </div>
            <div className={'absolute top-[60px] md:left-[20px] md:right-[20px] bottom-[70px] md:text-base text-xs left-0 right-0'}>
                <div className={`flex items-center py-[10px] px-[12px] bg-gray-200 md:rounded-tl-lg md:rounded-tr-lg *:text-left *:font-semibold *:px-[10px]`}>
                    <p className="flex-[1]"></p>
                    <p className="flex-[5]">LSP</p>
                    <p className="flex-[5]">ETA</p>
                    <p className="flex-[5]">SLA</p>
                    <p className="flex-[5]">Forward</p>
                    <p className="flex-[5]">RTO</p>
                </div>
                <div className={'absolute flex top-[43px] bottom-0 left-0 right-0 flex-col overflow-auto items-center flex-grow'}>
                    {priceQuotes.map(e => {
                        return <div key={e.lsp_id} className="flex items-center w-full py-[5px] md:px-[10px] border-b md:border-l md:border-r text-xs md:text-sm relative *:text-left *:px-[10px]">
                            <div className="flex-[1]">
                                <RadioBtn checked={chosenLsp === e.lsp_id} onClick={() => setChosenLsp(e.lsp_id)} />
                            </div>
                            <p className="flex-[5]">{e.logistics_seller}</p>
                            <p className="flex-[5]">{e.pickup_eta} min</p>
                            <p className="flex-[5]">{e.sla} min</p>
                            <p className="flex-[5]">{e.price_forward ? `₹ ${e.price_forward.toFixed(2)}` : 0}</p>
                            <p className="flex-[5]">{e.price_rto ? `₹ ${e.price_rto.toFixed(2)}` : 0}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className={'absolute bottom-3'}>
                <Button title="Place Order" variant='primary' disabled={!chosenLsp} onClick={() => createOrder(chosenLsp)} loading={loading} />
            </div>
        </div>
    </Modal>
}