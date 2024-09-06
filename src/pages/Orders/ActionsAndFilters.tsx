import addIcon from "@assets/add.png"
import refreshIcon from "@assets/refresh.png"
import Input from '@components/Input';
import Button from '@components/Button';
import Multiselect from '@components/Multiselect';

export default ({ onAddOrder, onRefresh, outlets, chosenOutlets, chooseOutlets, filterDate, changeDate }: {
    onAddOrder?: (orderId?: string) => void
    onRefresh: () => void
    outlets: { label: string, value: string }[]
    chosenOutlets: string[]
    chooseOutlets: (o: string[]) => void
    filterDate: string
    changeDate: (date: string) => void
}) => {
    return <div className={`flex sm:items-end items-center justify-between p-2 sm:flex-row-reverse flex-col mb-2`}>
        <div className={`flex w-full mb-3 sm:mb-0 justify-between items-end`}>
            <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                changeDate(val)
                chooseOutlets([])
            }} />
            {onAddOrder ? <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} /> : null}
        </div>
        <div className={'flex sm:*:mr-4  mt-2 sm:mt-0 w-full sm:w-auto items-end justify-between'}>
            <div className="hidden sm:block">
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
            </div>
            <div className="bg-blue-500 flex justify-center items-center p-1 rounded-md sm:hidden" onClick={onRefresh}>
                <img src={refreshIcon} className="w-6"/>
            </div>
            <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} />
        </div>
    </div>
}