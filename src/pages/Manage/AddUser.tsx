import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"
import Button from "@components/Button"
import { useEffect, useState } from "react"


export default ({ open, onClose, addUser, loading }: {
    open: boolean,
    onClose: () => void,
    addUser: (userName: string, phoneNumber: string, emailId: string | undefined) => void
    loading: boolean
}) => {
    const [userName, setUserName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState<string | undefined>(undefined)

    useEffect(() => {
        setUserName('')
        setPhoneNumber('')
        setEmail(undefined)
    }, [open])

    return <Modal open={open} onClose={onClose}>
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5  w-[370px] h-[280px] relative md:w-[580px] md:h-[330px]`} onMouseDown={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-3`}>
                <p className="text-xl font-semibold">Add User</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute right-1 top-1" />
            </div>
            <div className="*:my-2 flex flex-col items-center">
                <Input label={'User Name'} value={userName|| ''} onChange={val => /^[a-z0-9]*$/i.test(val) && setUserName(val)} required />
                <Input label={'Phone Number'} value={phoneNumber|| ''} onChange={val => /^[0-9]{0,10}$/i.test(val) && setPhoneNumber(val)} required type="number"/>
                <Input label={'Email'} value={email|| ''} onChange={val => /^[a-z0-9@.]*$/i.test(val) && setEmail(val)} />
                <div className="flex justify-center pt-4 ">
                    <Button title="Add User" onClick={() => addUser(userName, phoneNumber, email)}
                        variant="primary" disabled={!userName || !phoneNumber || phoneNumber.length < 10 || (!!email && !/^\S+@\S+\.\S+$/.test(email))} loading={loading} />
                </div>
            </div>
        </div>
    </Modal>
}