import { useEffect, useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Select from "@components/Select"

import Button from "@components/Button"
import TextArea from "@components/TextArea"
import Input from "@components/Input"


export default ({ open, onClose, raiseIssue, loading, orderStatus, orderAmount, deliveryFee }: {
    open: boolean,
    onClose: () => void,
    raiseIssue: (issue: string, description: string, refundAmount: number | undefined) => void,
    loading: boolean
    orderStatus: string
    orderAmount: number
    deliveryFee: number
}) => {
    const issuesList = [
        "Delay in delivery",
        "Rider ran away with the item",
        "Food spillage",
        "MDND - Marked delivered without delivering",
        "Delay in pickup",
        "Marked delivered without picking up items"
    ]
    const [issue, setIssue] = useState('')
    const [description, setDescription] = useState('')
    const [refundAmount, setRefundAmount] = useState<number | undefined>(undefined)

    useEffect(() => {
        setIssue('')
        setDescription('')
    }, [open])

    const filterIssueReasons = (reason: string) => {
        switch (reason) {
            case "Delay in delivery":
                return !['Order-delivered', 'Cancelled', 'RTO-Initiated', 'RTO-Disposed', 'RTO-Delivered'].includes(orderStatus)
            case "Rider ran away with the item":
                return orderStatus !== 'Order-delivered'
            case "Food spillage":
                return orderStatus === 'Order-delivered'
            case "MDND - Marked delivered without delivering":
                return orderStatus === 'Order-delivered'
            case "Marked delivered without picking up items":
                return orderStatus === 'Order-delivered'
            case "Delay in pickup":
                return ['Created', 'UnFulfilled', 'Pending', 'Searching-for-Agent', 'Agent-assigned'].includes(orderStatus)
        }
    }

    const getRefundAmount = (reason: string) => {
        if (['Delay in delivery', "Rider ran away with the item", "Food spillage", "MDND - Marked delivered without delivering"].includes(reason)) {
            return orderAmount + deliveryFee
        } else {
            return deliveryFee
        }
    }

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Raise Issue</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'flex flex-col items-center mt-3 *:my-2'}>
                <Select options={issuesList.filter(filterIssueReasons).map(e => ({ label: e, value: e }))}
                    onChange={val => {
                        setIssue(val)
                        setRefundAmount(getRefundAmount(val))
                    }} value={issue} label="Issue" size={'large'} />
                <div>
                    <TextArea label="Description" value={description} onChange={val => setDescription(val)} size="large" />
                </div>
                <div className="w-full">
                    <Input label="Refund Amount" type='number' value={refundAmount} onChange={val => /^[0-9.]*$/.test(val) && setRefundAmount(parseFloat(val))} size='small' />
                </div>
                <div className="py-3">
                    <Button title="Raise Issue" variant="primary" onClick={() => raiseIssue(issue, description, refundAmount)} loading={loading} disabled={!issue || !description} />
                </div>
            </div>
        </div>
    </Modal>
}   