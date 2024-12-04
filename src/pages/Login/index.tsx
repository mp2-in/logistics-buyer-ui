import { useEffect, useState, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import backIcon from "@assets/back.png"
import Input from '@components/Input'
import Button from '@components/Button'
import { GoogleLogin, } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from "jwt-decode";

import { useAppConfigStore } from 'stores/appConfig'

interface IJwtPayload extends JwtPayload {
    email: string;
}


interface iCredentialRequestOptions extends CredentialRequestOptions {
    otp: { transport: string[] }
}

interface iCredential extends Credential {
    code?: string
}


const OtpBox = ({ val, hightlight }: { val: string, hightlight?: boolean }) => {
    return <div className={`border mr-2 last:mr-0 w-10 h-10 flex items-center justify-center ${hightlight ? 'border-blue-500 border-2' : ''}`}>{val}</div>
}


export default () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [showPhone, setPhoneDisplay] = useState(true)
    const [errMsg, setErrMsg] = useState<string | undefined>(undefined)
    let inputRef = createRef<HTMLInputElement>();

    const { sendOtp, verifyOtp, activity, loggedIn, verifyGmail, redirectPath } = useAppConfigStore(state => ({
        sendOtp: state.sendOtp,
        verifyOtp: state.verifyOtp,
        activity: state.activity,
        loggedIn: state.loggedIn,
        verifyGmail: state.verifyGmail,
        redirectPath: state.redirectPath
    }))

    const navigate = useNavigate()

    useEffect(() => {
        if (loggedIn) {
            navigate(redirectPath)
        }
    }, [loggedIn])

    const getPassCode = async () => {
        const ac = new AbortController()
        let o: iCredentialRequestOptions = {
            otp: { transport: ['sms'] },
            signal: ac.signal
        }

        const pass: iCredential | null = await navigator.credentials.get(o)
        setOtp(pass?.code || '')
    }

    useEffect(() => {
        inputRef.current?.focus()
        setOtp('')
        if (!showPhone) {
            if ("OTPCredential" in window) {
                getPassCode()
            }
        }
    }, [showPhone])

    return <div className='fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center' onClick={() => !showPhone && inputRef.current?.focus()}>
        <div className={'flex flex-col items-center border border-gray-200 rounded-lg relative lg:w-[900px] w-[350px] sm:w-[450px] md:w-[550px] mb-[100px] py-[40px] sm:mb-[150px] md:mb-[230px] lg:mb-[300px]'}>
            <input onChange={e => {
                if (/^[0-9]{0,6}$/.test(e.target.value)) {
                    setOtp(e.target.value)
                }
                setErrMsg(undefined)
            }} className='m-1 opacity-0 absolute top-1 cursor-default' value={otp} ref={inputRef} type='number' />
            {showPhone ? null : <img src={backIcon} className='left-2 top-2 w-6 absolute' onClick={() => {
                setPhoneDisplay(true)
                setErrMsg(undefined)
            }} />}
            {showPhone ? <div className='mt-12' onClick={e => e.stopPropagation()}>
                <Input label='Phone Number' value={phoneNumber || ''} onChange={val => {
                    if (/^[0-9]{0,10}$/.test(val)) {
                        setPhoneNumber(val)
                    }
                    setErrMsg(undefined)
                }} type='number'/>
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
                        sendOtp(phoneNumber, (success, message) => {
                            if (success) {
                                setPhoneDisplay(false)
                            } else {
                                setErrMsg(message)
                            }
                        })
                    } else {
                        verifyOtp(phoneNumber, otp, (success, message) => {
                            if (success) {
                                navigate(redirectPath)
                            } else {
                                setOtp('')
                                setErrMsg(message)
                            }
                        })
                    }
                    inputRef.current?.focus()
                }} variant='primary' disabled={(showPhone && phoneNumber.length < 10) || (!showPhone && otp.length < 6)} loading={activity.sendOtp || activity.verifyOtp} />
            </div>
            <div className={`${errMsg !== undefined ? 'visible' : 'invisible'} font-medium text-red-500 mt-2 text-base h-[40px]`}>
                <p>{errMsg}</p>
            </div>
            {showPhone ? <div className='mt-10'><GoogleLogin
                onSuccess={credentialResponse => {
                    const decoded = jwtDecode(credentialResponse.credential || '') as IJwtPayload;
                    verifyGmail(decoded.email || '', decoded.jti || '', (success, message) => {
                        if (success) {
                            navigate(redirectPath)
                        } else {
                            setErrMsg(message)
                        }
                    });
                }}
                onError={() => {
                    setErrMsg('Login Failed')
                }}
            /></div> : <div className='flex flex-col items-center mt-8'>
                <p className='text-gray-500 font-medium'>Didn't receive any code?</p>
                <p className='text-blue-500 font-medium underline cursor-pointer mt-4' onClick={() => {
                    setOtp('')
                    setErrMsg(undefined)
                    inputRef.current?.focus()
                    sendOtp(phoneNumber, () => null)
                }}>Resend code</p>
            </div>}
        </div>
    </div>
}