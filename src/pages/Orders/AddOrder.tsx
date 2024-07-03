import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Select from "@components/Select"
import Input from "@components/Input"
import Switch from "@components/Switch"
import Button from "@components/Button"

import { Place, PickupStore, LocationAddress } from '@lib/interfaces'

import styles from './AddOrder.module.scss'
import { formatAddress } from "@lib/utils"
import SpecifyAddress from "./SpecifyAddress"

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
    storeId: string,
    type: string
    addressOption: 'google' | 'manual'
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

const initialValue: State = {
    placesResponse: [], billNumber: '', address: '', placeId: '', name: '', phoneNumber: '', orderAmount: '', pincode: '',
    rto: false, storeId: '', type: '', addressOption: 'google', addrLine1: '', addrLine2: '', city: '', state: '', geoLocation: ''
}

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
            <div>
                <div className={"flex items-end mb-[1.25rem]"}>
                    <Select label="Outlet" options={pickupStores.map(e => ({ label: e.address.name, value: e.storeId }))} onChange={val => dispatch({ type: 'update', payload: { storeId: val } })} value={state.storeId} />
                    <p className='text-blue-500 font-semibold text-lg underline cursor-pointer ml-6 mb-1' onClick={() => showNewOutletForm()}>Add Outlet</p>
                </div>
                <div>
                    <Input label="Bill Number" value={state.billNumber} onChange={val => dispatch({ type: 'update', payload: { billNumber: val } })} />
                </div>
                <p className={'text-lg font-bold my-3 mx-1'}>Drop</p>
                <div className={'flex items-center'}>
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { phoneNumber: val } })} />
                    <div className="ml-3">
                        <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                    </div>
                </div>
                <SpecifyAddress onPlacesSearch={onPlacesSearch} onUpdate={payload => dispatch({ type: 'update', payload })} payload={state} />
                <p className={'text-lg font-bold my-3 mx-1'}>Order  Details</p>
                <div className={'flex items-center'}>
                    <Select label="Type" options={[{ label: 'Food', value: 'food' }, { label: 'Grocery', value: 'grocery' }]} onChange={val => dispatch({ type: 'update', payload: ({ type: val }) })} value={state.type} />
                    <div className="ml-3">
                        <Input label="Value" size="small" value={state.orderAmount} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { orderAmount: val } })} />
                    </div>
                </div>
                <div className="flex items-center justify-between my-5">
                    <div className="flex items-center">
                        <p className="mr-3">RTO Required: </p>
                        <Switch on={state.rto} onClick={() => dispatch({ type: 'update', payload: { rto: !state.rto } })} />
                    </div>
                    <Button title="Check Price" onClick={() => {
                        const chosenPlace = state.placesResponse.find(e => e.id === state.placeId)
                        if (chosenPlace && state.latitude && state.longitude) {
                            const formattedAddress = formatAddress(chosenPlace.address, chosenPlace.addrComponents)
                            checkPrice(state.billNumber, state.storeId, state.orderAmount, {
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
                                phone: state.phoneNumber
                            })
                        }
                    }} disabled={!state.storeId || !state.address || !state.phoneNumber || !state.type || !state.orderAmount || activity.createOrder} loading={activity.getPriceQuote} />
                </div>
                <div className={'flex justify-center mb-3'}>
                    <Button title="Create Order" variant="primary" onClick={() => {
                        const chosenPlace = state.placesResponse.find(e => e.id === state.placeId)
                        if (chosenPlace && state.latitude && state.longitude) {
                            const formattedAddress = formatAddress(chosenPlace.address, chosenPlace.addrComponents)
                            createOrder(state.billNumber, state.storeId, state.orderAmount, {
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
                    }} disabled={!state.billNumber || !state.storeId || !state.address || !state.phoneNumber || !state.type || !state.orderAmount || activity.getPriceQuote} loading={activity.createOrder} />
                </div>
            </div>
        </div>
    </Modal>
}