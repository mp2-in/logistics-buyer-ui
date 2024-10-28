import React, { useEffect, useState } from "react";
import downLogo from '@assets/select_down.png'
import close from '@assets/close.png'

interface Props<T> {
    label?: string,
    value?: T,
    onChange?: (a: T) => void,
    size?: "xs" | "small" | "medium" | "large" | "extraLarge"
    required?: boolean,
    readOnly?: boolean,
    options?: { label: string, value: T }[]
    hideSearch?: boolean,
    defaultLabel?: string
}

export default <T extends unknown>({ label, value, onChange, size, options, required, readOnly, hideSearch, defaultLabel = '--Select--' }: Props<T>) => {
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

    return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[30px] md:h-[46px]' : 'md:h-[35px]'} z-50`}>
        <div className={`flex flex-col border border-gray-300 rounded relative h-[35px] justify-center py-0 px-[8px] bg-white group focus-within:border-blue-500
                                    ${size === 'small' ? `w-[150px] md:w-[196px]` : size === 'medium' || !size ? 'w-[300px] md:w-[400px]' : size === 'large' ?
                'w-[320px] md:w-[500px]' : 'w-[300px] md:w-[620px]'} ${readOnly ? 'opacity-60' : ''}`} >
            <div onClick={() => !readOnly && options?.length ? setOptionDisplay(true) : null} className={`flex justify-between items-center`}>
                <input readOnly value={getValueLabel()} className="w-full outline-none border-none text-sm" />
                <img src={downLogo} className='ml-5 w-6' />
            </div>
            {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-slate-500 ${required ? "after:content-['*'] after:font-bold after:text-xs after:ml-1" : ''}`}>{label}</p> : null}
            {!readOnly && optionDisplay && options?.length ?
                <div ref={selectContainerRef} className={`absolute top-[33px] z-50 left-2 right-2 bg-white shadow-3xl rounded max-h-[250px] overflow-auto flex flex-col`}>
                    {options.length >= 6 && !hideSearch ?
                        <div className={'flex flex-row items-center mx-2'}>
                            <input placeholder='Search' value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="outline-none border bg-white rounded my-2 mx-3 px-2" />
                            <img src={close} onClick={() => setSearchFilter('')} className="w-6 cursor-pointer" />
                        </div> : null}
                    {options?.filter(e => !searchFilter || e.label.toUpperCase().replace(/\s|_/g, "").indexOf(searchFilter.toUpperCase().replace(/\s|_/g, "")) > -1).map(eachOption => {
                        return <div onClick={() => {
                            setSearchFilter('')
                            if (onChange) {
                                onChange(eachOption.value)
                            }
                            setOptionDisplay(false)
                        }} key={eachOption.label} className="px-3 py-1 hover:bg-slate-200 cursor-pointer hover:font-semibold text-nowrap">
                            <p className="text-sm">{eachOption.label}</p>
                        </div>
                    })}
                </div> : null}
        </div>
    </div>
}
