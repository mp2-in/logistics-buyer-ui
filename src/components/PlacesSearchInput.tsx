import { useEffect, createRef, useState } from "react"
import locPin from '@assets/loc_pin.png'

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

const Input = ({ label, value, onChange, placeholder, readOnly, required, autoCompleteOptions, onSelect, onChangeCallback }: Props) => {

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

    return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[30px] md:h-[46px]' : 'md:h-[35px]'}`}>
        <div className={`flex flex-col border border-gray-300 rounded relative h-[35px] justify-center py-0 px-[8px] bg-white group focus-within:border-blue-500 w-[300px] md:w-[600px]`}>
            <input className={`outline-none border-none font-sans text-sm bg-white`}
                placeholder={placeholder}
                readOnly={readOnly}
                value={value}
                onChange={e => {
                    if (onChange) {
                        onChange(e.target.value)
                    }
                }} onClick={() => !readOnly ? optionsDisplay(true) : null} />
            {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-blue-950 
                ${required ? "after:content-['*'] after:font-bold after:text-sm after:ml-1" : ''}`}>{label}</p> : null}
            {showOptions && autoCompleteOptions && autoCompleteOptions.length > 0 ?
                <div ref={selectContainerRef} className={`absolute border border-gray-300 top-[34px] left-0 z-10 rounded overflow-auto bg-white max-h-[160px] w-[300px] md:w-[600px]`}>
                    {autoCompleteOptions.map(eachOption => <div onClick={() => {
                        if (onSelect) {
                            onSelect(eachOption.value)
                        }
                        optionsDisplay(false)
                    }} key={eachOption.value} className="flex items-center text-nowrap my-1 hover:bg-slate-200 p-1">
                        <img src={locPin} className="w-6"/>
                        <p className="ml-1 text-gray-600 text-sm"><span className="font-bold text-black">{eachOption.label.slice(0, eachOption.offset)}</span>{eachOption.label.slice(eachOption.offset)}</p>
                    </div>)}
                </div> : null}
        </div>
    </div>
}

export default Input;
