import dayjs from "dayjs"
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export default ({ label, value, isDate, large, small, textArea, number }: {
    label: string,
    value: string | number | undefined,
    isDate?: boolean,
    large?: boolean,
    small?: boolean,
    textArea?: boolean
    number?: boolean
}) => {
    return <div className={`relative border border-gray-100 my-3 py-[4px] px-3 ${large ? `md:w-[530px] w-[290px]` : small ? `md:w-[150px] w-[100px]` : 'md:w-[260px] w-[290px]'} rounded-md`}>
        <p className="absolute -top-2 px-2 bg-white text-xs left-3 text-gray-500">{label}</p>
        {textArea ? <div className="overflow-auto">
            <p className="w-full h-[80px] text-sm">{value}</p>
        </div>
            : <input className="font-normal outline-none border-none w-full text-sm" readOnly value={value === undefined || value === '' || !value ? number ? '0' : '--' : isDate ? dayjs(value).format('MMM Do, hh:mm A') : value} />}
    </div>
}