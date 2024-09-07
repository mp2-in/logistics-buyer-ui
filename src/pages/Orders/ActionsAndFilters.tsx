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
    return <div className={`flex lg:items-end items-center justify-between p-2 lg:flex-row-reverse flex-col mb-2`}>
        <div className={`flex w-full mb-3 lg:mb-0 justify-between items-end`}>
            <div className="lg:hidden">
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                    changeDate(val)
                    chooseOutlets([])
                }} />
            </div>
            <div className="hidden lg:block">
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} />
            </div>
            {onAddOrder ? <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} /> : null}
        </div>
        <div className={'flex lg:*:mr-4  mt-2 lg:mt-0 w-full lg:w-auto items-end justify-between'}>
            <div className="hidden sm:block">
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
            </div>
            <div className="bg-blue-500 flex justify-center items-center p-1 rounded-md sm:hidden" onClick={onRefresh}>
                <img src={refreshIcon} className="w-6" />
            </div>
            <div className="lg:hidden">
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} />
            </div>
            <div className="hidden lg:block">
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                    changeDate(val)
                    chooseOutlets([])
                }} />
            </div>
        </div>
    </div>
}