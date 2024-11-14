import ActivityIndicator from "@components/ActivityIndicator"
import { useEffect, useReducer } from "react"
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
import closeIcon from "@assets/cancel.png"
import retryIcon from "@assets/retry.png"
import copyIcon from "@assets/copy.png"
import IssueInfo from "./IssueInfoModal"
import CloseIssueConfirmation from "./CloseIssueConfirmation"
import parse from 'html-react-parser';
import IssueResolution from "./IssueResolution"


const HeaderField = ({ cssClass, label, sort, hidden, onClick }: { cssClass: string, label: string, sort?: 'asc' | 'dsc', hidden?: boolean, onClick: () => void }) => {
    return <div className={`${cssClass} ${hidden ? 'hidden xl:flex' : 'flex'} items-center cursor-pointer justify-center py-2`} onClick={onClick}>
        <p>{label}</p>
        <div className={'flex-col items-center ml-2'}>
            <img src={sort === 'asc' ? sortBlackUpIcon : sortGreyUpIcon} className='w-2 mb-1' />
            <img src={sort === 'dsc' ? sortBlackDownIcon : sortGreyDownIcon} className='w-2' />
        </div>
    </div>
}

interface State {
    sortOrder: 'asc' | 'dsc'
    sortField: keyof Issue
    filterDate?: string
    chosenIssue?: string
    closeIssue?: string
    issueResolution?: string
    showIssueDetails: boolean
}

const initialValue: State = {
    sortOrder: 'dsc', sortField: 'createdat', showIssueDetails: false
}

const reducer = (state: State, action: { type: 'reset', payload: Partial<State> } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}

const copyIssueDataToClipboard = (issue: Issue) => {
    let keys: (keyof Issue)[] = ['issueId', 'networkOrderId', 'orderId', 'clientOrderId', 'resolutionStatus', 'resolutionAction']
    navigator.clipboard.writeText(keys.map(e => `${e} : ${issue[e]}`).join("\n"))
}

