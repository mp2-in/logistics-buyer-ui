export interface Order {
    orderId: string
    clientOrderId: string
    networkOrderId: string
    accountId: string
    orderState: string
    selectionMode: string
    createdAt: string
    lastupdatedat: string
    promisedDeliveryTime: string
    totalDeliveryCharge: number
    platformFee: number
    rts: number
    rtsAt: string
    orderCategory: string
    searchCategory: string
    orderAmount: number
    pcc: string
    dcc: string
    source: string
    loggedinUserphone: string,
    callbackUrl: string,
    cancelledBy: string,
    cancellationReason: string,
    storeId: string
    buyerName: string
    transactionId: string
    fulfillmentState: string
    bppId: string
    bppUri: string
    providerId: string
    skuId: string
    city: string
    price: number
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
    assignedAt: string,
    atpickupAt: string,
    pickedupAt: string,
    deliveredAt: string,
    cancelledAt: string,
    rtoPickedupAt: string,
    rtoDeliveredAt: string,
    pickupProof: string
    deliveryProof: string
    riderName: string
    riderNumber: string
    note1: string,
    note2: string,
    trackingUrl: string
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
}