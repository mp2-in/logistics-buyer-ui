export interface Order {
    [k: string]: any,
    id: string,
    client_order_id: string,
    state: string,
    lsp: {
        id: string,
        name: string,
        item_id: string,
        network_order_id: string
    },
    price: number,
    distance: number,
    rider: {
        name: string,
        phone: string
    }
    created_at: string,
    assigned_at: string,
    pickedup_at: string,
    delivered_at: string,
    cancelled_at: string
}

export interface Place {
    id: string,
    shortFormattedAddress: string,
    location: {
        latitude: number,
        longitude: number
    },
    displayName: {
        text: string,
    },
    addressComponents: {
        longText: string,
        types: string[]
    }[]
}

export interface PickupStore {
    storeId: string,
    accountId: string,
    latitude: number,
    longitude: number,
    address: {
        name: string,
        line1: string,
        line2: string,
        city: string,
        state: string
    },
    pincode: string,
    phone: string,
    googlePlaceId: string
}

export interface DropLocation {
    lat: number,
    lng: number,
    address: {
        name: string,
        line1: string,
        line2: string,
        city: string,
        state: string
    },
    pincode: string,
    phone: string,
    code: string
}

export interface PriceQuote {
    lsp_id: string,
    item_id: string,
    sla: number,
    pickup_eta: number,
    price_forward: number,
    price_rto: number,
    logistics_seller: string
}