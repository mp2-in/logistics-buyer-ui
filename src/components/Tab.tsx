import cn from 'classnames';
import styles from './Tab.module.scss';

export default ({ options, selected, onSelect }: { options: string[], selected: string, onSelect: (option: string) => void}) => {
    return <div className={styles['container']}>
        {options.map(eachOption => {
            return <div className={cn({ [styles['selected']]: selected === eachOption, [styles['option']]: true })} onClick={() => onSelect(eachOption)} key={eachOption}>
                <p>{eachOption}</p>
            </div>
        })}
    </div>
}
