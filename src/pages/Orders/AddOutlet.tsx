import { useEffect, useReducer } from "react"

import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import Input from "@components/Input"

import { LocationAddress, PlaceAutoComplete, PlaceDetails } from '@lib/interfaces'

import Button from "@components/Button"
import SpecifyAddress from "./SpecifyAddress"

interface State {
    placesResponse: { placeId: string, address: string, offset: number }[]
    address: string
    placeId: string,
    name: string,
    phoneNumber: string,
    latitude?: number
    longitude?: number
    storeId: string,
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

const initialValue: State = {
    placesResponse: [], address: '', placeId: '', name: '', phoneNumber: '', storeId: '',
    addrLine1: '', addrLine2: '', city: '', state: '', pincode: '', geoLocation: ''
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
                let payload: {
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
                    phone: state.phoneNumber
                }

                addOutlet(state.storeId, payload, state.placeId)
            }
        }
    }

    return <Modal open={open} onClose={onClose} loading={activity.getPickupList}>
        <div className={`bg-white rounded flex flex-col items-center py-[10px] px-[20px]`} onClick={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-[10px]`}>
                <p className="text-[20px] font-semibold">Add Outlet</p>
                <img className={`w-[25px] cursor-pointer`} src={closeIcon} onClick={onClose} />
            </div>
            <div className="*:mb-2">
                <div>
                    <Input label="Store Id" value={state.storeId} onChange={val => dispatch({ type: 'update', payload: { storeId: val } })} />
                </div>
                <div className={`flex items-center`}>
                    <Input label="Phone Number" size="small" value={state.phoneNumber} onChange={val => /^[0-9]*$/.test(val) && dispatch({ type: 'update', payload: { phoneNumber: val } })} />
                    <div className="ml-3">
                        <Input label="Name" value={state.name} onChange={val => dispatch({ type: 'update', payload: { name: val } })} />
                    </div>
                </div>
                <SpecifyAddress onPlacesSearch={onPlacesSearch} onUpdate={payload => dispatch({ type: 'update', payload })} payload={state} onPlaceChoose={onPlaceChoose} />
            </div>
            <div className={`mt-[30px] mb-[20px]`}>
                <Button title="Add Outlet" variant="primary" onClick={() => onAddOutlet()}
                    disabled={(!/^([0-9.]+)\s*,\s*([0-9.]+)$/.test(state.geoLocation) && (!state.latitude || !state.longitude)) || !state.storeId ||
                        !state.phoneNumber || !state.addrLine1 || !state.addrLine2 || !state.pincode || !state.city || !state.state} loading={activity.addOutlet} />
            </div>
        </div>
    </Modal>
}