import { formatAddress, getStates } from "@lib/utils"
import { PlaceAutoComplete, PlaceDetails } from "@lib/interfaces"

import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import Select from "@components/Select"
import trackIcon from '@assets/track.png'


interface Payload {
    placesResponse: { placeId: string, address: string, offset: number }[]
    address: string
    placeId: string,
    latitude?: number
    longitude?: number
    name: string,
    phoneNumber: string,
    storeId: string,
    addrLine1: string
    addrLine2: string
    city: string
    state: string
    pincode: string
    geoLocation: string
}

export default ({ onUpdate, onPlacesSearch, onPlaceChoose, payload, module, storeLocation }: {
    onUpdate: (a: Partial<Payload>) => void, 
    payload: Payload, 
    onPlacesSearch: (searchText: string, callback: (data: PlaceAutoComplete[]) => void, 
    latitude?:number, 
    longitude?: number) => void,
    onPlaceChoose: (placeId: string, callback: (data: PlaceDetails) => void) => void,
    module?: string, 
    storeLocation?: {lat: number, lng: number}
}) => {

    return <div className={`flex flex-col items-start`}>
        <div className={'flex flex-col items-start md:*:my-1 *:my-2'}>
            <PlacesSearchInput label="Search Address" onChange={val => {
                onUpdate({ address: val })
                if (val.length > 2) {
                    onPlacesSearch(val, (data) => {
                        onUpdate({
                            placesResponse: data.map(e => {
                                return {
                                    placeId: e.placePrediction.placeId,
                                    address: e.placePrediction.text.text,
                                    offset: e.placePrediction.text.matches.length > 0 ? e.placePrediction.text.matches[0].endOffset : 0
                                }
                            })
                        })
                    }, storeLocation?.lat, storeLocation?.lng)
                }
            }} autoCompleteOptions={payload.placesResponse.map(e => ({ label: e.address.toString(), value: e.placeId.toString(), offset: e.offset }))}
                value={payload.address} onSelect={(v) => {
                    const chosenPlace = payload.placesResponse.find(e => e.placeId === v)
                    if (chosenPlace) {
                        onUpdate({ placeId: v, address: chosenPlace.address })
                    }
                    onPlaceChoose(v, (placeDetails) => {
                        if (chosenPlace) {
                            const formattedAddress = formatAddress(chosenPlace.address, placeDetails.addressComponents)
                            let data: Partial<Payload> = {
                                placeId: v, latitude: placeDetails.location.latitude, longitude: placeDetails.location.longitude, geoLocation: `${placeDetails.location.latitude}, ${placeDetails.location.longitude}`,
                                addrLine1: formattedAddress.line1, addrLine2: formattedAddress.line2, pincode: formattedAddress.pincode
                            }
                            if (module === 'addOutlet') {
                                data.state = formattedAddress.state
                                data.city = formattedAddress.city
                            }
                            onUpdate(data)
                        }
                    })
                }} />
            <Input label="Address Line 1" value={payload.addrLine1} onChange={val => onUpdate({ addrLine1: val })} />
            <div className="md:flex md:items-center">
                <Input label="Address Line 2" value={payload.addrLine2} onChange={val => onUpdate({ addrLine2: val })} />
                <div className="md:ml-3 mt-3 md:mt-0">
                    <Input label="Pincode" value={payload.pincode} onChange={val => /^[0-9]{0,6}$/.test(val) && onUpdate({ pincode: val })} size='small' />
                </div>
            </div>
            <div className={'md:flex md:items-center'}>
                <div className="md:mr-3 mb-3 md:mb-0">
                    {module === 'addOrder'?<Input label="State" value={payload.state} readOnly/>:
                    <Select label="State" value={payload.state} onChange={val => onUpdate({ state: val })} options={getStates().map(e => ({ label: e, value: e }))} hideSearch  />}
                </div>
                <Input label="City" value={payload.city} onChange={val => onUpdate({ city: val })} size='small' readOnly={module === 'addOrder'} />
            </div>
            <div className={'flex items-center'}>
                <Input label="Geolocation" value={payload.geoLocation} onChange={val => onUpdate({ geoLocation: val })} />
                <div className="hidden md:block">
                    {/^[0-9.]+\s*,\s*[0-9.]+$/.test(payload.geoLocation) && storeLocation ? <a className="ml-3 mt-3 font-bold underline cursor-pointer text-blue-500" href={`https://www.google.com/maps/dir/?api=1&origin=${storeLocation.lat},${storeLocation.lng}&destination=${payload.geoLocation}&travelmode=driving`} target="_blank">Maps Link</a> :
                        /^[0-9.]+\s*,\s*[0-9.]+$/.test(payload.geoLocation) ? <a className="ml-3 mt-3 font-bold underline cursor-pointer text-blue-500" href={`https://maps.google.com/?q=${payload.geoLocation}`} target="_blank">Maps Link</a> :
                            <a className="ml-3 mt-3 font-bold underline cursor-pointer text-blue-500" href={`https://maps.google.com`} target="_blank">Maps Link</a>}
                </div>
                <div className="md:hidden w-6 ml-2">
                    {/^[0-9.]+\s*,\s*[0-9.]+$/.test(payload.geoLocation) && storeLocation ?
                        <a href={`https://www.google.com/maps/dir/?api=1&origin=${storeLocation.lat},${storeLocation.lng}&destination=${payload.geoLocation}&travelmode=driving`} target="_blank"><img src={trackIcon} /></a> :
                        /^[0-9.]+\s*,\s*[0-9.]+$/.test(payload.geoLocation) ? <a href={`https://maps.google.com/?q=${payload.geoLocation}`} target="_blank"><img src={trackIcon} /></a> :
                            <a href={`https://maps.google.com`} target="_blank"><img src={trackIcon} /></a>}
                </div>
            </div>
        </div>
    </div>
}