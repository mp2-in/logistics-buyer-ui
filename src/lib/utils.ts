import axios from "axios";

import { useAppConfigStore } from 'stores/appConfig'

const apiHost = "https://preprod.logistics-buyer.mp2.in"

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
        if (err.response?.status === 401 && !url.includes('login')) {
          useAppConfigStore.getState().clearAuth()
          window.location.reload()
        }
        reject(err);
      });
  });
};


export const GooglePlacesApi = (searchText: string) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: 'https://places.googleapis.com/v1/places:searchText',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AIzaSyCjJ17_wImrwzxtfqmZ8hq168NXx19qoo4',
          'X-Goog-FieldMask': 'places.displayName,places.shortFormattedAddress,places.id,places.location,places.addressComponents'
        },
        data: { textQuery: searchText, locationRestriction: { rectangle: { low: { latitude: 11.812442, longitude: 77.232848 }, high: { latitude: 14.252600, longitude: 77.562438 } } } }
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

export const formatAddress = (address: string, components: { longText: string, types: string[]}[]) => {
  const addressSplit = address.split(/\s*,\s*/)
  let addrLine1: string[] = []
  let addrLine2: string[] = []
  let city = ''
  let state = ''
  let pincode = ''

  let line1Complete = false

  for (let i = 0; i < addressSplit.length; i++) {
    if (!line1Complete && [...addrLine1, addressSplit[i]].join(',').length < address.length / 2) {
      addrLine1.push(addressSplit[i])
    } else if(!line1Complete) {
      line1Complete = true
    }

    if(line1Complete) {
      addrLine2.push(addressSplit[i])
    }
  }

  for(let i=0;i<components.length;i++) {
    if(components[i].types.includes('locality')) {
      city = components[i].longText
    }

    if(components[i].types.includes('postal_code')) {
      pincode = components[i].longText
    }

    if(components[i].types.includes('administrative_area_level_1')) {
      state = components[i].longText
    }
  }

  return {line1: addrLine1.join(', '), line2: addrLine2.join(', '), city, pincode, state}
}