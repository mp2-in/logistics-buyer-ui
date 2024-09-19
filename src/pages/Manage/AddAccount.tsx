import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"
import Switch from "@components/Switch"
import Select from "@components/DefaultSelect"
import Button from "@components/Button"
import { useEffect, useReducer } from "react"

interface State {
    accountName: string
    gstin: string
    autoSelectMode: string
    contactNumbers: string
    plan: string
    rtoRequired: boolean
    category: string
    maxRadius: number
}

const initialValue: State = {
    accountName: '', gstin: '', autoSelectMode: 'fastest_agent', contactNumbers: '', plan: 'flat-5-manual-dashboard', rtoRequired: false, category: 'F&B', maxRadius: 15
}

const reducer = (state: State, action: { type: 'reset' | 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}


export default ({ open, onClose, createAccount, loading }: {
    open: boolean,
    onClose: () => void,
    createAccount: (accountName: string, gstin: string, autoSelectMode: string, contacts: string, plan: string, rtoRequired: boolean, orderCategory: string, maxRadius: number) => void
    loading: boolean
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        dispatch({ type: 'reset', payload: initialValue })
    }, [open])

    return <Modal open={open} onClose={onClose}>
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5  w-[370px] h-[480px] relative md:w-[650px]`} onMouseDown={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-3`}>
                <p className="text-xl font-semibold">Create Account</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute right-1 top-1" />
            </div>
            <div className="*:my-2">
                <Input label={'Account Name'} value={state.accountName || ''} onChange={val => dispatch({ type: 'update', payload: { accountName: val } })} />
                <div className="md:flex  md:items-center" >
                    <Input label={'GST Id'} size="small" value={state.gstin || ''} onChange={val => /^[a-z0-9]{0,15}$/i.test(val) && dispatch({ type: 'update', payload: { gstin: val.toUpperCase() } })} />
                    <div className="md:ml-2 mt-4 md:mt-0">
                        <Select label={'Autoselect Mode'} options={[{ label: 'Fastest Agent', value: 'fastest_agent' }, { label: 'Lowest Price', value: 'lowest_price' }]}
                            value={state.autoSelectMode || undefined} onChange={val => dispatch({ type: 'update', payload: { autoSelectMode: val } })} />
                    </div>
                </div>
                <div className="md:flex  md:items-center pt-2" >
                    <Select label={'Category'} options={[{ label: 'F&B', value: 'F&B' }, { label: 'Grocery', value: 'Grocery' }, { label: 'Pharma', value: 'Pharma' }]}
                        value={state.category} onChange={val => dispatch({ type: 'update', payload: { category: val } })} size='small'/>
                    <div className="md:ml-2 mt-4 md:mt-0">
                        <Input label={'Max serviceable distance (in km)'} value={state.maxRadius}
                            onChange={val => /^\d*$/.test(val) && dispatch({ type: 'update', payload: { maxRadius: parseInt(val) } })} type='number' />
                    </div>
                </div>
                <Input label={'Contact Numbers'} value={state.contactNumbers || ''} onChange={val => /^[0-9, \-]*$/.test(val) && dispatch({ type: 'update', payload: { contactNumbers: val } })} />
                <Select label={'Plan'} options={[{ label: 'Flat 5 Manual Dashboard', value: 'flat-5-manual-dashboard' }]} onChange={val => dispatch({ type: 'update', payload: { plan: val } })} />
                <div className="flex items-center">
                    <p className="mr-2">RTO Required</p>
                    <Switch on={state.rtoRequired} onClick={() => dispatch({ type: 'update', payload: { rtoRequired: !state.rtoRequired } })} />
                </div>
                <div className="flex justify-center pt-4 ">
                    <Button title="Create Account" onClick={() => createAccount(state.accountName, state.gstin, state.autoSelectMode, state.contactNumbers, state.plan, state.rtoRequired, state.category, state.maxRadius)}
                        variant="primary" disabled={!state.accountName || !state.autoSelectMode
                            || !state.contactNumbers || !/^[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(state.gstin) || !state.maxRadius}
                        loading={loading} />
                </div>
            </div>
        </div>
    </Modal>
}