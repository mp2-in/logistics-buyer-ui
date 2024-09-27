import PlacesSearchInput from "@components/PlacesSearchInput"
import { formatAddress } from "@lib/utils"
import Input from "@components/Input"
import { PlaceAutoComplete, PlaceDetails } from "@lib/interfaces"

export interface AddressDetails {
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

export const AddressForm = ({ title, onAddressUpdate, placesApi, onPlacesUpdate, placeDetailsApi, updateAddressDetails, addressDetails, onClear, latitude, longitude }: {
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
    return <div className="flex flex-col border px-5 py-8 rounded-lg relative mx-2 mb-4">
        <p className="absolute -top-4 bg-white px-3 text-lg font-semibold">{title}</p>
        <p className="absolute  top-1 right-1 underline text-sm cursor-pointer active:opacity-50" onClick={onClear}>Clear</p>
        <div>
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
            <div className="flex flex-col *:my-2 mt-3">
                <Input label="Address Line 1" value={addressDetails.addressLine1} readOnly />
                <Input label="Address Line 2" value={addressDetails.addressLine2} readOnly />
                <div className="flex">
                    <div className="mr-2">
                        <Input label="City" value={addressDetails.city} size='small' readOnly />
                    </div>
                    <Input label="State" value={addressDetails.state} size='small' readOnly />
                </div>
                <div className="flex items-end">
                    <Input label="Pincode" value={addressDetails.pincode} size='small' readOnly />
                    {addressDetails.geoLocation ? <a href={`https://maps.google.com/?q=${addressDetails.geoLocation}`} target='_blank' className="ml-2 mb-2 underline font-medium cursor-pointer text-blue-700">Map Link</a> :
                        <p className="ml-2 mb-2 underline font-medium  text-gray-400">Map Link</p>}
                </div>
            </div>
        </div>
    </div>
}