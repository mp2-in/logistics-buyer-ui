import addIcon from "@assets/add.png"
import refreshIcon from "@assets/refresh.png"
import Input from '@components/Input';
import Button from '@components/Button';
import Multiselect from '@components/Multiselect';

export default ({ onAddOrder, onRefresh, outlets, chosenOutlets, chooseOutlets, filterDate, changeDate, chosenStatus, chooseStatus, status }: {
    onAddOrder?: (orderId?: string) => void
    onRefresh: () => void
    outlets: { label: string, value: string }[]
    status: { label: string, value: string }[]
    chosenOutlets: string[]
    chooseOutlets: (o: string[]) => void
    chosenStatus: string[]
    chooseStatus: (o: string[]) => void
    filterDate: string
    changeDate: (date: string) => void
}) => {
    return <div>
        <div className="*:my-2 flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-end *:mr-4">
                    <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                        changeDate(val)
                        chooseOutlets([])
                    }} />
                    <div className="bg-blue-500 flex justify-center items-center p-1 rounded-md md:hidden" onClick={onRefresh}>
                        <img src={refreshIcon} className="w-6" />
                    </div>
                    <div className="hidden md:block">
                        <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                    </div>
                </div>
                <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center *:my-2 lg:*:my-0 lg:*:mr-2">
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} hideSearch/>
                <Multiselect label='Choose Status' options={status} value={chosenStatus}
                    onChange={v => chosenStatus.includes(v) ? chooseStatus(chosenStatus.filter(e => e !== v)) : chooseStatus([...chosenStatus, v])} hideSearch/>
            </div>
        </div>
    </div>
}