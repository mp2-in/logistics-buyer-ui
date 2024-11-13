import searchIcon from '@assets/search.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useReducer } from 'react'
import { useAppConfigStore } from 'stores/appConfig'
import { Issue } from '@lib/interfaces'
import TopBar from '@components/TopBar'
import Input from '@components/Input'
import IssueDetails from './IssueDetails'
import { useIssuesStore } from 'stores/issues'
import CloseIssueConfirmation from './CloseIssueConfirmation'


export default () => {
    const { issueId } = useParams() as { issueId: string | undefined }

    const { token, setPage, setToast } = useAppConfigStore(state => ({
        token: state.token,
        setPage: state.setPage,
        setToast: state.setToast
    }))

    const { getIssueInfo, closeIssue, activity, refreshIssue } = useIssuesStore(state => ({
        getIssueInfo: state.getIssueInfo,
        closeIssue: state.closeIssue,
        refreshIssue: state.refreshIssue,
        activity: state.activity
    }))

    interface State {
        issueInfo: Issue | undefined
        mp2IssueId: string
        error: boolean
        showCloseConfirmation: boolean
    }

    const initialValue: State = {
        issueInfo: undefined, mp2IssueId: '', error: false, showCloseConfirmation: false
    }

    const reducer = (state: State, action: { type: 'reset', payload: Partial<State> } | { type: 'update', payload: Partial<State> }) => {
        switch (action.type) {
            case "update":
                return { ...state, ...action.payload }
            case "reset":
                return { ...initialValue, ...action.payload }
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (issueId) {
            dispatch({ type: 'update', payload: { mp2IssueId: issueId } })
            getIssueInfo(token || '', issueId, (success, issueInfo) => {
                if (success) {
                    dispatch({ type: 'update', payload: { issueInfo: issueInfo, error: false } })
                } else {
                    dispatch({ type: 'update', payload: { issueInfo: undefined, error: true } })
                }
            })
        }
        setPage('search')
    }, [issueId])

    const [state, dispatch] = useReducer(reducer, initialValue)

    return <div>
        <TopBar title="Issue Details" />
        <div className={'absolute left-1 right-1 bottom-5 top-12 flex items-center  overflow-auto flex-col md:top-16'}>
            <div className='mt-3 flex items-end'>
                <Input label='Issue Id' value={state.mp2IssueId} onChange={val => dispatch({ type: 'update', payload: { mp2IssueId: val } })} />
                <div className='bg-blue-500 flex justify-center items-center ml-2 p-1 rounded-full mb-1 cursor-pointer' onClick={() => navigate(`/issue/${state.mp2IssueId}`)}>
                    <img src={searchIcon} className='w-4 md:w-6' />
                </div>
            </div>
            <div className='h-[40px] flex items-center justify-center'>
                {state.error ? <p className='text-sm text-red-500 font-medium'>Invalid issue id</p> : null}
            </div>
            <div className={`w-[350px] md:w-[700px] border overflow-auto py-3 px-3 md:py-10 md:px-10 lg:px-40 lg:w-[1000px] rounded-xl flex flex-col 
                items-center md:block ${state.error || !state.issueInfo ? `opacity-35` : ''} relative`}>
                <IssueDetails issueDetails={state.issueInfo} actionOnTop onClose={issueId ? () => dispatch({ type: 'update', payload: { showCloseConfirmation: true } }) : undefined}
                    onRefresh={issueId ? () => refreshIssue(token || '', issueId, (issueInfo) => {
                        dispatch({ type: 'update', payload: { issueInfo } })
                    }) : undefined} />
            </div>
        </div>
        <CloseIssueConfirmation open={state.showCloseConfirmation} onClose={() => dispatch({ type: 'update', payload: { showCloseConfirmation: false } })}
            closeIssue={() => {
                if (issueId) {
                    closeIssue(token || '', issueId, (success, message) => {
                        if (success) {
                            dispatch({ type: 'update', payload: { showCloseConfirmation: false } })
                            setToast(message, 'success')
                        } else {
                            setToast(message, 'error')
                        }
                    })
                }
            }} loading={activity.closeIssue} />
    </div>
}   