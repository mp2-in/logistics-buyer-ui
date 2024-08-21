import ActivityIndicator from "@components/ActivityIndicator"
import { useEffect, useState } from "react"
import { useAppConfigStore } from "stores/appConfig"
import { useIssuesStore } from "stores/issues"
import sortBlackDownIcon from "@assets/sort_black_down.png"
import sortBlackUpIcon from "@assets/sort_black_up.png"
import sortGreyDownIcon from "@assets/sort_grey_down.png"
import sortGreyUpIcon from "@assets/sort_grey_up.png"
import { Issue } from "@lib/interfaces"
import dayjs from "dayjs"
import TopBar from "@components/TopBar"
import Input from "@components/Input"
import moreIcon from "@assets/info.png"
import IssueInfo from "./IssueInfo"


const HeaderField = ({ cssClass, label, sort, hidden, onClick }: { cssClass: string, label: string, sort?: 'asc' | 'dsc', hidden?: boolean, onClick: () => void }) => {
    return <div className={`${cssClass} ${hidden ? 'hidden xl:flex' : 'flex'} items-center cursor-pointer justify-center py-2`} onClick={onClick}>
        <p>{label}</p>
        <div className={'flex-col items-center ml-2'}>
            <img src={sort === 'asc' ? sortBlackUpIcon : sortGreyUpIcon} className='w-2 mb-1' />
            <img src={sort === 'dsc' ? sortBlackDownIcon : sortGreyDownIcon} className='w-2' />
        </div>
    </div>
}

export default () => {
    const { token } = useAppConfigStore(state => ({ token: state.token }))
    const { getIssues, activity, issues } = useIssuesStore(state => ({
        getIssues: state.getIssues,
        activity: state.activity,
        issues: state.issues
    }))

    const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('dsc')
    const [sortField, setSortField] = useState<keyof Issue>('createdat')
    const [filterDate, setFilterDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [chosenIssue, setChosenIssue] = useState<string|undefined>(undefined)
    const [showIssueDetails, setIssueDetailsDisplay] = useState(false)

    useEffect(() => {
        getIssues(token || '', filterDate)
    }, [filterDate])

    const updateSortField = (field: keyof Issue) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'dsc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('dsc')
        }
    }

    const sortOrders = (a: Issue, b: Issue) => {
        return (a[sortField] || '') > (b[sortField] || '') ? sortOrder === 'asc' ? 1 : -1 : (a[sortField] || '') < (b[sortField] || '') ? sortOrder === 'asc' ? -1 : 1 : 0
    }

    return <div>
        <TopBar title='Issues' />
        <div className={`absolute left-0 right-0 md:top-[70px] top-[60px] bottom-3 md:px-5 md:py-3 px-2`}>
            <div className={`flex sm:items-end items-start justify-between p-2  mb-2`}>
                <Input label='For Date' type='date' size='small' value={filterDate} onChange={val => setFilterDate(val)} />
            </div>
            <div className='absolute top-[50px] left-2 right-2 bottom-1 overflow-auto sm:top-[50px] md:top-[80px]'>
                <div className={`flex items-center bg-blue-300 *:text-center *:font-medium  *:text-sm xl:*:text-sm w-[1265px] xl:w-full`}>
                    <HeaderField cssClass='flex-[3] ml-0 bg-blue-300 pl-1' label='Creation' sort={sortField === 'createdat' ? sortOrder : undefined} onClick={() => updateSortField('createdat')} />
                    <p className="flex-[5] bg-blue-300 py-2">Issue Id</p>
                    <p className="flex-[5] bg-blue-300 py-2">Bill Num</p>
                    <HeaderField cssClass='flex-[4] bg-blue-300' label='Status Updated' sort={sortField === 'statusUpdatedat' ? sortOrder : undefined} onClick={() => updateSortField('statusUpdatedat')} />
                    <HeaderField cssClass='flex-[3] bg-blue-300' label='Status' sort={sortField === 'resolutionStatus' ? sortOrder : undefined} onClick={() => updateSortField('resolutionStatus')} />
                    <p className="flex-[6] bg-blue-300 py-2">Description</p>
                    <p className="flex-[3] bg-blue-300 py-2">Action</p>
                    <p className="flex-[5] bg-blue-300 py-2">Resolution</p>
                    <HeaderField cssClass='flex-[2] bg-blue-300' label='Refund' sort={sortField === 'refundAmount' ? sortOrder : undefined} onClick={() => updateSortField('refundAmount')} />
                    <p className="flex-[1] bg-blue-300 py-2"></p>
                </div>
                <div className={`absolute  top-[35px] bottom-0 lg:right-5 left-0 w-[1265px] xl:w-full xl:overflow-auto`}>
                    {[...issues].sort(sortOrders).map(eachIssue => {
                        return <div key={eachIssue.orderId} className={`flex items-center w-full text-xs relative border-b *:text-center xl:text-sm h-[40px]`}>
                            <p className={`flex-[3] ml-0`}>{eachIssue.createdat ? dayjs(eachIssue.createdat).format('hh:mm A') : '--'}</p>
                            <div className={`flex-[5]`}>
                                <input className={`w-full outline-none  border-none text-center`} readOnly value={eachIssue.issueId} />
                            </div>
                            <div className={`flex-[5]`}>
                                <input className={`w-full outline-none  border-none text-center`} readOnly value={eachIssue.clientOrderId} />
                            </div>
                            <div className={`flex justify-center items-center h-full flex-[4]`}>
                                <p>{eachIssue.statusUpdatedat ? dayjs(eachIssue.statusUpdatedat).format('MMM Do,hh:mm A') : ''}</p>
                            </div>
                            <div className={`flex justify-center items-center h-full flex-[3]`}>
                                <input className={`border-none outline-none text-center w-full`} readOnly value={eachIssue.resolutionStatus} />
                            </div>
                            <div className={`justify-center items-center h-full flex-[6] pt-1 flex`}>
                                <p className='text-xs text-center'>{eachIssue.shortDescription}</p>
                            </div>
                            <p className={`flex-[3] h-full py-1`}>{eachIssue.resolutionAction}</p>
                            <p className={`flex-[5] h-full py-1 text-xs`}>{eachIssue.resolutionDescription}</p>
                            <div className={`flex justify-center items-center h-full flex-[2]`}>
                                <p className={`text-center w-full`}>{eachIssue.refundAmount}</p>
                            </div>
                            <div className={`flex-[1] h-full py-1 flex justify-center items-center`}>
                                <img src={moreIcon} onClick={e => {
                                    setChosenIssue(eachIssue.issueId)
                                    setIssueDetailsDisplay(true)
                                    e.stopPropagation()
                                }} title='Order Details' className={'cursor-pointer w-5 hover:shadow-md'} />
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
        {activity.getIssues ? <ActivityIndicator /> : null}
        <IssueInfo open={showIssueDetails} onClose={() => setIssueDetailsDisplay(false)} issueDetails={issues.find(e => e.issueId === chosenIssue)}/>
    </div>
}   