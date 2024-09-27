import TopBar from "@components/TopBar"
import { useEffect, useReducer } from "react"
import { useAppConfigStore } from "stores/appConfig"
import { useOrdersStore } from "stores/orders"
import Button from "@components/Button"
import { PriceQuote } from "@lib/interfaces"
import { AddressForm, AddressDetails } from "./AddressForm"


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
    return <div className="shadow-3xl m-4 rounded-lg w-[300px]">
        <p className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">{data.logistics_seller}</p>
        <div className="px-4 *:py-1 py-2">
            <p className="text-gray-500 font-medium">Price: <span className="font-semibold text-black">{data.price_with_gst}</span></p>
            <p className="text-gray-500 font-medium">SLA: <span className="font-semibold text-black">{data.sla} mins</span></p>
            <p className="text-gray-500 font-medium">Distance: <span className="font-semibold text-black">{data.distance} km</span></p>
            <p className="text-gray-500 font-medium">Item Id: <span className="font-semibold text-black">{data.item_id}</span></p>
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
        <div className="items-start *:mb-6 absolute top-12 md:top-20 bottom-2 overflow-auto py-4 left-1 right-1">
            <div className="xl:flex xl:justify-around w-full xl:m-1">
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
                        target='_blank' className="mb-2 underline font-medium cursor-pointer text-blue-700 text-center">Map Route</a> : null}
                <Button title="Check Serviceability" onClick={() => {
                    onCheckServiceabilityClick()
                }} variant="primary" disabled={!state.pickupLocation.latitude || !state.pickupLocation.longitude || !state.dropLocation.latitude || !state.dropLocation.longitude} loading={state.loading} />
            </div>
            <div className="flex justify-center">
                <div className="grid lg:w-[1200px] md:w-[600px]grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:px-10">
                    {state.quotes.map(e => {
                        return <ShowLspQuote data={e} />
                    })}
                </div>
            </div>
        </div>
    </div>
}