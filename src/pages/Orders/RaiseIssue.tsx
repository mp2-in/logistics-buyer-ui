import { useEffect, useState } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Select from "@components/Select"

import Button from "@components/Button"
import TextArea from "@components/TextArea"


export default ({ open, onClose, raiseIssue, loading }: { 
    open: boolean, 
    onClose: () => void, 
    raiseIssue: (issue: string, description: string) => void, 
    loading: boolean 
}) => {
    const issuesList = [
        "Rider ran away with the item without closing the order",
        "Food spillage",
        "Rider marked delivered but did not deliver"
    ]
    const [issue, setIssue] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        setIssue('')
        setDescription('')
    },[open])

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center py-[10px] px-[20px] md:w-[600px] w-[320px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold">Raise Issue</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'flex flex-col items-center mt-5'}>
                <Select options={issuesList.map(e => ({label:e, value: e}))}
                    onChange={val => setIssue(val)} value={issue} label="Issue" size={'large'} />
                <TextArea label="Description" value={description} onChange={val => setDescription(val)} size="large"/>
                <div className="mt-[40px] mb-[25px]">
                    <Button title="Raise Issue" variant="primary" onClick={() => raiseIssue(issue, description)} loading={loading} disabled={!issue || !description}/>
                </div>
            </div>
        </div>
    </Modal>
}   