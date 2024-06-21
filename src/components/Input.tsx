import { useEffect, createRef, useState } from "react"
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group';
import styles from './Input.module.scss'

interface Props {
    label?: string,
    type?: string,
    value?: string | number,
    onChange?: (a: string) => void,
    size?: "small" | "medium" | "large" | "extraLarge"
    placeholder?: string,
    readOnly?: boolean,
    required?: boolean,
    onBlur?: () => void,
    validation?: RegExp,
    max?: number,
    minDate?: string,
    maxDate?: string,
    onChangeCallback?: (a?: string | number) => void,
    autoCompleteOptions?: { label: string, value: string }[]
    error?: boolean
}

const Input = ({ label, type, value, onChange, size, placeholder, readOnly, onBlur, required, validation, max, onChangeCallback, autoCompleteOptions, error, minDate, maxDate}: Props) => {

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
            }, 1000)

            return () => clearTimeout(delayDebounceFn)
        }
    }, [value])


    const getType = () => {
        if (type) {
            if (type === 'date' && readOnly) {
                return 'text'
            } else {
                return type
            }
        } else {
            return 'text'
        }
    }

    return <div className={cn({ [styles.outerContainer]: true, [styles.noLabel]: !label })}>
        <div className={cn({ [styles.container]: true, [styles.small]: size === 'small', [styles.large]: size === 'large', [styles.extraLarge]: size === 'extraLarge', [styles.readOnly]: readOnly })}>
                        <input className={styles.input}
                            placeholder={placeholder}
                            type={getType()}
                            readOnly={readOnly}
                            onBlur={() => onBlur && onBlur()}
                            min={minDate}
                            max={maxDate}
                            value={value}
                            onChange={e => {
                                if (onChange && (!validation || (validation && validation.test(e.target.value)) || !e.target.value) && (!max || (max && parseInt(e.target.value) <= max) || !e.target.value)) {
                                    onChange(e.target.value)
                                }
                            }} onClick={() => !readOnly ? optionsDisplay(true) : null} />
            {label ? <p className={cn({ [styles.label]: true, [styles.required]: required, [styles.error]: error })}>{label}</p> : null}
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
                    <div ref={selectContainerRef} className={cn({ [styles.optionsList]: true, [styles.large]: size === 'large', [styles.extraLarge]: size === 'extraLarge', [styles.readOnly]: readOnly })}>
                        {autoCompleteOptions.map(eachOption => <p onClick={() => {
                            if (onChange) {
                                onChange(eachOption.value)
                            }
                            optionsDisplay(false)
                        }}>{eachOption.label}</p>)}
                    </div>
                </CSSTransition> : null}
        </div>
    </div>
}

export default Input;
