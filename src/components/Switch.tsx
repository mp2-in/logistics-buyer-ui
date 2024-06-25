import styles from './Switch.module.scss'
import cn from 'classnames'

export default ({ on, onClick }: { on: boolean, onClick: () => void }) => {
    return <div className={cn({ [styles['outer-container']]: true, [styles['selected']]: on })} onClick={() => onClick()}>
        <div className={styles['inner-container']} />
    </div>
}