import TopBar from "@components/TopBar"
import { useEffect, useReducer } from "react"
import PlacesSearchInput from "@components/PlacesSearchInput"
import { useAppConfigStore } from "stores/appConfig"
import { useOrdersStore } from "stores/orders"
import { formatAddress } from "@lib/utils"
import Input from "@components/Input"
import Button from "@components/Button"
import { PlaceAutoComplete, PlaceDetails, PriceQuote } from "@lib/interfaces"

interface AddressDetails {
    address: string
    placesResponse: { placeId: string, address: string, offset: number }[]
    latitude?: number
    longitude?: number
    geoLocation: string
    addressLine1: string
    addressLine2: string
    pincode: string
    city: string
    state: string
}

interface State {
    pickupLocation: AddressDetails
    dropLocation: AddressDetails
    quotes: PriceQuote[]
    loading: boolean
}

const initialValue: State = {
    pickupLocation: { address: '', placesResponse: [], geoLocation: '', addressLine1: '', addressLine2: '', pincode: '', city: '', state: '' },
    dropLocation: { address: '', placesResponse: [], geoLocation: '', addressLine1: '', addressLine2: '', pincode: '', city: '', state: '' },
    quotes: [], loading: false
}

const reducer = (state: State, action: { type: 'reset', payload: Partial<State> } |
{ type: 'updatePickup', payload: Partial<AddressDetails> } | { type: 'updateDrop', payload: Partial<AddressDetails> } | { type: 'update', payload: Partial<State> }) => {
    switch (action.type) {
        case "updatePickup":
            return { ...state, pickupLocation: { ...state.pickupLocation, ...action.payload } }
        case "updateDrop":
            return { ...state, dropLocation: { ...state.dropLocation, ...action.payload } }
        case "update":
            return { ...state, ...action.payload }
        case "reset":
            return { ...initialValue, ...action.payload }
    }
}


const ShowLspQuote = ({ data }: { data: PriceQuote }) => {
    return <div className="shadow-3xl m-4 rounded-lg">
        <p className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">{data.logistics_seller}</p>
        <div className="px-4 *:py-1 py-2">
            <p className="text-gray-500 font-medium">Price: <span className="font-semibold text-black">{data.price_with_gst}</span></p>
            <p className="text-gray-500 font-medium">SLA: <span className="font-semibold text-black">{data.sla} mins</span></p>
            <p className="text-gray-500 font-medium">Distance: <span className="font-semibold text-black">{data.distance} km</span></p>
            <p className="text-gray-500 font-medium">Item Id: <span className="font-semibold text-black">{data.item_id}</span></p>
        </div>
    </div>
}

const AddressForm = ({ title, onAddressUpdate, placesApi, onPlacesUpdate, placeDetailsApi, updateAddressDetails, addressDetails, onClear, latitude, longitude }: {
    title: string
    onAddressUpdate: (address: string) => void
    placesApi: (searchText: string, callback: (data: PlaceAutoComplete[]) => void, latitude?: number, longitude?: number) => void
    onPlacesUpdate: (places: { placeId: string, address: string, offset: number }[]) => void
    placeDetailsApi: (placeId: string, callback: (data: PlaceDetails) => void) => void
    updateAddressDetails: (data: Partial<AddressDetails>) => void
    addressDetails: AddressDetails
    onClear: () => void
    latitude?: number
    longitude?: number
}) => {
    return <div className="flex flex-col border px-1 py-4 rounded-lg relative mx-2 mb-4">
        <p className="absolute -top-4 bg-white px-3 text-lg font-semibold">{title}</p>
        <p className="absolute  top-1 right-1 underline text-sm cursor-pointer active:opacity-50" onClick={onClear}>Clear</p>
        <div className="*:m-3">
            <PlacesSearchInput label="Search Address" onChange={val => {
                onAddressUpdate(val)
                if (val.length > 2) {
                    placesApi(val, (data) => {
                        onPlacesUpdate(data.map(e => {
                            return {
                                placeId: e.placePrediction.placeId,
                                address: e.placePrediction.text.text,
                                offset: e.placePrediction.text.matches.length > 0 ? e.placePrediction.text.matches[0].endOffset : 0
                            }
                        }))
                    }, latitude, longitude)
                }
            }} autoCompleteOptions={addressDetails.placesResponse.map(e => ({ label: e.address.toString(), value: e.placeId.toString(), offset: e.offset }))}
                value={addressDetails.address} onSelect={(v) => {
                    const chosenPlace = addressDetails.placesResponse.find(e => e.placeId === v)
                    if (chosenPlace) {
                        onAddressUpdate(chosenPlace.address)
                    }
                    placeDetailsApi(v, (placeDetails) => {
                        if (chosenPlace) {
                            const formattedAddress = formatAddress(chosenPlace.address, placeDetails.addressComponents)
                            let data: Partial<AddressDetails> = {
                                latitude: placeDetails.location.latitude, longitude: placeDetails.location.longitude, geoLocation: `${placeDetails.location.latitude}, ${placeDetails.location.longitude}`,
                                addressLine1: formattedAddress.line1, addressLine2: formattedAddress.line2, pincode: formattedAddress.pincode, city: formattedAddress.city, state: formattedAddress.state
                            }
                            updateAddressDetails(data)
                        }
                    })
                }} />
            <Input label="Address Line 1" value={addressDetails.addressLine1} />
            <Input label="Address Line 2" value={addressDetails.addressLine2} />
            <div className="flex">
                <div className="mr-2">
                    <Input label="City" value={addressDetails.city} size='small' />
                </div>
                <Input label="State" value={addressDetails.state} size='small' />
            </div>
            <div className="flex items-end">
                <Input label="Pincode" value={addressDetails.pincode} size='small' />
                {addressDetails.geoLocation ? <a href={`https://maps.google.com/?q=${addressDetails.geoLocation}`} target='_blank' className="ml-2 mb-2 underline font-medium cursor-pointer text-blue-700">Map Link</a> :
                    <p className="ml-2 mb-2 underline font-medium  text-gray-400">Map Link</p>}
            </div>
        </div>
    </div>
}

