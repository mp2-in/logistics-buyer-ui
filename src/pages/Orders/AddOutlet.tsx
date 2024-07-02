import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"

import { LocationAddress, Place } from '@lib/interfaces'

import styles from './AddOutlet.module.scss'
import Button from "@components/Button"
import { formatAddress, getStates } from "@lib/utils"
import Tab from "@components/Tab"
import Select from "@components/Select"

interface State {
    placesResponse: { id: string, name: string, address: string, latitude: number, longitude: number, addrComponents: { longText: string, types: string[] }[] }[]
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    storeId: string,
    addressOption: 'google' | 'manual'
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

const initialValue: State = { placesResponse: [], address: '', placeId: '', name: '', phoneNumber: '', storeId: '', addressOption: 'google', addrLine1: '', addrLine2: '', city: '', state: '', pincode: '', geoLocation: '' }

const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default ({ open, onClose, onPlacesSearch, addOutlet, activity }: {
    open: boolean, onClose: () => void, onPlacesSearch: (searchText: string,
        callback: (data: Place[]) => void) => void, activity: { [k: string]: boolean }, addOutlet: (storeId: string, address: LocationAddress, placeId: string) => void
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        dispatch({ type: 'reset' })
    }, [open])

    const onAddOutlet = () => {
        if(state.addressOption === 'google') {
            const chosenPlace = state.placesResponse.find(e => e.id === state.placeId)
            if (chosenPlace) {
                const formattedAddress = formatAddress(chosenPlace.address, chosenPlace.addrComponents)
                addOutlet(state.storeId, {
                    lat: chosenPlace.latitude,
                    lng: chosenPlace.longitude,
                    address: {
                        name: state.name,
                        line1: formattedAddress.line1,
                        line2: formattedAddress.line2,
                        city: formattedAddress.city,
                        state: formattedAddress.state
                    },
                    pincode: formattedAddress.pincode,
                    phone: state.phoneNumber,
                }, state.placeId)
            }
        } else {
            let match = /^([0-9.]+)\s*,\s*([0-9.]+)$/.exec(state.geoLocation)
            if(match) {
                addOutlet(state.storeId, {
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
                }, state.placeId)
            }
        }
    }

    return <Modal open={open} onClose={onClose} loading={activity.getPickupList}>
        <div className={styles.container} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
                <p>Add Outlet</p>
                <img src={closeIcon} onClick={onClose} />
            </div>
            <div className={styles.body}>
                <div>
                    <Input label="Store Id" value={state.storeId} onChange={val => dispatch({ type: 'update', payload: { storeId: val } })} />
                </div>
                <div className={styles.dropDetails}>
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { phoneNumber: val } })} />
                    <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                </div>
                <Tab options={['Google Places', 'Manual']} onSelect={val => dispatch({ type: 'update', payload: { addressOption: val === 'Google Places' ? 'google' : 'manual' } })}
                    selected={state.addressOption === 'google' ? 'Google Places' : 'Manual'} />
                {state.addressOption === 'google' ? <div className={styles.address}>
                    <PlacesSearchInput label="Address" onChange={val => {
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
                                                longitude: e.location.longitude,
                                                addrComponents: e.addressComponents
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }} autoCompleteOptions={state.placesResponse.filter(e => e.name && e.address && e.id).map(e => ({ name: e.name.toString(), address: e.address.toString(), value: e.id.toString() }))} value={state.address} onSelect={(v) => {
                        const chosenPlace = state.placesResponse.find(e => e.id === v)
                        if (chosenPlace) {
                            dispatch({ type: 'update', payload: { placeId: v, address: chosenPlace.address, name: state.name || chosenPlace.name } })
                        }
                    }} />
                </div> : <div className={styles.manualAddr}>
                    <Input label="Address Line 1" value={state.addrLine1} onChange={val => dispatch({ type: 'update', payload: { addrLine1: val } })} />
                    <Input label="Address Line 2" value={state.addrLine2} onChange={val => dispatch({ type: 'update', payload: { addrLine2: val } })} />
                    <div className={styles.row}>
                        <Input label="City" value={state.city} onChange={val => dispatch({ type: 'update', payload: { city: val } })} size='small' />
                        <Select label="State" value={state.state} onChange={val => dispatch({ type: 'update', payload: { state: val } })} options={getStates().map(e => ({ label: e, value: e }))} />
                    </div>
                    <Input label="Pincode" value={state.pincode} onChange={val => /^[0-9]{0,6}$/.test(val) && dispatch({ type: 'update', payload: { pincode: val } })} size='small' />
                    <div className={styles.row}>
                        <Input label="Geolocation" value={state.geoLocation} onChange={val => dispatch({ type: 'update', payload: { geoLocation: val } })} />
                        {/^[0-9.]+\s*,\s*[0-9.]+$/.test(state.geoLocation) ? <a href={`https://maps.google.com/?q=${state.geoLocation}`} target="_blank">Maps Link</a> : <a href={`https://maps.google.com`} target="_blank">Maps Link</a>}
                    </div>
                </div>}
            </div>
            <div className={styles.addBtnContainer}>
                <Button title="Add Outlet" variant="primary" onClick={() => onAddOutlet()}
                    disabled={(state.addressOption === 'google' && !state.placeId) || (state.addressOption === 'manual' &&
                        (!state.addrLine1 || !state.addrLine2 || !state.city || !state.pincode || !/^[0-9.]+\s*,\s*[0-9.]+$/.test(state.geoLocation)))}
                        loading={activity.addOutlet}/>
            </div>
        </div>
    </Modal>
}