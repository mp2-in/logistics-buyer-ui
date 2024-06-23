import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames'

import Input from '@components/Input'
import Button from '@components/Button'

import { useAppConfigStore } from 'stores/appConfig'

import styles from './Login.module.scss'

export default () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showErrMsg, errMsgDisplay] = useState(false)

    const { login, activity } = useAppConfigStore(state => ({ login: state.login, activity: state.activity }))
    const navigate = useNavigate()

    return <div className={styles.container}>
        <Input label='Username' required value={username || ''} onChange={val => {
            setUsername(val)
            errMsgDisplay(false)
        }} />
        <Input label='Password' type='password' required value={password || ''} onChange={val => {
            setPassword(val)
            errMsgDisplay(false)
        }} />
        <div className={cn({ [styles.errMsgContainer]: true, [styles.visible]: showErrMsg })}>
            <p>Invalid credentials !</p>
        </div>
        <Button title='Sign In' variant='primary' disabled={!username || !password} onClick={() => {
            login(username, password, () => navigate('/u/orders'), () => errMsgDisplay(true))
        }} loading={activity.login} />
    </div>
}