export default () => {
    const { token, setToast, setPage } = useAppConfigStore(state => ({ token: state.token, setToast: state.setToast, setPage: state.setPage }))
    const { getIssues, activity, issues, closeIssue, refreshIssue } = useIssuesStore(state => ({
        getIssues: state.getIssues,
        activity: state.activity,
        issues: state.issues,
        closeIssue: state.closeIssue,
        refreshIssue: state.refreshIssue
    }))

    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        getIssues(token || '', state.filterDate)
    }, [state.filterDate])

    const rowBackground = (issueStatus: string, resolutionStatus: string) => {
        if (issueStatus.toLowerCase() === 'open') {
            if (resolutionStatus.toLowerCase() === 'created') {
                return 'bg-red-100'
            } else if (resolutionStatus.toLowerCase() === 'processing') {
                return 'bg-red-200'
            } else if (resolutionStatus.toLowerCase() === 'resolved') {
                return 'bg-green-100'
            }
        } else {
            return 'bg-green-200'
        }
    }

    const updateSortField = (field: keyof Issue) => {
        if (field === state.sortField) {
            dispatch({ type: 'update', payload: { sortOrder: (state.sortOrder === 'asc' ? 'dsc' : 'asc') } })
        } else {
            dispatch({ type: 'update', payload: { sortField: field, sortOrder: 'dsc' } })
        }
    }

    const sortOrders = (a: Issue, b: Issue) => {
        return (a[state.sortField] || '') > (b[state.sortField] || '') ? state.sortOrder === 'asc' ? 1 : -1 : (a[state.sortField] || '') < (b[state.sortField] || '') ? state.sortOrder === 'asc' ? -1 : 1 : 0
    }

    useEffect(() => {
        setPage('issues')
    }, [])

    const getResolutionDuration = (createdAt: string, resolvedAt: string) => {
        let totalSeconds = dayjs(resolvedAt).diff(createdAt, 'second');

        const totalHours = Math.floor(totalSeconds / (60 * 60))
        totalSeconds = totalSeconds - (totalHours * 60 * 60)

        const totalMinutes = Math.floor(totalSeconds / 60)  

        return `${('0' + totalHours).slice(-2)}:${('0' + totalMinutes).slice(-2)}`
    }

    return <div>
        <TopBar title='Issues' onAccountSwitch={(newToken) => {
            getIssues(newToken || '', state.filterDate)
        }} />
        <div className={`absolute left-0 right-0 md:top-[70px] top-[60px] bottom-3 md:px-5 md:py-3 px-2`}>
            <div className={`flex sm:items-end items-start justify-between p-2  mb-2`}>
                <Input label='For Date' type='date' size='small' value={state.filterDate} onChange={val => dispatch({ type: 'update', payload: { filterDate: val } })} />
            </div>
            <div className='absolute top-[50px] left-2 right-2 bottom-1 overflow-auto sm:top-[50px] md:top-[80px]'>
                <div className={`flex items-center bg-blue-300 *:text-center *:font-medium  *:text-sm  w-[1265px] xl:w-full`}>
                    <HeaderField cssClass='flex-[4] ml-0 bg-blue-300 pl-1' label='Creation' sort={state.sortField === 'createdat' ? state.sortOrder : undefined} onClick={() => updateSortField('createdat')} />
                    <p className="flex-[6] bg-blue-300 py-2">Bill Number</p>
                    <HeaderField cssClass='flex-[5] bg-blue-300' label='Status Updated' sort={state.sortField === 'statusUpdatedat' ? state.sortOrder : undefined} onClick={() => updateSortField('statusUpdatedat')} />
                    <HeaderField cssClass='flex-[3] bg-blue-300' label='Status' sort={state.sortField === 'resolutionStatus' ? state.sortOrder : undefined} onClick={() => updateSortField('resolutionStatus')} />
                    <p className="flex-[5] bg-blue-300 py-2">Description</p>
                    <p className="flex-[3] bg-blue-300 py-2">Action</p>
                    <p className="flex-[5] bg-blue-300 py-2">Resolution</p>
                    <HeaderField cssClass='flex-[3] bg-blue-300' label='Refund' sort={state.sortField === 'refundAmount' ? state.sortOrder : undefined} onClick={() => updateSortField('refundAmount')} />
                    <p className="flex-[2] bg-blue-300 py-2">Actions</p>
                </div>
                <div className={`absolute  top-[35px] bottom-0 lg:right-5 left-0 w-[1265px] xl:w-full xl:overflow-auto`}>
                    {[...issues].sort(sortOrders).map(eachIssue => {
                        return <div key={eachIssue.issueId} className={`flex items-center w-full text-xs relative border-b *:text-center xl:text-sm h-[40px] ${rowBackground(eachIssue.issueStatus, eachIssue.resolutionStatus)}`}>
                            <p className={`flex-[4] ml-0`}>{eachIssue.createdat ? dayjs(eachIssue.createdat).format('MMM Do,hh:mm A') : '--'}</p>
                            <div className={`flex-[6] flex items-center`}>
                                <input className={`w-full outline-none  border-none text-center ${rowBackground(eachIssue.issueStatus, eachIssue.resolutionStatus)}`} readOnly value={eachIssue.clientOrderId} />
                                <img src={copyIcon} className='w-4 cursor-pointer ml-1 active:opacity-30' onClick={() => copyIssueDataToClipboard(eachIssue)} title="Copy issue details" />
                            </div>
                            <div className={`flex justify-center items-center h-full flex-[5]`}>
                                <p>{eachIssue.statusUpdatedat ? dayjs(eachIssue.statusUpdatedat).format('MMM Do,hh:mm A') : ''}</p>
                            </div>
                            <div className={`flex flex-col justify-center items-center h-full flex-[3] ${rowBackground(eachIssue.issueStatus, eachIssue.resolutionStatus)}`}>
                                <input className={`border-none outline-none text-center w-full bg-inherit`} readOnly value={eachIssue.resolutionStatus} />
                                {eachIssue.resolvedat ? <p className="text-xs font-medium">{`(${getResolutionDuration(eachIssue.createdat, eachIssue.resolvedat)})`}</p> : null}
                            </div>
                            <textarea readOnly className={`h-[38px] flex-[5] text-xs resize-none outline-none border-none ${rowBackground(eachIssue.issueStatus, eachIssue.resolutionStatus)}`}
                                value={(eachIssue.shortDescription || '').length > 40 ? `${eachIssue.shortDescription.substring(0, 40)}...` : (eachIssue.shortDescription || '')} />
                            <p className={`flex-[3] h-full py-1 text-xs`}>{eachIssue.resolutionAction}</p>
                            {!!eachIssue.resolutionDescription ? <div className={`h-[36px] flex-[5] text-xs pt-[2px] cursor-pointer rounded-md 
                            ${rowBackground(eachIssue.issueStatus, eachIssue.resolutionStatus)} border border-transparent overflow-hidden hover:border-slate-400`} onClick={() => {
                                    if (eachIssue.resolutionDescription) {
                                        dispatch({ type: 'update', payload: { issueResolution: eachIssue.resolutionDescription } })
                                    }
                                }}>
                                {/<\/?\w+>/.test((eachIssue.resolutionDescription || '').toString()) ? parse(eachIssue.resolutionDescription) :
                                    <p className="h-full flex-[5] text-xs resize-none bg-inherit border-none outline-none">
                                        {(eachIssue.resolutionDescription || '').length > 40 ? `${eachIssue.resolutionDescription.substring(0, 40)}...` : (eachIssue.resolutionDescription || '')}
                                    </p>}
                            </div> : <p className="flex-[5]" />}
                            <div className={`flex justify-center items-center h-full flex-[3]`}>
                                <p className={`text-center w-full`}>{eachIssue.refundAmount}</p>
                            </div>
                            <div className={`flex-[2] h-full py-1 flex justify-between items-center`}>
                                <img src={closeIcon} onClick={e => {
                                    if (eachIssue.issueStatus !== 'CLOSED') {
                                        dispatch({ type: 'update', payload: { closeIssue: eachIssue.issueId } })
                                    }
                                    e.stopPropagation()
                                }} title='Close Issue' className={`w-5 ${eachIssue.issueStatus === 'CLOSED' ? 'opacity-30' : 'cursor-pointer'}`} />
                                <img src={retryIcon} onClick={e => {
                                    refreshIssue(token || '', eachIssue.issueId)
                                    e.stopPropagation()
                                }} title='Refresh Status' className={'cursor-pointer w-5'} />
                                <img src={moreIcon} onClick={e => {
                                    dispatch({ type: 'update', payload: { chosenIssue: eachIssue.issueId, showIssueDetails: true } })
                                    e.stopPropagation()
                                }} title='Issue Details' className={'cursor-pointer w-5'} />
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
        {activity.getIssues || activity.refreshIssue ? <ActivityIndicator /> : null}
        <IssueInfo open={state.showIssueDetails} onClose={() => dispatch({ type: 'update', payload: { showIssueDetails: false } })} issueDetails={issues.find(e => e.issueId === state.chosenIssue)} />
        <CloseIssueConfirmation open={!!state.closeIssue} onClose={() => dispatch({ type: 'update', payload: { closeIssue: undefined } })}
            closeIssue={() => state.closeIssue && closeIssue(token || '', state.closeIssue, (success, message) => {
                if (success) {
                    dispatch({ type: 'update', payload: { closeIssue: undefined } })
                    setToast('Issue closed  successfully', 'success')
                } else {
                    setToast(message, 'error')
                }
            })} loading={activity.closeIssue} />
        <IssueResolution open={!!state.issueResolution} onClose={() => dispatch({ type: 'update', payload: { issueResolution: undefined } })} issueResolution={state.issueResolution || ''} />
    </div>
}   