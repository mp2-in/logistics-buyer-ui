import cn from 'classnames'
import styles from './Select.module.scss'
import React, { useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import downLogo from '@assets/select_down.png'
import close from '@assets/close.png'

interface Props<T> {
    label?: string,
    value?: T,
    onChange?: (a: T) => void,
    size?: "xs" | "small" | "medium" | "large" | "extraLarge"
    required?: boolean,
    readonly?: boolean,
    options?: { label: string, value: T }[]
    hideSearch?: boolean,
    defaultLabel?: string
}

export default <T extends unknown>({ label, value, onChange, size, options, required, readonly, hideSearch, defaultLabel='--Select--' }: Props<T>) => {
    const [optionDisplay, setOptionDisplay] = useState(false);
    let selectContainerRef = React.createRef<HTMLInputElement>();

    const handleClickOutside = (event: MouseEvent) => {
        if (
            selectContainerRef.current &&
            !selectContainerRef.current.contains(event.target as Node)
        ) {
            setOptionDisplay(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    const getValueLabel = () => {
        const chosenOption = options?.find(o => o.value === value)
        if (chosenOption) {
            return chosenOption['label']
        } else {
            return defaultLabel
        }
    }

    const [searchFilter, setSearchFilter] = useState('')

    return <div className={cn({ [styles['outer-container']]: true, [styles['no-label']]: !label })}>
        <div className={cn({ [styles['container']]: true, [styles['xs']]: size === 'xs', [styles['small']]: size === 'small', [styles['large']]: size === 'large', [styles['extra-large']]: size === 'extraLarge', [styles['readonly']]: readonly })} >
            <div onClick={() => !readonly && options?.length ? setOptionDisplay(true) : null} className={styles['value']}>
                <p className={styles['value']}>{getValueLabel()}</p>
                <img src={downLogo} style={{
                    width: '20px',
                }} />
            </div>
            {label ? <p className={cn({ [styles['label']]: true, [styles['required']]: required, [styles['focus']]: optionDisplay })}>{label}</p> : null}
            {!readonly && optionDisplay && options?.length ? <CSSTransition
                in={optionDisplay}
                nodeRef={selectContainerRef}
                timeout={30}
                classNames={{
                    enterActive: styles['option-enter-active'],
                    enterDone: styles['option-enter-done'],
                    exitActive: styles['option-exit-active'],
                    exitDone: styles['option-exit-done']
                }}
                unmountOnExit
            >
                <div ref={selectContainerRef} className={styles['options']}>
                    {options.length >= 6 && !hideSearch ?
                        <div className={styles['input-search']}>
                            <input placeholder='Search' value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
                            <img src={close} onClick={() => setSearchFilter('')} />
                        </div> : null}
                    {options?.filter(e => !searchFilter || e.label.toUpperCase().replace(/\s|_/g, "").indexOf(searchFilter.toUpperCase().replace(/\s|_/g, "")) > -1).map(eachOption => {
                        return <div onClick={() => {
                            setSearchFilter('')
                            if (onChange) {
                                onChange(eachOption.value)
                            }
                            setOptionDisplay(false)
                        }} className={cn({ [styles['option']]: true, [styles['selected']]: value === eachOption.value })} key={eachOption.label}>
                            <p>{eachOption.label}</p>
                        </div>
                    })}
                </div>
            </CSSTransition> : null}
        </div>
    </div>
}
