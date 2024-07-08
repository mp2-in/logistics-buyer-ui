import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"

import { LocationAddress, PlaceAutoComplete, PlaceDetails } from '@lib/interfaces'

import styles from './AddOutlet.module.scss'
import Button from "@components/Button"
import { formatAddress } from "@lib/utils"
import SpecifyAddress from "./SpecifyAddress"

interface State {
    placesResponse: { placeId: string, address: string, offset: number }[]
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    latitude?: number
    longitude?: number
    addrComponents: { longText: string, types: string[] }[]
    storeId: string,
    addressOption: 'google' | 'manual'
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

const initialValue: State = {
    placesResponse: [], address: '', placeId: '', name: '', phoneNumber: '', storeId: '', addressOption: 'google',
    addrLine1: '', addrLine2: '', city: '', state: '', pincode: '', geoLocation: '', addrComponents: []
}

const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default ({ open, onClose, onPlacesSearch, addOutlet, onPlaceChoose, activity }: {
    open: boolean, onClose: () => void, onPlacesSearch: (searchText: string, callback: (data: PlaceAutoComplete[]) => void) => void,
    onPlaceChoose: (placeId: string, callback: (data: PlaceDetails) => void) => void,
     activity: { [k: string]: boolean }, addOutlet: (storeId: string, address: LocationAddress, placeId: string) => void
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    useEffect(() => {
        dispatch({ type: 'reset' })
    }, [open])

    const onAddOutlet = () => {
        if (state.addressOption === 'google') {
            if (state.latitude && state.longitude) {
                const formattedAddress = formatAddress(state.address, state.addrComponents)
                addOutlet(state.storeId, {
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
                }, state.placeId)
            }
        } else {
            let match = /^([0-9.]+)\s*,\s*([0-9.]+)$/.exec(state.geoLocation)
            if (match) {
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
                <SpecifyAddress onPlacesSearch={onPlacesSearch} onUpdate={payload => dispatch({ type: 'update', payload })} payload={state} onPlaceChoose={onPlaceChoose}/>
            </div>
            <div className={styles.addBtnContainer}>
                <Button title="Add Outlet" variant="primary" onClick={() => onAddOutlet()}
                    disabled={(state.addressOption === 'google' && !state.placeId) || (state.addressOption === 'manual' &&
                        (!state.addrLine1 || !state.addrLine2 || !state.city || !state.pincode || !/^[0-9.]+\s*,\s*[0-9.]+$/.test(state.geoLocation)))}
                    loading={activity.addOutlet} />
            </div>
        </div>
    </Modal>
}