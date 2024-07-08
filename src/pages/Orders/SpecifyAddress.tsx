import { getStates } from "@lib/utils"
import { PlaceAutoComplete, PlaceDetails } from "@lib/interfaces"

import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import Tab from "@components/Tab"
import Select from "@components/Select"


interface Payload {
    placesResponse: { placeId: string, address: string, offset: number }[]
    address: string
    placeId: string,
    latitude?: number
    longitude?: number
    name: string,
    phoneNumber: string,
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

export default ({ onUpdate, onPlacesSearch,onPlaceChoose, payload }: {
    onUpdate: (a: Partial<Payload>) => void, payload: Payload, onPlacesSearch: (searchText: string, callback: (data: PlaceAutoComplete[]) => void) => void,
    onPlaceChoose: (placeId: string, callback: (data: PlaceDetails) => void) => void
}) => {

    return <div className={`flex flex-col items-start`}>
        <Tab options={['Google Places', 'Manual']} onSelect={val => onUpdate({ addressOption: val === 'Google Places' ? 'google' : 'manual' })}
            selected={payload.addressOption === 'google' ? 'Google Places' : 'Manual'} />
        {payload.addressOption === 'google' ? <div>
            <PlacesSearchInput label="Address" onChange={val => {
                onUpdate({ address: val })
                if (val.length > 2) {
                    onPlacesSearch(val, (data) => {
                        console.log(data)
                        onUpdate({
                            placesResponse: data.map(e => {
                                return {
                                    placeId: e.placePrediction.placeId,
                                    address: e.placePrediction.text.text,
                                    offset: e.placePrediction.text.matches.length>0?e.placePrediction.text.matches[0].endOffset:0
                                }
                            })
                        })
                    })
                }
            }} autoCompleteOptions={payload.placesResponse.map(e => ({  label: e.address.toString(), value: e.placeId.toString(), offset: e.offset }))}
                value={payload.address} onSelect={(v) => {
                    const chosenPlace = payload.placesResponse.find(e => e.placeId === v)
                    if (chosenPlace) {
                        onUpdate({ placeId: v, address: chosenPlace.address})
                    }
                    onPlaceChoose(v, (placeDetails) => {
                        onUpdate({ placeId: v, latitude: placeDetails.location.latitude, longitude: placeDetails.location.longitude, addrComponents: placeDetails.addressComponents})
                    })
                }} />
        </div> : <div className={'flex flex-col items-start *:mb-3'}>
            <Input label="Address Line 1" value={payload.addrLine1} onChange={val => onUpdate({ addrLine1: val })} />
            <div className="flex items-center">
                <Input label="Address Line 2" value={payload.addrLine2} onChange={val => onUpdate({ addrLine2: val })} />
                <div className="ml-3">
                    <Input label="City" value={payload.city} onChange={val => onUpdate({ city: val })} size='small' />
                </div>
            </div>
            <div className={'flex items-center'}>
                <div className="mr-3">
                    <Select label="State" value={payload.state} onChange={val => onUpdate({ state: val })} options={getStates().map(e => ({ label: e, value: e }))} />
                </div>
                <Input label="Pincode" value={payload.pincode} onChange={val => /^[0-9]{0,6}$/.test(val) && onUpdate({ pincode: val })} size='small' />
            </div>
            <div className={'flex items-center'}>
                <Input label="Geolocation" value={payload.geoLocation} onChange={val => onUpdate({ geoLocation: val })} />
                {/^[0-9.]+\s*,\s*[0-9.]+$/.test(payload.geoLocation) ? <a className="ml-3 mt-3 font-bold underline cursor-pointer text-blue-500" href={`https://maps.google.com/?q=${payload.geoLocation}`} target="_blank">Maps Link</a> :
                    <a className="ml-3 mt-3 font-bold underline cursor-pointer text-blue-500" href={`https://maps.google.com`} target="_blank">Maps Link</a>}
            </div>
        </div>}
    </div>
}