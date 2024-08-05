import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import addIcon from '@assets/add.png'
import editIcon from '@assets/edit.png'

import Select from "@components/Select"
import Input from "@components/Input"
import Button from "@components/Button"

import { PlaceAutoComplete, PlaceDetails, PickupStore, LocationAddress } from '@lib/interfaces'

import SpecifyAddress from "./SpecifyAddress"
import DefaultSelect from "@components/DefaultSelect"

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
    rto: boolean,
    storeId: string,
    category: string
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
    dropCode: string
}

const initialValue: State = {
    placesResponse: [], billNumber: '', address: '', placeId: '', name: '', phoneNumber: '', orderAmount: '', pincode: '',
    rto: false, storeId: '', category: 'F&B', addrLine1: '', addrLine2: '', city: '', state: '', geoLocation: '', dropCode: ''
}

const reducer = (state: State, action: { type: 'reset', payload: Partial<State> } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}

export default ({ open, onClose, onPlacesSearch, getPickupList, createOrder, checkPrice, showNewOutletForm, saveInStorage, onPlaceChoose, activity, pickupStores, getCustomerInfo, role }: {
    open: boolean,
    onClose: () => void,
    onPlacesSearch: (searchText: string, callback: (data: PlaceAutoComplete[]) => void,
        latitude?: number, longitude?: number) => void,
    onPlaceChoose: (placeId: string, callback: (data: PlaceDetails) => void) => void,
    getPickupList: (callback: (stores?: PickupStore[]) => void) => void,
    activity: { [k: string]: boolean },
    pickupStores: PickupStore[],
    createOrder: (billNumber: string, storeId: string, amount: string, category: string, drop: LocationAddress) => void,
    checkPrice: (billNumber: string, storeId: string, amount: string, category: string, drop: LocationAddress) => void,
    showNewOutletForm: (storeId?: string) => void,
    saveInStorage: (keyName: string, value: string) => void
    getCustomerInfo: (phone: string, callback: (info: LocationAddress) => void) => void
    role: string
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    const retrieveSavedOutlet = () => {
        let outlet = localStorage.getItem('storeDetails')
        let payload: Partial<State> = {}
        if (outlet) {
            let storeDetails = JSON.parse(outlet)
            payload.storeId = storeDetails.storeId
            payload.city = storeDetails.city
            payload.state = storeDetails.state
        }
        dispatch({ type: 'reset', payload })
    }

    const storeGeolocation = () => {
        const store = pickupStores.find(e => e.storeId === state.storeId)
        if (store) {
            return { lat: store.latitude, lng: store.longitude }
        }
    }

    useEffect(() => {
        if (open && pickupStores.length === 0) {
            getPickupList(() => {
                retrieveSavedOutlet()
            })
        } else {
            retrieveSavedOutlet()
        }
    }, [open])

    const processOrder = (action: 'checkPrice' | 'createOrder') => {
        if ((state.latitude && state.longitude) || /^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation)) {
            let latitude = state.latitude
            let longitude = state.longitude

            if (!latitude || !longitude) {
                let match = /^([0-9.]+)\s*,\s*([0-9.]+)$/.exec(state.geoLocation)
                if (match) {
                    latitude = parseFloat(match[1])
                    longitude = parseFloat(match[2])
                }
            }

            if (latitude && longitude) {
                let drop: {
                    lat: number,
                    lng: number,
                    address: {
                        name: string,
                        line1: string,
                        line2: string,
                        city: string,
                        state: string
                    },
                    pincode: string
                    phone: string
                    code: string
                } = {
                    lat: latitude,
                    lng: longitude,
                    address: {
                        name: state.name,
                        line1: state.addrLine1,
                        line2: state.addrLine2,
                        city: state.city,
                        state: state.state
                    },
                    pincode: state.pincode,
                    phone: state.phoneNumber,
                    code: state.dropCode
                }

                if (action === 'checkPrice' && drop) {
                    checkPrice(state.billNumber, state.storeId, state.orderAmount, state.category, drop)
                } else if (action === 'createOrder' && drop) {
                    createOrder(state.billNumber, state.storeId, state.orderAmount, state.category, { ...drop })
                }
            }
        }
    }

    return <Modal open={open} onClose={onClose} loading={activity.getPickupList || activity.getCustomerInfo}>
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5 md:h-[600px] w-[370px] h-[570px] relative md:w-[650px] xl:h-[800px]`} onMouseDown={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-3`}>
                <p className="text-xl font-semibold">Add Order</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute right-1 top-1" />
            </div>
            <div className="absolute right-1 left-1 top-[50px] bottom-[60px] overflow-auto px-3 py-2">
                <div className={"md:flex md:items-end mb-[20px]"}>
                    <Select label="Outlet" options={[...pickupStores].sort((a, b) => a.address.name < b.address.name ? -1 : 1).map(e => ({ label: `${e.address.name} (${e.phone}) - ${e.pincode}`, value: e.storeId }))} onChange={val => {
                        const storeDetails = pickupStores.find(e => e.storeId === val)
                        dispatch({ type: 'update', payload: { storeId: val, city: storeDetails?.address.city, state: storeDetails?.address.state } })
                        saveInStorage('storeDetails', JSON.stringify({ storeId: val, city: storeDetails?.address.city || '', state: storeDetails?.address.state || '' }))
                    }} value={state.storeId} hideSearch size="large" />
                    <div onClick={() => role === 'super_admin' && showNewOutletForm()} className={`bg-blue-500 md:w-8 rounded-full ml-4 mb-1 w-6 hidden md:block ${role === 'super_admin' ? `cursor-pointer` : 'opacity-30'}`} title="Add Outlet">
                        <img src={addIcon} />
                    </div>
                    <div onClick={() => showNewOutletForm(state.storeId)} className={`bg-blue-500 md:w-8 rounded-full ml-4 mb-1 cursor-pointer w-6 hidden md:block p-1 ${!state.storeId ? 'opacity-0' : ''}`} title="Edit Outlet">
                        <img src={editIcon} />
                    </div>
                    <div className="flex justify-between">
                        <p className={`text-blue-500 font-semibold md:text-lg underline cursor-pointer md:ml-6 mb-1 text-sm mt-2 md:hidden ${role === 'super_admin' ? `cursor-pointer` : 'opacity-30'}`}
                            onClick={() => role === 'super_admin' && showNewOutletForm()}>Add Outlet</p>
                        {state.storeId ? <p className={`text-blue-500 font-semibold md:text-lg underline cursor-pointer md:ml-6 mb-1 text-sm mt-2 md:hidden`}
                            onClick={() => showNewOutletForm(state.storeId)}>Edit Outlet</p> : null}
                    </div>
                </div>
                <div>
                    <Input label="Bill Number" value={state.billNumber} onChange={val => dispatch({ type: 'update', payload: { billNumber: val } })} />
                </div>
                <p className={'text-lg font-bold my-3 mx-1'}>Drop</p>
                <div className={'md:flex md:items-center *:mb-3 md:*:mb-0'}>
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => {
                        if (/^[0-9]*$/.test(val)) {
                            dispatch({ type: 'update', payload: { phoneNumber: val } })
                            if (val.length === 10) {
                                getCustomerInfo(val, (info) => {
                                    dispatch({ type: 'update', payload: { name: info.address.name, addrLine1: info.address.line1, addrLine2: info.address.line2, pincode: info.pincode, latitude: info.lat, longitude: info.lng, geoLocation: `${info.lat}, ${info.lng}` } })
                                })
                            }
                        }
                    }} />
                    <div className="md:ml-3">
                        <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                    </div>
                </div>
                <SpecifyAddress onPlacesSearch={onPlacesSearch} onUpdate={payload => dispatch({ type: 'update', payload })} payload={state} onPlaceChoose={onPlaceChoose}
                    module="addOrder" storeLocation={storeGeolocation()} />
                <div className="mt-2">
                    <Input label="Code" size="small" type='number' value={state.dropCode} onChange={val => /^\d{0,4}$/.test(val) && dispatch({ type: 'update', payload: { dropCode: val } })} />
                </div>
                <p className={'text-lg font-bold my-3 mx-1'}>Order  Details</p>
                <div className={'md:flex md:items-center'}>
                    <DefaultSelect label="Category" options={[{ label: 'Food', value: 'F&B' }, { label: 'Grocery', value: 'Grocery' }]} onChange={val => dispatch({ type: 'update', payload: ({ category: val }) })} value={state.category} />
                    <div className="md:ml-3 mt-4 md:mt-0">
                        <Input label="Order Amount" size="small" value={state.orderAmount} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { orderAmount: val } })} />
                    </div>
                </div>
            </div>
            <div className="absolute flex justify-end mt-5 *:ml-3 mb-2 md:mb-0 md:bottom-5 bottom-2">
                <Button title="Check Price" onClick={() => processOrder('checkPrice')} disabled={!state.billNumber || !state.storeId ||
                    (!/^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation) && (!state.latitude || !state.longitude)) || !state.phoneNumber || !state.category || !state.orderAmount || activity.getPriceQuote}
                    loading={activity.getPriceQuote} variant="info" />
                <Button title="Create Order" variant="primary" onClick={() => processOrder('createOrder')}
                    disabled={!state.billNumber || !state.storeId || (!/^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation) && (!state.latitude || !state.longitude)) || !state.phoneNumber || !state.category ||
                        !state.orderAmount || activity.getPriceQuote} loading={activity.createOrder} />
            </div>
        </div>
    </Modal>
}