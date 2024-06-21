import Input from '@components/Input'
import  styles from './Login.module.scss'
import Button from '@components/Button'

export default () => {
    return <div className={styles.container}>
        <Input label='Username' required/>
        <Input label='Password' type='password' required/>
        <Button title='Sign In' variant='primary' />
    </div>
}