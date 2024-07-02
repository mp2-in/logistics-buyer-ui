import styles from './RadioBtn.module.scss'
import cn from 'classnames'

export default ({ checked, onClick, label }: { checked: boolean, onClick: () => void, label?: string }) => {
    return <div className={styles['container']} onClick={onClick}>
        <div className={cn({ [styles['inner-container']]: true, [styles['checked']]: checked  })}>
            <div />
        </div>
        {label ? <p>{label}</p> : null}
    </div>
}