import Input from "@components/Input"
import PlacesSearchInput from "@components/PlacesSearchInput"
import { useOrdersStore } from "stores/orders"
import Select from "./Select"
import { formatAddress } from "@lib/utils"
import { OrderFormData } from "./interfaces"


export default ({ data, update }: { data: OrderFormData, update: (d: Partial<OrderFormData>) => void }) => {
    const { googlePlacesApi, googlePlaceDetailsApi, pickupStores } = useOrdersStore(state => ({
        googlePlacesApi: state.googlePlacesApi,
        googlePlaceDetailsApi: state.googlePlaceDetailsApi,
        pickupStores: state.pickupStores,
    }))

    return <div className="px-6 py-1 absolute top-[60px] bottom-[200px] overflow-auto">
        <p className="text-gray-700 text-xl font-semibold">Pickup Details</p>
        <div className="my-3">
            <Select label="Pickup From" options={[...pickupStores].sort((a, b) => a.address.name < b.address.name ? -1 : 1).map(e => ({ label: `${e.address.name} (${e.phone})`, value: e.storeId }))}
                onChange={val => {
                    const store = pickupStores.find(e => e.storeId === val)
                    update({ storeId: val, storeLatitude: store?.latitude, storeLongitude: store?.longitude })
                }} value={data.storeId} hideSearch size="large" required />
            <div className="flex justify-between items-center mt-2">
                <p className="font-semibold underline text-dark-midnight" onClick={() => update({ showAddAddress: true })}>Add Address</p>
                <p className={`font-semibold underline text-dark-midnight ${!data.storeId ? 'opacity-45' : ''}`}
                    onClick={() => data.storeId && update({ showAddAddress: true })}>Edit Address</p>
            </div>
            <div className="flex my-4">
                <Input label="Bill Number" size='small' required value={data.billNumber} onChange={val => update({ billNumber: val })} />
                <div className="ml-4">
                    <Input label="Order Amount" size='small' required onChange={val => update({ orderAmount: val })} />
                </div>
            </div>
            <Input label="Pickup OTP" size='small' required onChange={val => update({ pickupOtp: val })}/>
        </div>
        <p className="text-gray-700 text-xl font-semibold mb-2">Drop Details</p>
        <div className="my-1 *:my-2">
            <Input label="Pone Number" size='small' required onChange={val => update({ phoneNumber: val })} value={data.phoneNumber} />
            <Input label="Name" required value={data.name} onChange={val => update({ name: val })} />
            <div>
                <PlacesSearchInput label="Search Address" onChange={val => {
                    update({ address: val })
                    if (val.length > 2) {
                        googlePlacesApi(val, (data) => {
                            update({
                                placesResponse: data.map(e => {
                                    return {
                                        placeId: e.placePrediction.placeId,
                                        address: e.placePrediction.text.text,
                                        offset: e.placePrediction.text.matches.length > 0 ? e.placePrediction.text.matches[0].endOffset : 0
                                    }
                                })
                            })
                        }, data.storeLatitude, data.storeLongitude)
                    }
                }} autoCompleteOptions={data.placesResponse.map(e => ({ label: e.address.toString(), value: e.placeId.toString(), offset: e.offset }))}
                    value={data.address} onSelect={(v) => {
                        const chosenPlace = data.placesResponse.find(e => e.placeId === v)
                        if (chosenPlace) {
                            update({ dropPlaceId: v, address: chosenPlace.address })
                        }
                        googlePlaceDetailsApi(v, (placeDetails) => {
                            if (chosenPlace) {
                                const formattedAddress = formatAddress(chosenPlace.address, placeDetails.addressComponents)
                                update({
                                    dropFormattedAddressLine1: formattedAddress.line1, state: formattedAddress.state,
                                    dropFormattedAddressLine2: formattedAddress.line2, city: formattedAddress.city, pincode: formattedAddress.pincode
                                })
                            }
                        })
                    }} />
            </div>
            <Input label="Flat no/Building Name" readOnly value={data.dropFormattedAddressLine1} />
            <Input label="Area/Street" readOnly value={data.dropFormattedAddressLine2} />
            <div className="flex">
                <Input label="City" readOnly value={data.city} size="small" />
                <div className="ml-3">
                    <Input label="Pincode" readOnly value={data.pincode} size="small" />
                </div>
            </div>
            <Input label="Drop/RTO OTP" size='small' />
        </div>
    </div>
}