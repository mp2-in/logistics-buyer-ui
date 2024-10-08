import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import checkIcon from "@assets/check.png"
import phoneIcon from "@assets/phone.png"
import emailIcon from "@assets/email.png"
// import Input from "@components/Input"


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

    // const [rechargeAmount, setRechargeAmount] = useState('')

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
                {/* <div className="flex flex-col items-center *:mb-5">
                    <Input label='Recharge Amount' type={'number'} size="small" value={rechargeAmount} onChange={val => /^[0-9]*$/.test(val) && setRechargeAmount(val)}/>
                    <Button title="Recharge" variant="primary" onClick={() => {
                        var options = {
                            "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
                            "amount": rechargeAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "MP2 Innovations", //your business name
                            "description": "Wallet Recharge",
                            "image": "https://example.com/your_logo",
                            "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
                            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                                "name": "Gaurav Kumar", //your customer's name
                                "email": "gaurav.kumar@example.com",
                                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
                            },
                            "notes": {
                                "address": "Razorpay Corporate Office"
                            },
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = (window as any).Razorpay(options);
                        rzp1.open();
                    }} disabled={!rechargeAmount}/>
                </div> */}
                <div className="absolute bottom-1 right-1">
                    <Button title="Logout" onClick={onLogout} variant="secondary" />
                </div>
            </div>
        </div>
    </Modal>
}