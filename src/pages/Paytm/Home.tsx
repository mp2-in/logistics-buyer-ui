import backIcon from "@assets/back.png"
import walletIcon from "@assets/wallet.png"
import overviewIcon from "@assets/overview.png"
import headsetIcon from "@assets/headset.png"
import homeIcon from "@assets/home.png"
import Button from "./Button"
import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import { useNavigate } from "react-router-dom"
import AddOutlet from "./AddOutlet"
import { useOrdersStore } from "stores/orders"
import { useAppConfigStore } from "stores/appConfig"
import { useEffect, useReducer } from "react"
import Select from "./Select"
import { formatAddress } from "@lib/utils"

interface State {
    placesResponse: { placeId: string, address: string, offset: number }[]
    showAddAddress: boolean
    storeId: string
    address: string
    storeLatitude?: number
    storeLongitude?: number
    dropPlaceId: string
    dropFormattedAddressLine1: string
    dropFormattedAddressLine2: string
    city: string
    pincode: string
}

const initialValue: State = {
    showAddAddress: false, storeId: '', address: '', placesResponse: [], dropPlaceId: '', dropFormattedAddressLine1: '', dropFormattedAddressLine2: '', city: '', pincode: ''
}

const reducer = (state: State, action: { type: 'reset' } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return initialValue
    }
}

