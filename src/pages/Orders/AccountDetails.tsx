import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Button from "@components/Button"
import accountIcon from "@assets/account.png"
import Input from "@components/Input"
import { useState } from "react"


export default ({ open, onClose, onLogout, accountId }: {
    open: boolean, 
    onClose: () => void, 
    onLogout: () => void, accountId: string
}) => {

    const [rechargeAmount, setRechargeAmount] = useState('')

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded flex flex-col items-center p-5 w-[300px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1" />
            </div>
            <div className={'w-full flex flex-col items-center'}>
                <div className="flex items-center mb-8">
                    <img src={accountIcon} className="w-14 mr-4" />
                    <p>{accountId}</p>
                </div>
                <div className="flex flex-col items-center *:mb-5">
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
                </div>
                <div className="flex justify-end w-full mt-8">
                    <Button title="Logout" onClick={onLogout} variant="secondary" />
                </div>
            </div>
        </div>
    </Modal>
}