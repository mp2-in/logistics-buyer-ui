import { useEffect, createRef, useState } from "react"

interface Props {
    label?: string,
    type?: string,
    value?: string | number,
    onChange?: (a: string) => void,
    onSelect?: (label: string, value: string) => void,
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

const Input = ({ label, type, value, onChange, size, placeholder, readOnly, onBlur, required, validation, max, onChangeCallback, autoCompleteOptions, error, minDate, maxDate, onSelect }: Props) => {

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

    return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[30px] md:h-[46px]' : 'md:h-[35px]'}`}>
        <div className={`flex flex-col border border-gray-300 rounded relative h-[35px] justify-center py-0 px-[8px] bg-white group focus-within:border-blue-500
                                    ${size === 'small' ? `w-[150px] md:w-[196px]` : size === 'medium' || !size ? 'w-[300px] md:w-[400px]' : size === 'large' ? 'w-[500px]' : 'w-[620px]'} ${readOnly ? 'opacity-60' : ''}`}>
            <input className={`outline-none border-none font-sans text-sm bg-white`}
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
            {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-blue-950 ${required ? "after:content-['*'] after:leading-3  after:font-bold after:text-sm after:ml-1" : ''} ${error ? `text-red-600` : ''} `}>{label}</p> : null}
            {showOptions && autoCompleteOptions && autoCompleteOptions.length > 0 ?
                <div ref={selectContainerRef} className={`absolute border border-gray-300 top-[34px] left-0 z-10 rounded overflow-auto bg-white max-h-[160px] 
                ${size === 'small' ? `w-[196px]` : size === 'medium' || !size ? 'w-[400px]' : size === 'large' ? 'w-[500px]' : 'w-[620px]'}`}>
                    {autoCompleteOptions.map(eachOption => <p className="hover:bg-gray-300 cursor-pointer px-2 py-1" onClick={() => {
                        if (onSelect) {
                            onSelect(eachOption.label, eachOption.value)
                        }
                        optionsDisplay(false)
                    }}>{eachOption.label}</p>)}
                </div> : null}
        </div>
    </div>
}

export default Input;