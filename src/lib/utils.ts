import axios from "axios";

import { useAppConfigStore } from 'stores/appConfig'

const apiHost = import.meta.env.VITE_ENV === 'PROD' ? "https://ondc-logistics.mp2.in" : "https://preprod.logistics-buyer.mp2.in"
const googleApiKey = 'AIzaSyCjJ17_wImrwzxtfqmZ8hq168NXx19qoo4'

export const Api = (url: string, options: { method: 'post' | 'put' | 'delete' | 'get', data?: any, headers?: { [k: string]: string } }, withCredentials?: boolean) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: `${apiHost}${url}`,
        withCredentials: withCredentials || false,
        ...options,
      })
      .then((respJson) => {
        if (respJson.status === 200) {
          resolve(respJson.data);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        if (err.response?.status === 401 && !url.includes('verifyOTP')) {
          useAppConfigStore.getState().clearAuth()
          window.location.reload()
        }
        reject(err);
      });
  });
};

// mahesh: ideally, this should also lat, lng as params. For Add Outlet, there should be no location bias.
// For add drop address, there should be a locationBias with a radius of 15km  with center of pickup's lat,lng such as
// {"locationBias": {"circle": {"center": {"latitude": store_lat, "longitude": store_lng },"radius": 15000.0}}
export const GooglePlacesApi = (searchText: string, latitude?: number, longitude?: number) => {
  let data = {};

  if(latitude && longitude) {
    data = { input: searchText, locationBias: {circle: {center: {latitude, longitude}, radius: 20000}} };
  } else {
    data = { input: searchText, includedRegionCodes: ["in"] }
  }

  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: 'https://places.googleapis.com/v1/places:autocomplete',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleApiKey,
        },
        data
      })
      .then((respJson) => {
        if (respJson.status === 200) {
          resolve(respJson.data);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const PlaceDetailsApi = (placeId: string) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: `https://places.googleapis.com/v1/places/${placeId}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleApiKey,
          'X-Goog-FieldMask': 'displayName,shortFormattedAddress,id,location,addressComponents'
        }
      })
      .then((respJson) => {
        if (respJson.status === 200) {
          resolve(respJson.data);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const formatAddress = (address: string, components: { longText: string, types: string[] }[]) => {
  let city = ''
  let state = ''
  let pincode = ''

  for (let i = 0; i < components.length; i++) {
    if (components[i].types.includes('locality')) {
      city = components[i].longText
    }

    if (components[i].types.includes('postal_code')) {
      pincode = components[i].longText
    }

    if (components[i].types.includes('administrative_area_level_1')) {
      state = components[i].longText
    }
  }

  const modifiedAddress = address.replace(/,\s*india/i,'').replace(new RegExp(`,\\s*${state}`, 'i'),'').replace(new RegExp(`,\\s*${city}`, 'i'),'')
  const addressSplit = modifiedAddress.split(/\s*,\s*/)
  let addrLine1: string[] = []
  let addrLine2: string[] = []

  let line1Complete = false

  for (let i = 0; i < addressSplit.length; i++) {
    if (!line1Complete && [...addrLine1, addressSplit[i]].join(',').length < modifiedAddress.length / 2) {
      addrLine1.push(addressSplit[i])
    } else if (!line1Complete) {
      line1Complete = true
    }

    if (line1Complete) {
      addrLine2.push(addressSplit[i])
    }
  }

  return { line1: addrLine1.join(', '), line2: addrLine2.join(', '), city, pincode, state }
}

export const getStates = () => {
  return ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
    'Goa', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry']
}


export const cancellationIdReasonMapping:{[k: string]: string} = {
  "002": 'One or more items in the Order not available',
  "005": 'Merchant rejected the order',
  "006": 'Order not shipped as per buyer app SLA',
  "010": 'Buyer wants to modify details',
  "012": 'Buyer does not want product any more',
}

export const cancellable = (orderState: string) => {
  return ['Pending', 'Accepted', 'UnFulFilled', 'Searching-for-Agent', 'Agent-assigned', 'At-pickup', 'UnFulfilled'].includes(orderState)
}