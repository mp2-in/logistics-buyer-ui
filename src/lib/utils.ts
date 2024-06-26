import axios from "axios";

import { useAppConfigStore } from 'stores/appConfig'

const apiHost = "https://preprod.logistics-buyer.mp2.in"

export const Api = (url: string, options: { method: 'post' | 'put' | 'delete' | 'get', data?: any, headers?: { [k: string]: string } }) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: `${apiHost}${url}`,
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
        if (err.response.status === 401) {
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
        data: { textQuery: searchText, locationRestriction: { rectangle: { low: { latitude: 11.812442, longitude: 77.232848 }, high: { latitude: 14.252600, longitude: 77.562438} } } }
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