export default () => {
    const { setPage, token, setToast } = useAppConfigStore(state => ({ setPage: state.setPage, token: state.token, setToast: state.setToast }))

    const { googlePlacesApi, googlePlaceDetailsApi, checkServiceability } = useOrdersStore(state => ({
        googlePlacesApi: state.googlePlacesApi,
        googlePlaceDetailsApi: state.googlePlaceDetailsApi,
        checkServiceability: state.checkServiceability
    }))

    useEffect(() => {
        setPage('serviceability')
    }, [])

    const [state, dispatch] = useReducer(reducer, initialValue)

    const onCheckServiceabilityClick = () => {
        if (state.pickupLocation.latitude && state.pickupLocation.longitude && state.dropLocation.latitude && state.dropLocation.longitude) {
            dispatch({ type: 'update', payload: { loading: true } })
            checkServiceability(token || '', { lat: state.pickupLocation.latitude, lng: state.pickupLocation.longitude, pincode: state.pickupLocation.pincode },
                { lat: state.dropLocation.latitude, lng: state.dropLocation.longitude, pincode: state.dropLocation.pincode }, state.pickupLocation.city, (success, quotes, message) => {
                    if (success) {
                        dispatch({ type: 'update', payload: { quotes, loading: false } })
                    } else {
                        dispatch({ type: 'update', payload: { loading: false } })
                        setToast(message, 'error')
                    }
                }
            )
        }
    }

    return <div>
        <TopBar title="Check Serviceability" />
        <div className="items-start *:mb-6 absolute top-12 md:top-20 bottom-2 overflow-auto py-4">
            <div className="xl:flex md:justify-around w-full md:*:mx-8 md:*:my-4">
                <AddressForm
                    title="Pick up"
                    onAddressUpdate={val => dispatch({ type: 'updatePickup', payload: { address: val } })}
                    placesApi={googlePlacesApi}
                    placeDetailsApi={googlePlaceDetailsApi}
                    onPlacesUpdate={val => {
                        dispatch({
                            type: 'updatePickup', payload: {
                                placesResponse: val
                            }
                        })
                    }}
                    updateAddressDetails={data => dispatch({ type: 'updatePickup', payload: data })}
                    addressDetails={state.pickupLocation}
                    onClear={() => dispatch({ type: 'reset', payload: { dropLocation: state.dropLocation } })}
                    latitude={state.dropLocation.latitude}
                    longitude={state.dropLocation.longitude}
                />
                <AddressForm
                    title="Drop"
                    onAddressUpdate={val => dispatch({ type: 'updateDrop', payload: { address: val } })}
                    placesApi={googlePlacesApi}
                    placeDetailsApi={googlePlaceDetailsApi}
                    onPlacesUpdate={val => {
                        dispatch({
                            type: 'updateDrop', payload: {
                                placesResponse: val
                            }
                        })
                    }}
                    updateAddressDetails={data => dispatch({ type: 'updateDrop', payload: data })}
                    addressDetails={state.dropLocation}
                    onClear={() => dispatch({ type: 'reset', payload: { pickupLocation: state.pickupLocation } })}
                    latitude={state.pickupLocation.latitude}
                    longitude={state.pickupLocation.longitude}
                />
            </div>
            <div className="flex flex-col items-center w-full">
                {state.pickupLocation.geoLocation && state.dropLocation.geoLocation ?
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=${state.pickupLocation.geoLocation}&destination=${state.dropLocation.geoLocation}&travelmode=driving`}
                        target='_blank' className="ml-2 mb-2 underline font-medium cursor-pointer text-blue-700 text-center">Map Route</a> : null}
                <div className="flex justify-center mt-4 absolute md:relative w-full">
                    <Button title="Check Serviceability" onClick={() => {
                        onCheckServiceabilityClick()
                    }} variant="primary" disabled={!state.pickupLocation.latitude || !state.pickupLocation.longitude || !state.dropLocation.latitude || !state.dropLocation.longitude} loading={state.loading} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 2xl:px-5">
                {state.quotes.map(e => {
                    return <ShowLspQuote data={e} />
                })}
            </div>
        </div>
    </div>
}