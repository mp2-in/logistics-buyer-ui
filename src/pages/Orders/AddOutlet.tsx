import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"

import { LocationAddress, Place } from '@lib/interfaces'

import styles from './AddOutlet.module.scss'
import Button from "@components/Button"
import { formatAddress } from "@lib/utils"

interface State {
    placesResponse: { id: string, name: string, address: string, latitude: number, longitude: number, addrComponents: { longText: string, types: string[] }[] }[]
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    storeId: string,
}

const initialValue: State = { placesResponse: [], address: '', placeId: '', name: '', phoneNumber: '', storeId: '' }

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
                <div className={styles.address}>
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
                    }} autoCompleteOptions={state.placesResponse.map(e => ({ name: e.name.toString(), address: e.address.toString(), value: e.id.toString() }))} value={state.address} onSelect={(v) => {
                        const chosenPlace = state.placesResponse.find(e => e.id === v)
                        if (chosenPlace) {
                            dispatch({ type: 'update', payload: { placeId: v, address: chosenPlace.address, name: chosenPlace.name } })
                        }
                    }} />
                </div>
            </div>
            <div className={styles.addBtnContainer}>
                <Button title="Add Outlet" variant="primary" onClick={() => {
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
                }} />
            </div>
        </div>
    </Modal>
}