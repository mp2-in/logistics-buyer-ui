import { create } from 'zustand'
import { produce } from 'immer'
import { Api } from '@lib/utils'
import { Issue } from '@lib/interfaces'

interface Attributes {
    activity: { [k: string]: boolean }
    issues: Issue[]
}

interface State extends Attributes {
    getIssues: (token: string, filterDate: string) => void
}

const initialState: Attributes = { activity: {}, issues: [] };

export const useIssuesStore = create<State>()((set) => ({
    ...initialState,
    getIssues: async (token, filterDate) => {
        set(produce((state: State) => {
            state.activity.getIssues = true
        }))
        Api('/webui/issues_detailed', {
            method: 'post', headers: { 'Content-Type': 'application/json', token }, data: {date: filterDate}
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
    }
}))
