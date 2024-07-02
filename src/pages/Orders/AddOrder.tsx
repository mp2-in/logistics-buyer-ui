import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Select from "@components/Select"
import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import Switch from "@components/Switch"
import Button from "@components/Button"

import { Place, PickupStore, LocationAddress } from '@lib/interfaces'

import styles from './AddOrder.module.scss'
import { formatAddress } from "@lib/utils"

interface State {
    placesResponse: { id: string, name: string, address: string, latitude: number, longitude: number, addrComponents: { longText: string, types: string[] }[] }[]
    billNumber: string,
    address: string
    placeId: string,
    latitude?: number,
    longitude?: number
    name: string,
    phoneNumber: string,
    orderAmount: string,
    rto: boolean,
    store: string,
    type: string
}

const initialValue: State = { placesResponse: [], billNumber: '', address: '', placeId: '', name: '', phoneNumber: '', orderAmount: '', rto: false, store: '', type: '' }

const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default ({ open, onClose, onPlacesSearch, getPickupList, createOrder, checkPrice, showNewOutletForm, activity, pickupStores }: {
    open: boolean, onClose: () => void, onPlacesSearch: (searchText: string,
        callback: (data: Place[]) => void) => void, getPickupList: () => void, activity: { [k: string]: boolean }, pickupStores: PickupStore[]
    , createOrder: (billNumber: string, storeId: string, amount: string, drop: LocationAddress) => void,
    checkPrice: (billNumber: string, storeId: string, amount: string, drop: LocationAddress) => void, showNewOutletForm: () => void
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
                <p>Add Order</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <div>
                    <Select label="Outlet" options={pickupStores.map(e => ({ label: e.address.name, value: e.storeId }))} onChange={val => dispatch({ type: 'update', payload: { store: val } })} value={state.store} />
                    <p className={styles.link} onClick={() => showNewOutletForm()}>Add Outlet</p>
                </div>
                <div>
                    <Input label="Bill Number" value={state.billNumber} onChange={val => dispatch({ type: 'update', payload: { billNumber: val } })} />
                </div>
                <p className={styles.sectionHeader}>Drop</p>
                <div className={styles.dropDetails}>
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { phoneNumber: val } })} />
                    <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                </div>
                <div className={styles.address}>
                    <PlacesSearchInput label="Address" onChange={val => {
                        dispatch({ type: 'update', payload: { address: val } })
                    }} autoCompleteOptions={state.placesResponse.filter(e => e.name && e.address && e.id).map(e => ({ name: e.name.toString(), address: e.address.toString(), value: e.id.toString() }))} value={state.address} onSelect={(v) => {
                        const chosenPlace = state.placesResponse.find(e => e.id === v)
                        if (chosenPlace) {
                            dispatch({ type: 'update', payload: { placeId: v, address: chosenPlace.address, latitude: chosenPlace.latitude, longitude: chosenPlace.longitude, name: state.name || chosenPlace.name } })
                        }
                    }} onChangeCallback={val => {
                        if ((val || '').toString().length > 2) {
                            onPlacesSearch((val || '').toString(), (data) => {
                                dispatch({
                                    type: 'update', payload: {
                                        placesResponse: data.map(e => {
                                            return {
                                                id: e.id,
                                                name: e.displayName.text,
                                                address: e.shortFormattedAddress,
                                                latitude: e.location.latitude,
                                                longitude: e.location.longitude,
                                                addrComponents: e.addressComponents
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }} />
                </div>
                <p className={styles.sectionHeader}>Order  Details</p>
                <div>
                    <Select label="Type" options={[{ label: 'Food', value: 'food' }, { label: 'Grocery', value: 'grocery' }]} onChange={val => dispatch({ type: 'update', payload: ({ type: val }) })} value={state.type} />
                    <Input label="Value" size="small" value={state.orderAmount} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { orderAmount: val } })} />
                </div>
                <div className={styles.rto}>
                    <p>RTO Required: </p>
                    <Switch on={state.rto} onClick={() => dispatch({ type: 'update', payload: { rto: !state.rto } })} />
                </div>
                <div className={styles.getQuote}>
                    <Button title="Check Price" onClick={() => {
                        const chosenPlace = state.placesResponse.find(e => e.id === state.placeId)
                        if (chosenPlace && state.latitude && state.longitude) {
                            const formattedAddress = formatAddress(chosenPlace.address, chosenPlace.addrComponents)
                            checkPrice(state.billNumber, state.store, state.orderAmount, {
                                lat: state.latitude,
                                lng: state.longitude,
                                address: {
                                    name: state.name,
                                    line1: formattedAddress.line1,
                                    line2: formattedAddress.line2,
                                    city: formattedAddress.city,
                                    state: formattedAddress.state
                                },
                                pincode: formattedAddress.pincode,
                                phone: state.phoneNumber,
                                code: '1234'
                            })
                        }
                    }} disabled={!state.store || !state.address || !state.phoneNumber || !state.type || !state.orderAmount || activity.createOrder} loading={activity.getPriceQuote} />
                </div>
                <div className={styles.actionBtn}>
                    <Button title="Create Order" variant="primary" onClick={() => {
                        const chosenPlace = state.placesResponse.find(e => e.id === state.placeId)
                        if (chosenPlace && state.latitude && state.longitude) {
                            const formattedAddress = formatAddress(chosenPlace.address, chosenPlace.addrComponents)
                            createOrder(state.billNumber, state.store, state.orderAmount, {
                                lat: state.latitude,
                                lng: state.longitude,
                                address: {
                                    name: state.name,
                                    line1: formattedAddress.line1,
                                    line2: formattedAddress.line2,
                                    city: formattedAddress.city,
                                    state: formattedAddress.state
                                },
                                pincode: formattedAddress.pincode,
                                phone: state.phoneNumber,
                                code: '1234'
                            })
                        }
                    }} disabled={!state.billNumber || !state.store || !state.address || !state.phoneNumber || !state.type || !state.orderAmount || activity.getPriceQuote} loading={activity.createOrder} />
                </div>
            </div>
        </div>
    </Modal>
}