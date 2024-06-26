import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Select from "@components/Select"
import Input from "@components/Input"
import Switch from "@components/Switch"
import Button from "@components/Button"

import { Place, PickupStore } from '@lib/interfaces'

import styles from './AddOrder.module.scss'

interface State {
    placesResponse: { [k: string]: string | number }[]
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    value: string,
    rto: boolean,
    store: string,
    type: string
}

const initialValue: State = { placesResponse: [], address: '', placeId: '', name: '', phoneNumber: '', value: '', rto: false, store: '', type: '' }

const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default ({ open, onClose, onPlacesSearch, getPickupList, activity, pickupStores }: {
    open: boolean, onClose: () => void, onPlacesSearch: (searchText: string,
        callback: (data: Place[]) => void) => void, getPickupList: () => void, activity: { [k: string]: boolean }, pickupStores: PickupStore[]
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        if (open) {
            getPickupList()
        }
        dispatch({ type: 'reset' })
    }, [open])

    return <Modal open={open} onClose={onClose} loading={activity.getPickupList}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <p>Create Pickup</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <div>
                    <Select label="Outlet" options={pickupStores.map(e => ({ label: e.address.name, value: e.storeId }))} onChange={val => dispatch({ type: 'update', payload: { store: val } })} value={state.store} />
                    <p className={styles.link}>Add Outlet</p>
                </div>
                <p className={styles.sectionHeader}>Drop</p>
                <div className={styles.dropDetails}>
                    <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { phoneNumber: val } })} />
                </div>
                <div className={styles.address}>
                    <Input label="Address" onChange={val => {
                        dispatch({ type: 'update', payload: { address: val } })
                        if (val.length > 2) {
                            onPlacesSearch(val, (data) => {
                                dispatch({
                                    type: 'update', payload: {
                                        placesResponse: data.map(e => {
                                            return {
                                                id: e.id,
                                                name: e.displayName.text,
                                                address: e.shortFormattedAddress,
                                                latitude: e.location.latitude,
                                                longitude: e.location.longitude
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }} autoCompleteOptions={state.placesResponse.map(e => ({ label: `${e.name.toString()} (${e.address.toString()})`, value: e.id.toString() }))} size="extraLarge" value={state.address} onSelect={(l, v) => {
                        dispatch({ type: 'update', payload: { address: l, placeId: v } })
                    }} />
                </div>
                <p className={styles.sectionHeader}>Order  Details</p>
                <div>
                    <Select label="Type" options={[{label: 'Food', value: 'food'}, {label: 'Grocery', value: 'grocery'}]} onChange={val => dispatch({type: 'update', payload: ({type: val})})} value={state.type}/>
                    <Input label="Value" size="small" value={state.value} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { value: val } })} />
                </div>
                <div className={styles.rto}>
                    <p>RTO Required: </p>
                    <Switch on={state.rto} onClick={() => dispatch({ type: 'update', payload: { rto: !state.rto } })} />
                </div>
                <div>
                    <Select label="LSP" />
                    <p className={styles.link}>Check Prices</p>
                </div>
                <div className={styles.actionBtn}>
                    <Button title="Create Order" variant="primary" />
                </div>
            </div>
        </div>
    </Modal>
}