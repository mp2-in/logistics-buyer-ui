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
        <div className="*:my-2 flex flex-col lg:hidden">
            <div className="flex items-center justify-between">
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                    changeDate(val)
                    chooseOutlets([])
                    chooseStatus([])
                }} />
                <div className="flex">
                    <div className="bg-blue-500 flex justify-center items-center p-1 rounded-md sm:hidden" onClick={onRefresh}>
                        <img src={refreshIcon} className="w-6" />
                    </div>
                    <div className="hidden sm:block">
                        <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                    </div>
                    {onAddOrder ? <div className="bg-blue-500 flex justify-center items-center p-1 rounded-md sm:hidden ml-4" onClick={() => onAddOrder()}>
                        <img src={addIcon} className="w-6" />
                    </div> : null}
                    {onAddOrder ? <div className="hidden sm:block ml-4">
                        <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} />
                    </div> : null}
                </div>
            </div>
            <div className="flex flex-col *:my-2 sm:hidden">
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} hideSearch size="full" />
                <Multiselect label='Choose Status' options={status} value={chosenStatus}
                    onChange={v => chosenStatus.includes(v) ? chooseStatus(chosenStatus.filter(e => e !== v)) : chooseStatus([...chosenStatus, v])} hideSearch size="full" />
            </div>
            <div className="sm:flex-col lg:flex-row lg:items-center *:my-2 lg:*:my-0 lg:*:mr-2 hidden sm:flex">
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} hideSearch />
                <Multiselect label='Choose Status' options={status} value={chosenStatus}
                    onChange={v => chosenStatus.includes(v) ? chooseStatus(chosenStatus.filter(e => e !== v)) : chooseStatus([...chosenStatus, v])} hideSearch />
            </div>
        </div>
        <div className="*:my-2 lg:flex flex-col hidden">
            <div className="flex items-center justify-between">
                <Button title="Refresh" icon={<img src={refreshIcon} />} variant="primary" onClick={onRefresh} />
                {onAddOrder ? <Button title="Add Order" icon={<img src={addIcon} />} variant="primary" onClick={onAddOrder} /> : null}
            </div>
            <div className="sm:flex-col lg:flex-row lg:items-center *:my-2 lg:*:my-0 lg:*:mr-2 hidden sm:flex">
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => {
                    changeDate(val)
                    chooseOutlets([])
                    chooseStatus([])
                }} />
                <Multiselect label='Choose Outlet' options={outlets} value={chosenOutlets}
                    onChange={v => chosenOutlets.includes(v) ? chooseOutlets(chosenOutlets.filter(e => e !== v)) : chooseOutlets([...chosenOutlets, v])} hideSearch />
                <Multiselect label='Choose Status' options={status} value={chosenStatus}
                    onChange={v => chosenStatus.includes(v) ? chooseStatus(chosenStatus.filter(e => e !== v)) : chooseStatus([...chosenStatus, v])} hideSearch />
            </div>
        </div>
    </div>
}