export default () => {
    const navigate = useNavigate()
    const [state, dispatch] = useReducer(reducer, initialValue)

    const { googlePlacesApi, activity, googlePlaceDetailsApi, addOutlet, getPickupList, pickupStores } = useOrdersStore(state => ({
        googlePlacesApi: state.googlePlacesApi,
        activity: state.activity,
        googlePlaceDetailsApi: state.googlePlaceDetailsApi,
        addOutlet: state.addOutlet,
        getPickupList: state.getPickupList,
        pickupStores: state.pickupStores
    }))

    const { token, setToast } = useAppConfigStore(state => ({ token: state.token, setToast: state.setToast }))

    useEffect(() => {
        getPickupList(token || '', () => null)
    }, [])

    return <><div className="absolute left-0 right-0 top-0 bottom-0">
        <div className="w-full h-[60px] border-b border-gray-500 flex justify-between items-center px-3 absolute">
            <img src={backIcon} className="w-10" />
            <div className="flex items-center">
                <p className="font-semibold text-xl">Paytm Swift</p>
                <img src={walletIcon} className="w-6 ml-4 mr-2" />
                <p>Rs 254</p>
            </div>
        </div>
        <div className="px-6 py-1 absolute top-[60px] bottom-[200px] overflow-auto">
            <p className="text-gray-700 text-xl font-semibold">Pickup Details</p>
            <div className="my-3">
                <Select label="Pickup From" options={[...pickupStores].sort((a, b) => a.address.name < b.address.name ? -1 : 1).map(e => ({ label: `${e.address.name} (${e.phone})`, value: e.storeId }))}
                    onChange={val => {
                        const store = pickupStores.find(e => e.storeId === state.storeId)
                        dispatch({ type: 'update', payload: { storeId: val, storeLatitude: store?.latitude, storeLongitude: store?.longitude } })
                    }} value={state.storeId} hideSearch size="large" required />
                <div className="flex justify-between items-center mt-2">
                    <p className="font-semibold underline text-dark-midnight" onClick={() => dispatch({ type: 'update', payload: { showAddAddress: true } })}>Add Address</p>
                    <p className={`font-semibold underline text-dark-midnight ${!state.storeId ? 'opacity-45' : ''}`}
                        onClick={() => state.storeId && dispatch({ type: 'update', payload: { showAddAddress: true } })}>Edit Address</p>
                </div>
                <div className="flex my-4">
                    <Input label="Bill Number" size='small' required />
                    <div className="ml-4">
                        <Input label="Order Amount" size='small' required />
                    </div>
                </div>
                <Input label="Pickup OTP" size='small' required />
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">Drop Details</p>
            <div className="my-1 *:my-2">
                <Input label="Pone Number" size='small' required />
                <Input label="Name" required />
                <div>
                    <PlacesSearchInput label="Search Address" onChange={val => {
                        dispatch({ type: 'update', payload: { address: val } })
                        if (val.length > 2) {
                            googlePlacesApi(val, (data) => {
                                dispatch({
                                    type: 'update', payload: {
                                        placesResponse: data.map(e => {
                                            return {
                                                placeId: e.placePrediction.placeId,
                                                address: e.placePrediction.text.text,
                                                offset: e.placePrediction.text.matches.length > 0 ? e.placePrediction.text.matches[0].endOffset : 0
                                            }
                                        })
                                    }
                                })
                            }, state.storeLatitude, state.storeLongitude)
                        }
                    }} autoCompleteOptions={state.placesResponse.map(e => ({ label: e.address.toString(), value: e.placeId.toString(), offset: e.offset }))}
                        value={state.address} onSelect={(v) => {
                            const chosenPlace = state.placesResponse.find(e => e.placeId === v)
                            if (chosenPlace) {
                                dispatch({ type: 'update', payload: { dropPlaceId: v, address: chosenPlace.address } })
                            }
                            googlePlaceDetailsApi(v, (placeDetails) => {
                                if (chosenPlace) {
                                    const formattedAddress = formatAddress(chosenPlace.address, placeDetails.addressComponents)
                                    dispatch({
                                        type: 'update', payload: {
                                            dropFormattedAddressLine1: formattedAddress.line1,
                                            dropFormattedAddressLine2: formattedAddress.line2, city: formattedAddress.city, pincode: formattedAddress.pincode
                                        }
                                    })
                                }
                            })
                        }} />
                </div>
                <Input label="Flat no/Building Name" readOnly value={state.dropFormattedAddressLine1} />
                <Input label="Area/Street" readOnly value={state.dropFormattedAddressLine2} />
                <div className="flex">
                    <Input label="City" readOnly value={state.city} size="small" />
                    <div className="ml-3">
                        <Input label="Pincode" readOnly value={state.pincode} size="small" />
                    </div>
                </div>
                <Input label="Drop/RTO OTP" size='small' />
            </div>
        </div>
        <div className="absolute -bottom-1 w-full">
            <div className="px-6">
                <div className="text-gray-600">
                    <p>Delivery Now</p>
                    <p>Starting at Rs 40 for first 2 kms</p>
                </div>
                <div className="flex w-full items-center justify-center my-4">
                    <Button title="Find Delivery Partner" onClick={() => navigate('partner')} variant="primary" />
                </div>
            </div>
            <div className="flex justify-between w-full border-t border-gray-400 h-[60px] items-center px-2">
                <img src={homeIcon} className="w-10" />
                <img src={overviewIcon} className="w-10" />
                <img src={walletIcon} className="w-10" onClick={() => navigate('/add_money')} />
                <img src={headsetIcon} className="w-10" />
            </div>
        </div>
    </div>
        <AddOutlet
            open={state.showAddAddress}
            onClose={() => dispatch({ type: 'update', payload: { showAddAddress: false } })}
            onPlacesSearch={(searchText, callback) => {
                googlePlacesApi(searchText, callback)
            }}
            activity={activity}
            addOutlet={(storeId, address, placesId) => {
                addOutlet(storeId ? 'update' : 'create', token || '', storeId, address, placesId, (success, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { showAddAddress: false } })
                        getPickupList(token || '', () => null)
                        setToast('Address updated successfully', 'success')
                    } else {
                        setToast(message || 'Error creating outlet', 'error')
                    }
                })
            }}
            onPlaceChoose={(placeId, callback) => {
                googlePlaceDetailsApi(placeId, callback)
            }}
            chosenStore={pickupStores.find(e => e.storeId === state.storeId)}
        />
    </>
}