interface Props {
  label?: string
  value: string
  onChange?: (a: string) => void
  size?: "small" | "medium" | "large" | "extraLarge"
  placeholder?: string
  readOnly?: boolean
  required?: boolean
}
 export default ({ label, onChange, size, placeholder, readOnly, required, value }: Props) => {

  return <div className={`relative inline-flex flex-col justify-end ${label ? 'h-[100px] md:h-[146px]' : 'md:h-[135px]'}`}>
    <div className={`flex flex-col border border-gray-300 rounded relative h-full justify-center px-[8px] bg-white group focus-within:border-blue-500 py-2
                                    ${size === 'small' ? `w-[150px] md:w-[196px]` : size === 'medium' || !size ? 'w-[300px] md:w-[400px]' : size === 'large' ? 'w-[320px] md:w-[500px]' : 'w-[620px]'} ${readOnly ? 'opacity-60' : ''}`}>
      <textarea className={`font-sans text-sm border-none outline-none bg-white resize-none h-full`}
        placeholder={placeholder}
        readOnly={readOnly}
        value={value}
        onChange={e => {
          if (onChange) {
            onChange(e.target.value)
          }
        }} />
      {label ? <p className={`absolute group-focus-within:text-blue-500 bg-white left-[10px] -top-[8px] text-xs leading-3 font-medium px-1 text-blue-950 
              ${required ? "after:content-['*'] after:leading-3  after:font-bold after:text-sm after:ml-1" : ''}`}>{label}</p> : null}
    </div>
  </div>
}
