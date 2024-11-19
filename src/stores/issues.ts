import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'
import { Issue } from '@lib/interfaces'

interface Attributes {
    activity: { [k: string]: boolean }
    issues: Issue[]
}

interface State extends Attributes {
    getIssues: (token: string, filterDate?: string) => void
    closeIssue: (token: string, issueId: string, rating: 'THUMBS-UP' | 'THUMBS-DOWN' | undefined, callback: (success: boolean, message: string) => void) => void
    refreshIssue: (token: string, issueId: string, callback?: (issueDetails: Issue) => void) => void
    getIssueInfo: (token: string, issueId: string, callback: (success: boolean, issueInfo?: Issue) => void) => void
}

const initialState: Attributes = { activity: {}, issues: [] };

export const useIssuesStore = create<State>()((set) => ({
    ...initialState,
    getIssues: async (token, date) => {
        set(produce((state: State) => {
            state.activity.getIssues = true
        }))
        Api('/webui/issues_detailed', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { date }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.getIssues = false
                    state.issues = res
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getIssues = false
                }))
            })
    },
    closeIssue: async (token, issueId, rating, callback) => {
        set(produce((state: State) => {
            state.activity.closeIssue = true
        }))
        Api('/webui/order/issue_close', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { issue: { id: issueId }, rating: rating || null }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.closeIssue = false
                }))

                if (res.status === 1) {
                    callback(true, 'Issue closed successfully')
                } else {
                    callback(false, res.message || 'Error closing issue')
                }
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.closeIssue = false
                }))
                callback(false, 'Error closing issue')
            })
    },
    refreshIssue: async (token, issueId, callback) => {
        set(produce((state: State) => {
            state.activity.refreshIssue = true
        }))
        Api('/webui/order/issue_status', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { issue: { id: issueId } }
        })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.refreshIssue = false
                    const index = state.issues.findIndex(e => e.issueId === issueId)
                    if (index > -1) {
                        state.issues[index] = res.issue
                    }
                }))
                callback && callback(res.issue)
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.refreshIssue = false
                }))
            })
    },
    getIssueInfo: async (token, issueId, callback) => {
        set(produce((state: State) => {
            state.activity.getIssueInfo = true
        }))
        Api('/webui/issue/info', { method: 'post', headers: { 'Content-Type': 'application/json', token }, data: { issue_id: issueId } })
            .then(res => {
                set(produce((state: State) => {
                    state.activity.getIssueInfo = false
                    if (res.status === 1) {
                        callback(true, res.issue)
                    } else {
                        callback(false)
                    }
                }))
            })
            .catch(() => {
                set(produce((state: State) => {
                    state.activity.getIssueInfo = false
                }))
            })
    },
}))
