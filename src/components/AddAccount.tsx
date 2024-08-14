import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "./Input"
import Switch from "./Switch"
import Select from "./DefaultSelect"
import Button from "./Button"
import { useReducer } from "react"

interface State {
    accountName: string
    gstId: string
    autoSelectMode: string
    contactNumbers: string
    plan: string
    rtoRequired: boolean
}

const initialValue: State = {
    accountName: '', gstId: '', autoSelectMode: 'preferred_lsp', contactNumbers: '', plan: 'flat-5-manual-dashboard', rtoRequired: false
}

const reducer = (state: State, action: { type: 'reset' | 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}

export default ({ open, onClose, createAccount }: { open: boolean, onClose: () => void, createAccount: (accountName: string, gstId: string, autoSelectMode: string, contacts: string, plan: string, rtoRequired: boolean) => void }) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    return <Modal open={open} onClose={onClose}>
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5  w-[370px] h-[390px] relative md:w-[650px] md:h-[410px]`} onMouseDown={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-3`}>
                <p className="text-xl font-semibold">Create Account</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute right-1 top-1" />
            </div>
            <div className="*:my-2">
                <Input label={'Account Name'} value={state.accountName || ''} onChange={val => dispatch({ type: 'update', payload: { accountName: val } })} />
                <div className="md:flex  md:items-center" >
                    <Input label={'GST Id'} size="small" value={state.gstId || ''} onChange={val => /^[a-z0-9]{0,15}$/i.test(val) && dispatch({ type: 'update', payload: { gstId: val.toUpperCase() } })} />
                    <div className="md:ml-2 mt-4 md:mt-0">
                        <Select label={'Autoselect Mode'} options={[{ label: 'Preferred LSP', value: 'preferred_lsp' }, { label: 'Lowest Price', value: 'lowest_price' },
                        { label: 'Lowest SLA', value: 'lowest_sla' }, { label: 'Fastest Agent', value: 'fastest_agent' }]} value={state.autoSelectMode || undefined}
                            onChange={val => dispatch({ type: 'update', payload: { autoSelectMode: val } })} />
                    </div>
                </div>
                <Input label={'Contact Numbers'} value={state.contactNumbers || ''} onChange={val => /^[0-9, \-]*$/.test(val) && dispatch({ type: 'update', payload: { contactNumbers: val } })} />
                <Select label={'Plan'} options={[{ label: 'Flat 5 Manual Dashboard', value: 'flat-5-manual-dashboard' }]} onChange={val => dispatch({ type: 'update', payload: { plan: val } })} />
                <div className="flex items-center">
                    <p className="mr-2">RTO Required</p>
                    <Switch on={state.rtoRequired} onClick={() => dispatch({ type: 'update', payload: { rtoRequired: !state.rtoRequired } })} />
                </div>
                <div className="flex justify-center pt-4 ">
                    <Button title="Create Account" onClick={() => createAccount(state.accountName, state.gstId, state.autoSelectMode, state.contactNumbers, state.plan, state.rtoRequired)}
                        variant="primary" disabled={!state.accountName || !state.autoSelectMode
                            || !state.contactNumbers || !/^[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(state.gstId)} />
                </div>
            </div>
        </div>
    </Modal>
}