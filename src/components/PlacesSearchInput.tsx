import { useEffect, createRef, useState } from "react"
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group';
import locPin from '@assets/loc_pin.png'

import styles from './PlacesSearchInput.module.scss'

interface Props {
    label?: string,
    value?: string | number,
    onChange?: (a: string) => void,
    onSelect?: (value: string) => void,
    placeholder?: string,
    readOnly?: boolean,
    required?: boolean,
    onChangeCallback?: (a?: string | number) => void,
    autoCompleteOptions?: { label: string, value: string, offset: number }[]
}

const Input = ({ label, value, onChange, placeholder, readOnly, required, autoCompleteOptions, onSelect, onChangeCallback}: Props) => {

    let selectContainerRef = createRef<HTMLInputElement>();
    const [showOptions, optionsDisplay] = useState(false)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            selectContainerRef.current &&
            !selectContainerRef.current.contains(event.target as Node)
        ) {
            optionsDisplay(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    useEffect(() => {
        if (onChangeCallback) {
            const delayDebounceFn = setTimeout(() => {
                onChangeCallback(value)
            }, 200)

            return () => clearTimeout(delayDebounceFn)
        }
    }, [value])

    return <div className={cn({ [styles.outerContainer]: true, [styles.noLabel]: !label })}>
        <div className={cn({ [styles.container]: true, [styles.extraLarge]: true, [styles.readOnly]: readOnly })}>
                        <input className={styles.input}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            value={value}
                            onChange={e => {
                                if (onChange) {
                                    onChange(e.target.value)
                                }
                            }} onClick={() => !readOnly ? optionsDisplay(true) : null} />
            {label ? <p className={cn({ [styles.label]: true, [styles.required]: required})}>{label}</p> : null}
            {showOptions && autoCompleteOptions && autoCompleteOptions.length > 0 ?
                <CSSTransition
                    in={showOptions}
                    nodeRef={selectContainerRef}
                    timeout={30}
                    classNames={{
                        enterActive: styles.optionEnterActive,
                        enterDone: styles.optionEnterDone,
                        exitActive: styles.optionExitActive,
                        exitDone: styles.optionExitDone
                    }}
                    unmountOnExit
                >
                    <div ref={selectContainerRef} className={cn({ [styles.optionsList]: true, [styles.extraLarge]: true, [styles.readOnly]: readOnly })}>
                        {autoCompleteOptions.map(eachOption => <div onClick={() => {
                            if (onSelect) {
                                onSelect(eachOption.value)
                            }
                            optionsDisplay(false)
                        }} key={eachOption.value}>
                            <img src={locPin}/>
                            <p className="ml-1 text-gray-600 text-sm"><span className="font-bold text-black">{eachOption.label.slice(0,eachOption.offset)}</span>{eachOption.label.slice(eachOption.offset)}</p>
                        </div>)}
                    </div>
                </CSSTransition> : null}
        </div>
    </div>
}

export default Input;
