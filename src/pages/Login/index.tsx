import { useEffect, useState, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import backIcon from "@assets/back.png"
import Input from '@components/Input'
import Button from '@components/Button'

import { useAppConfigStore } from 'stores/appConfig'

const OtpBox = ({ val }: { val: string }) => {
    return <div className='border mr-2 last:mr-0 w-10 h-10 flex items-center justify-center'>{val}</div>
}


export default () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [showPhone, setPhoneDisplay] = useState(true)
    const [errMsg, setErrMsg] = useState<string|undefined>(undefined)
    let inputRef = createRef<HTMLInputElement>();

    const { sendOtp, verifyOtp, activity, loggedIn } = useAppConfigStore(state => ({
        sendOtp: state.sendOtp,
        verifyOtp: state.verifyOtp,
        activity: state.activity,
        loggedIn: state.loggedIn
    }))
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedIn) {
            navigate('/u/orders')
        }
    }, [loggedIn])

    return <div className={'flex flex-col items-center border border-gray-200 rounded-lg my-40 mx-4 py-8 md:m-60 md:p-14 relative'}>
        <input onChange={e => {
            if(/^[0-9]{0,6}$/.test(e.target.value)) {
                setOtp(e.target.value)
            }
            setErrMsg(undefined)
        }} className='m-1 opacity-0 absolute top-1 cursor-default' value={otp} ref={inputRef} type='number'/>
        {showPhone ? null : <img src={backIcon} className='left-2 top-2 w-6 absolute' onClick={() => setPhoneDisplay(true)} />}
        {showPhone ? <div className='mt-12'>
            <Input label='Phone Number' value={phoneNumber || ''} onChange={val => {
                if (/^[0-9]{0,10}$/.test(val)) {
                    setPhoneNumber(val)
                }
                setErrMsg(undefined)
            }} />
        </div> : <div className='mt-12 flex' onClick={() => inputRef.current?.focus()}>
            <OtpBox val={otp.length > 0 ? otp[0] : ' '} />
            <OtpBox val={otp.length > 1 ? otp[1] : ' '} />
            <OtpBox val={otp.length > 2 ? otp[2] : ' '} />
            <OtpBox val={otp.length > 3 ? otp[3] : ' '} />
            <OtpBox val={otp.length > 4 ? otp[4] : ' '} />
            <OtpBox val={otp.length > 5 ? otp[5] : ' '} />
        </div>}
        <div className='mt-12'>
            <Button title={showPhone ? 'Send OTP' : 'Verify'} onClick={() => {
                if (showPhone) {
                    sendOtp(phoneNumber, (success) => {
                        if(success) {
                            setPhoneDisplay(false)
                        } else {
                            setErrMsg('Phone number is not registered')
                        }
                    })
                } else {
                    verifyOtp(phoneNumber, otp, (success) => {
                        if(success) {
                            navigate('/u/orders')
                        } else {
                            setOtp('')
                            setErrMsg('OTP is not valid !')
                        }
                    })
                }
                inputRef.current?.focus()
            }} variant='primary' disabled={(showPhone && phoneNumber.length < 10) || (!showPhone && otp.length < 6)} loading={activity.sendOtp || activity.verifyOtp}/>
        </div>
        {!showPhone ? <div className='flex flex-col items-center mt-8'>
            <p className='text-gray-500 font-semibold'>Didn't receive any code?</p>
            <p className='text-blue-500 font-semibold underline cursor-pointer mt-4' onClick={() => {
                setOtp('')
                setErrMsg(undefined)
                inputRef.current?.focus()
                sendOtp(phoneNumber, () => null)
            }}>Resend code</p>
        </div> : null}
        <div className={`${errMsg !== undefined ? 'visible' : 'invisible'} font-bold text-red-500 mt-2 text-lg`}>
            <p>{errMsg}</p>
        </div>
    </div>
}