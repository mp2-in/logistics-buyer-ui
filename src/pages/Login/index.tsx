import Input from '@components/Input'
import  styles from './Login.module.scss'
import Button from '@components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showLoading, setLoadingFlag] = useState(false)
    const navigate = useNavigate()

    return <div className={styles.container}>
        <Input label='Username' required value={username || ''} onChange={val => setUsername(val)}/>
        <Input label='Password' type='password' required value={password || ''} onChange={val => setPassword(val)}/>
        <Button title='Sign In' variant='primary' disabled={!username || !password} onClick={() => {
            setLoadingFlag(true)
            setTimeout(() => {
                setLoadingFlag(false)
                navigate('/orders')
            }, 2000)
        }} loading={showLoading}/>
    </div>
}