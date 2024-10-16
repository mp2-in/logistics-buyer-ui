import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import checkIcon from "@assets/check.png"
import phoneIcon from "@assets/phone.png"
import emailIcon from "@assets/email.png"


export default ({ open, onClose, onLogout, selectedAccount, accountIds, phoneNumber, switchAccount, email }: {
    open: boolean,
    onClose: () => void,
    onLogout: () => void,
    selectedAccount: string,
    accountIds: string[],
    phoneNumber?: string
    email?: string
    switchAccount: (accountId: string) => void
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center p-5 w-[350px] relative md:w-[400px]'} onMouseDown={e => e.stopPropagation()}>
            <div>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'w-full flex flex-col items-center h-[400px] relative'}>
                <div className="flex flex-col py-2">
                    <div className="flex">
                        <img src={phoneIcon} alt="Phone" className="w-6 mr-2" />
                        <p className="font-medium">{phoneNumber}</p>
                    </div>
                    <div className="flex mt-2">
                        <img src={emailIcon} alt="Email" className="w-6 mr-2" />
                        <p className="font-medium">{email}</p>
                    </div>
                </div>
                <div className="mt-6 overflow-auto absolute top-14 bottom-12 flex flex-col items-start">
                    <p className="font-medium mb-2">Accounts</p>
                    {accountIds.map(eachAccount => {
                        return <div className="flex flex-row h-8 w-[320px] items-center hover:bg-slate-200" key={eachAccount} onClick={() => {
                            if (selectedAccount !== eachAccount) {
                                switchAccount(eachAccount)
                            }
                        }}>
                            <div className="flex-[2] flex justify-center">
                                {selectedAccount === eachAccount ? <img src={checkIcon} className="w-6" /> : <span />}
                            </div>
                            <p className={`flex-[10] font-normal ${selectedAccount === eachAccount ? 'cursor-default' : 'cursor-pointer'}`}>{eachAccount}</p>
                        </div>
                    })}
                </div>
                <div className="absolute bottom-1 right-1">
                    <Button title="Logout" onClick={onLogout} variant="secondary" />
                </div>
            </div>
        </div>
    </Modal>
}