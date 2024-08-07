import { useEffect, useState, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import backIcon from "@assets/back.png"
import Input from '@components/Input'
import Button from '@components/Button'

import { useAppConfigStore } from 'stores/appConfig'

const OtpBox = ({ val, hightlight }: { val: string, hightlight?: boolean }) => {
    return <div className={`border mr-2 last:mr-0 w-10 h-10 flex items-center justify-center ${hightlight ? 'border-blue-500 border-2' : ''}`}>{val}</div>
}


export default () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [showPhone, setPhoneDisplay] = useState(true)
    const [errMsg, setErrMsg] = useState<string | undefined>(undefined)
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

    useEffect(() => {
        inputRef.current?.focus()
    }, [showPhone])

    return <div className='fixed left-0 right-0 top-0 bottom-0 border flex justify-center items-center' onClick={() => !showPhone && inputRef.current?.focus()}>
        <div className={'flex flex-col items-center border border-gray-200 rounded-lg relative lg:w-[900px] w-[380px] mb-[300px] py-[40px]'}>
            <input onChange={e => {
                if (/^[0-9]{0,6}$/.test(e.target.value)) {
                    setOtp(e.target.value)
                }
                setErrMsg(undefined)
            }} className='m-1 opacity-0 absolute top-1 cursor-default' value={otp} ref={inputRef} type='number' />
            {showPhone ? null : <img src={backIcon} className='left-2 top-2 w-6 absolute' onClick={() => setPhoneDisplay(true)} />}
            {showPhone ? <div className='mt-12' onClick={e => e.stopPropagation()}>
                <Input label='Phone Number' value={phoneNumber || ''} onChange={val => {
                    if (/^[0-9]{0,10}$/.test(val)) {
                        setPhoneNumber(val)
                    }
                    setErrMsg(undefined)
                }} />
            </div> : <div className='mt-12 flex' onClick={() => inputRef.current?.focus()}>
                <OtpBox val={otp.length > 0 ? otp[0] : ' '} hightlight={otp.length === 0} />
                <OtpBox val={otp.length > 1 ? otp[1] : ' '} hightlight={otp.length === 1} />
                <OtpBox val={otp.length > 2 ? otp[2] : ' '} hightlight={otp.length === 2} />
                <OtpBox val={otp.length > 3 ? otp[3] : ' '} hightlight={otp.length === 3} />
                <OtpBox val={otp.length > 4 ? otp[4] : ' '} hightlight={otp.length === 4} />
                <OtpBox val={otp.length > 5 ? otp[5] : ' '} hightlight={otp.length === 5} />
            </div>}
            <div className='mt-12'>
                <Button title={showPhone ? 'Send OTP' : 'Verify'} onClick={() => {
                    if (showPhone) {
                        sendOtp(phoneNumber, (success) => {
                            if (success) {
                                setPhoneDisplay(false)
                            } else {
                                setErrMsg('Phone number is not registered')
                            }
                        })
                    } else {
                        verifyOtp(phoneNumber, otp, (success) => {
                            if (success) {
                                navigate('/u/orders')
                            } else {
                                setOtp('')
                                setErrMsg('OTP is not valid !')
                            }
                        })
                    }
                    inputRef.current?.focus()
                }} variant='primary' disabled={(showPhone && phoneNumber.length < 10) || (!showPhone && otp.length < 6)} loading={activity.sendOtp || activity.verifyOtp} />
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
    </div>
}