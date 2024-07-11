import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '@components/Input'
import Button from '@components/Button'

import { useAppConfigStore } from 'stores/appConfig'


export default () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showErrMsg, errMsgDisplay] = useState(false)

    const { login, activity, loggedIn } = useAppConfigStore(state => ({ login: state.login, activity: state.activity, loggedIn: state.loggedIn }))
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedIn) {
            navigate('/u/orders')
        }
    }, [loggedIn])

    return <div className={'flex flex-col items-center border border-gray-200 rounded-lg my-44 mx-4 py-10 md:m-64 md:p-14'}>
        <Input label='Username' required value={username || ''} onChange={val => {
            setUsername(val)
            errMsgDisplay(false)
        }} />
        <div className='my-7'>
            <Input label='Password' type='password' required value={password || ''} onChange={val => {
                setPassword(val)
                errMsgDisplay(false)
            }} />
        </div>
        <div className={`${showErrMsg ? 'visible' : 'invisible'} font-bold text-red-500 mb-2 text-lg`}>
            <p>Invalid credentials !</p>
        </div>
        <Button title='Sign In' variant='primary' disabled={!username || !password} onClick={() => {
            login(username, password, () => navigate('/u/orders'), () => errMsgDisplay(true))
        }} loading={activity.login} />
    </div>
}