import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import Select from "@components/Select"
import Input from "@components/Input"
import Switch from "@components/Switch"
import Button from "@components/Button"

import { PlaceAutoComplete, PlaceDetails, PickupStore, LocationAddress } from '@lib/interfaces'

import styles from './AddOrder.module.scss'
import { formatAddress } from "@lib/utils"
import SpecifyAddress from "./SpecifyAddress"

interface State {
    placesResponse: { placeId: string, address: string, offset: number }[]
    billNumber: string,
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    orderAmount: string,
    latitude?: number
    longitude?: number
    addrComponents: { longText: string, types: string[] }[]
    rto: boolean,
    storeId: string,
    category: string
    addressOption: 'google' | 'manual'
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

const initialValue: State = {
    placesResponse: [], billNumber: '', address: '', placeId: '', name: '', phoneNumber: '', orderAmount: '', pincode: '', addrComponents: [],
    rto: false, storeId: '', category: 'Grocery', addressOption: 'google', addrLine1: '', addrLine2: '', city: '', state: '', geoLocation: ''
}

const reducer = (state: State, action: { type: 'reset', payload: Partial<State> } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}

export default ({ open, onClose, onPlacesSearch, getPickupList, createOrder, checkPrice, showNewOutletForm, saveInStorage, onPlaceChoose, activity, pickupStores }: {
    open: boolean, onClose: () => void, onPlacesSearch: (searchText: string, callback: (data: PlaceAutoComplete[]) => void) => void, onPlaceChoose: (placeId: string, callback: (data: PlaceDetails) => void) => void,
    getPickupList: () => void, activity: { [k: string]: boolean }, pickupStores: PickupStore[], createOrder: (billNumber: string, storeId: string, amount: string, category: string, drop: LocationAddress) => void,
    checkPrice: (billNumber: string, storeId: string, amount: string, category: string, drop: LocationAddress) => void, showNewOutletForm: () => void,
    saveInStorage: (keyName: string, value: string) => void
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        if (open) {
            getPickupList()
        }
        let outlet = localStorage.getItem('outlet')
        let payload: { [k: string]: string } = {}
        if (outlet) {
            payload['storeId'] = outlet
        }
        dispatch({ type: 'reset', payload })
    }, [open])

    const processOrder = (action: 'checkPrice' | 'createOrder') => {
        let drop = undefined
        if (state.addressOption === 'google') {
            if (state.latitude && state.longitude) {
                const formattedAddress = formatAddress(state.address, state.addrComponents)
                drop = {
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
                }
            }
        } else {
            let match = /^([0-9.]+)\s*,\s*([0-9.]+)$/.exec(state.geoLocation)
            if (match) {
                drop = {
                    lat: parseFloat(match[1]),
                    lng: parseFloat(match[2]),
                    address: {
                        name: state.name,
                        line1: state.addrLine1,
                        line2: state.addrLine2,
                        city: state.city,
                        state: state.state
                    },
                    pincode: state.pincode,
                    phone: state.phoneNumber,
                }
            }
        }

        if (action === 'checkPrice' && drop) {
            checkPrice(state.billNumber, state.storeId, state.orderAmount, state.category, drop)
        } else if (action === 'createOrder' && drop) {
            createOrder(state.billNumber, state.storeId, state.orderAmount, state.category, { ...drop, code: '1234' })
        }
    }

    return <Modal open={open} onClose={onClose} loading={activity.getPickupList}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <p>Add Order</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div>
                <div className={"flex items-end mb-[1.25rem]"}>
                    <Select label="Outlet" options={pickupStores.map(e => ({ label: e.address.name, value: e.storeId }))} onChange={val => {
                        dispatch({ type: 'update', payload: { storeId: val } })
                        saveInStorage('outlet', val)
                    }} value={state.storeId} />
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
                <SpecifyAddress onPlacesSearch={onPlacesSearch} onUpdate={payload => dispatch({ type: 'update', payload })} payload={state} onPlaceChoose={onPlaceChoose}/>
                <p className={'text-lg font-bold my-3 mx-1'}>Order  Details</p>
                <div className={'flex items-center'}>
                    <Select label="Category" options={[{ label: 'Food', value: 'F&B' }, { label: 'Grocery', value: 'Grocery' }]} onChange={val => dispatch({ type: 'update', payload: ({ category: val }) })} value={state.category} />
                    <div className="ml-3">
                        <Input label="Value" size="small" value={state.orderAmount} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { orderAmount: val } })} />
                    </div>
                </div>
                <div className="flex items-center justify-between my-5">
                    <div className="flex items-center">
                        <p className="mr-3">RTO Required: </p>
                        <Switch on={state.rto} onClick={() => dispatch({ type: 'update', payload: { rto: !state.rto } })} />
                    </div>
                    <Button title="Check Price" onClick={() => processOrder('checkPrice')} disabled={!state.storeId || (state.addressOption === 'google' && !state.address) ||
                        !state.phoneNumber || !state.category || !state.orderAmount || activity.createOrder || (state.addressOption === 'manual' && !/^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation))}
                        loading={activity.getPriceQuote} variant="info"/>
                </div>
                <div className={'flex justify-center mb-3'}>
                    <Button title="Create Order" variant="primary" onClick={() => processOrder('createOrder')}
                        disabled={!state.billNumber || !state.storeId || (state.addressOption === 'google' && !state.address) || !state.phoneNumber || !state.category ||
                            !state.orderAmount || activity.getPriceQuote || (state.addressOption === 'manual' && !/^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation))} loading={activity.createOrder} />
                </div>
            </div>
        </div>
    </Modal>
}