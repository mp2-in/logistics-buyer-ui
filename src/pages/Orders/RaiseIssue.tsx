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
    raiseIssue: (issue: string, description: string, refundAmount: number | undefined, url: string | undefined) => void,
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
        "Marked delivered without picking up items",
        "Physically Delivered but not marked delivered in app",
        "Fake pickup",
        "Rude agent"
    ]
    const [issue, setIssue] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
    const [refundAmount, setRefundAmount] = useState<number | undefined>(undefined)

    useEffect(() => {
        setIssue('')
        setDescription('')
        setImageUrl(undefined)
        setRefundAmount(undefined)
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
            case "Physically Delivered but not marked delivered in app":
                return ["Order-picked-up", "At-delivery"].includes(orderStatus)
            case "Fake pickup":
                return ["Order-picked-up", "Out-for-delivery", "At-delivery"].includes(orderStatus)
            case "Rude agent":
                return ["Agent-assigned", "At-pickup", "Order-picked-up", "Out-for-delivery", "At-delivery", "Order-delivered", "Cancelled", "RTO-Initiated", "RTO-Disposed", "RTO-Delivered"].includes(orderStatus)
        }
    }

    // const getRefundAmount = (reason: string) => {
    //     if (['Delay in delivery', "Rider ran away with the item", "Food spillage", "MDND - Marked delivered without delivering"].includes(reason)) {
    //         return orderAmount + deliveryFee
    //     } else {
    //         return deliveryFee
    //     }
    // }

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[460px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Raise Issue</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'flex flex-col items-start mt-3 *:my-2 w-full px-2'}>
                <Select options={issuesList.filter(filterIssueReasons).map(e => ({ label: e, value: e }))}
                    onChange={val => {
                        setIssue(val)
                        //setRefundAmount(getRefundAmount(val))
                    }} value={issue} label="Issue" />
                <TextArea label="Description" value={description} onChange={val => setDescription(val)} />
                <div className="w-full flex flex-col items-start text-sm *:my-2">
                    <p className="bg-gray-200 px-2 py-1 mb-1 rounded-md">Order Amount: <span className="font-bold">₹ {orderAmount}</span></p>
                    <p className="bg-gray-200 px-2 py-1 rounded-md">Delivery Fee: <span className="font-bold">₹ {deliveryFee}</span></p>
                    <Input label="Refund Amount" type='number' value={refundAmount} onChange={val => /^[0-9.]*$/.test(val) && setRefundAmount(parseFloat(val))} size='small' />
                    <Input label="File URL" value={imageUrl} onChange={val => setImageUrl(val)} />
                </div>
                <div className="py-3 flex justify-center w-full items-center">
                    <Button title="Raise Issue" variant="primary" onClick={() => raiseIssue(issue, description, refundAmount, imageUrl)} loading={loading} disabled={!issue || !description} />
                </div>
            </div>
        </div>
    </Modal>
}   