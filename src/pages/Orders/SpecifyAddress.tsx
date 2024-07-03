import { getStates } from "@lib/utils"
import { Place } from "@lib/interfaces"

import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import Tab from "@components/Tab"
import Select from "@components/Select"


interface Payload {
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

export default ({ onUpdate, onPlacesSearch, payload }: {
    onUpdate: (a: Partial<Payload>) => void, payload: Payload, onPlacesSearch: (searchText: string,
        callback: (data: Place[]) => void) => void
}) => {

    return <div className={`flex flex-col items-start`}>
        <Tab options={['Google Places', 'Manual']} onSelect={val => onUpdate({ addressOption: val === 'Google Places' ? 'google' : 'manual' })}
            selected={payload.addressOption === 'google' ? 'Google Places' : 'Manual'} />
        {payload.addressOption === 'google' ? <div>
            <PlacesSearchInput label="Address" onChange={val => {
                onUpdate({ address: val })
                if (val.length > 2) {
                    onPlacesSearch(val, (data) => {
                        onUpdate({
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
                        })
                    })
                }
            }} autoCompleteOptions={payload.placesResponse.filter(e => e.name && e.address && e.id).map(e => ({ name: e.name.toString(), address: e.address.toString(), value: e.id.toString() }))}
                value={payload.address} onSelect={(v) => {
                    const chosenPlace = payload.placesResponse.find(e => e.id === v)
                    if (chosenPlace) {
                        onUpdate({ placeId: v, address: chosenPlace.address, name: payload.name || chosenPlace.name })
                    }
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