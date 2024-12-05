export interface OrderFormData {
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
    phoneNumber: string
    name: string
    state: string
    billNumber: string
    orderAmount: string
    showQuotes: boolean
    pickupOtp: string
    quote?: {
        minPrice: number
        maxPrice: number
        distance: number
        pickupEta: number
        sla: number
    }
}