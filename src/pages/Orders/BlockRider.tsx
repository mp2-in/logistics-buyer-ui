import { useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import TextArea from "@components/TextArea"


export default ({ open, onClose, blockRider, loading, riderName, riderNumber, lsp }: {
    open: boolean,
    onClose: () => void,
    blockRider: (comment: string) => void
    loading: boolean
    riderName: string
    riderNumber: string
    lsp: string
}) => {

    const [comment, setComment] = useState('')

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Block Rider</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <div className="w-full px-3 py-1 *:m-1 mb-3">
                    <p className="font-medium text-gray-500">Rider Name: <span className="font-semibold text-black">{riderName}</span></p>
                    <p className="font-medium text-gray-500">Rider Phone: <span className="font-semibold text-black">{riderNumber}</span></p>
                    <p className="font-medium text-gray-500">LSP: <span className="font-semibold text-black">{lsp}</span></p>
                </div>
                <TextArea label="Comments" value={comment} onChange={val => setComment(val)} />
                <div className="mt-[40px] mb-[25px]">
                    <Button title="Block Rider" variant="primary" onClick={() => blockRider(comment)} loading={loading} disabled={!comment}/>
                </div>
            </div>
        </div>
    </Modal>
}   