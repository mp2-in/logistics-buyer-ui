interface Props {
    label?: string,
    value?: string,
    onChange?: (a: string) => void,
    size?: "xs" | "small" | "medium" | "large" | "extraLarge"
    required?: boolean,
    readOnly?: boolean,
    options?: { label: string, value: string }[]
    hideSearch?: boolean,
    defaultLabel?: string
}

export default ({ label, value, onChange, size, options, required, readOnly }: Props) => {
    return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[30px] md:h-[46px]' : 'md:h-[35px]'} z-50`}>
        <div className={`flex flex-col border border-gray-300 rounded relative h-[35px] justify-center py-0 px-[8px] bg-white group focus-within:border-blue-500
                                ${size === 'small' ? `w-[150px] md:w-[196px]` : size === 'medium' || !size ? 'w-[300px] md:w-[400px]' : size === 'large' ? 'w-[320px] md:w-[500px]' :
                'w-[300px] md:w-[620px]'} ${readOnly ? 'opacity-60' : ''}`} >
            {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-blue-950 ${required ?
                "after:content-['*'] after:font-bold after:text-sm after:ml-1" : ''}`}>{label}</p> : null}
            <select className="bg-white border-none outline-none" value={value} onChange={e => onChange && onChange(e.target.value)}>
                {options?.map(e => {
                    return <option value={e.value} key={e.value}>{e.label}</option>
                })}
            </select>
        </div>
    </div>
}
