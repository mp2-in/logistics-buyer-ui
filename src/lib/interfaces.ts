export interface Order {
    orderId: string
    bppId: string
    clientOrderId: string
    networkOrderId: string
    orderState: string
    selectionMode: string
    createdAt: string
    deliveryFee: number
    platformFee: number
    orderCategory: string
    orderAmount: number
    pcc: string
    pickupOtp: string
    dcc: string
    cancelledBy: string
    cancellationReason: string
    storeId: string
    trackingUrl: string
    priceWithGST: number
    rtsAt: string
    providerId: string
    city: string
    pickupName: string
    pickupLatitude: number
    pickupLongitude: number
    pickupAddress: {
        name: string
        line1: string
        line2: string
        city: string
        state: string
    },
    pickupPincode: string
    pickupPhone: string
    dropName: string
    dropLatitude: number
    dropLongitude: number
    dropAddress: {
        name: string
        line1: string
        line2: string
        city: string
        state: string
    },
    dropPincode: string
    dropPhone: string
    distance: number
    assignedAt: string
    atpickupAt: string
    atdeliveryAt: string
    pickedupAt: string
    deliveredAt: string
    cancelledAt: string
    rtoPickedupAt: string
    rtoDeliveredAt: string
    riderName: string
    riderNumber: string
    pickupProof: string
    deliveryProof: string
    "f.distance": number
}

export interface PlaceDetails {
    id: string
    shortFormattedAddress: string
    location: {
        latitude: number
        longitude: number
    }
    displayName: {
        text: string
    }
    addressComponents: {
        longText: string
        types: string[]
    }[]
}

export interface PlaceAutoComplete {
    placePrediction: {
        placeId: string
        text: {
            text: string
            matches: {
                endOffset: number
            }[]
        }
    }
}

export interface PickupStore {
    storeId: string
    accountId: string
    latitude: number
    longitude: number
    address: {
        name: string
        line1: string
        line2: string
        city: string
        state: string
    }
    pincode: string
    phone: string
    googlePlaceId: string
}

export interface LocationAddress {
    lat: number
    lng: number
    address: {
        name: string
        line1: string
        line2: string
        city: string
        state: string
    }
    pincode: string
    phone: string
    code?: string
}

export interface PriceQuote {
    lsp_id: string
    item_id: string
    sla: number
    pickup_eta: number
    price_forward: number
    price_rto: number
    logistics_seller: string
    price_with_gst: number
}

export interface Issue {
    issueId: string,
    networkOrderId: string,
    orderId: string,
    clientOrderId: string,
    accountId: string,
    issueStatus: string,
    resolutionStatus: string,
    createdat: string,
    statusUpdatedat: string,
    relayedat: string,
    closedat: string,
    updatedat: string,
    category: string,
    subCategory: string,
    shortDescription: string,
    longDescription: string,
    resolutionAction: string,
    resolutionDescription: string,
    refundAmount: number
}

export interface User {
    phoneNumber:string,
    username: string,
    accountIds: string
    role: string
    mailId: string
}