import React, { useEffect, useState } from "react";
import downLogo from '@assets/select_down.png'
import close from '@assets/close.png'
import checkbox from '@assets/checkbox.png'
import checkboxSelected from '@assets/checkbox_selected.png'

interface Props<T> {
  label?: string,
  value: T[],
  onChange?: (a: T) => void,
  size?: "xs" | "small" | "medium" | "large" | "extraLarge" | "full"
  required?: boolean,
  readOnly?: boolean,
  options?: { label: string, value: T }[]
  hideSearch?: boolean,
  defaultLabel?: string
  clearValues?: () => void
}

export default <T extends unknown>({ label, value, onChange, size, options, required, readOnly, hideSearch, clearValues }: Props<T>) => {
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

  const [searchFilter, setSearchFilter] = useState('')

  return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[30px] md:h-[46px]' : 'md:h-[35px]'}`}>
    <div className={`flex flex-col border border-gray-300 rounded relative h-[35px] justify-center py-0 px-[8px] bg-white group focus-within:border-blue-500
                                    ${size === 'small' ? `w-[150px] md:w-[196px]` : size === 'medium' || !size ? 'w-[300px] md:w-[400px]' : size === 'large' ?
        'w-[320px] md:w-[500px]' : size === 'full' ? 'w-full' : 'w-[300px] md:w-[620px]'} ${readOnly ? 'opacity-60' : ''}`} >
      <div onClick={() => !readOnly && options?.length ? setOptionDisplay(true) : null} className={`flex justify-between items-center`}>
        <input readOnly value={value?.length > 0 ? `${value?.length} Selected` : '--Select--'} className="w-full outline-none border-none text-sm" />
        <div className="flex items-center">
          {clearValues ? <img src={close} onClick={e => {
            e.stopPropagation()
            clearValues()
          }} className="w-5 cursor-pointer" /> : null}
          <img src={downLogo} className='mx-2 w-6' />
        </div>
      </div>
      {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-slate-500 ${required ? "after:content-['*'] after:font-bold after:text-sm after:ml-1" : ''}`}>{label}</p> : null}
      {!readOnly && optionDisplay && options?.length ?
        <div ref={selectContainerRef} className={`absolute top-[33px] z-50 left-2 right-2 bg-white shadow-3xl rounded max-h-[250px] flex flex-col`}>
          {options.length >= 6 && !hideSearch ?
            <div className={'flex flex-row items-center mx-2'}>
              <input placeholder='Search' value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="outline-none border bg-white rounded my-2 mx-3 px-2 font-sans h-8" />
              <img src={close} onClick={() => setSearchFilter('')} className="w-6 cursor-pointer" />
            </div> : null}
          <div className="overflow-auto">
            {options?.filter(e => !searchFilter || e.label.toUpperCase().replace(/\s|_/g, "").indexOf(searchFilter.toUpperCase().replace(/\s|_/g, "")) > -1).map(eachOption => {
              return <div onClick={() => {
                setSearchFilter('')
                if (onChange) {
                  onChange(eachOption.value)
                }
              }} key={eachOption.label} className="px-3 py-1 hover:bg-slate-200 cursor-pointer text-nowrap flex items-center">
                <img src={value.includes(eachOption.value) ? checkboxSelected : checkbox} className="md:w-6 w-4 mr-2" />
                <p className="text-sm">{eachOption.label}</p>
              </div>
            })}
          </div>
        </div> : null}
    </div>
  </div>
}
