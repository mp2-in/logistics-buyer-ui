import axios from "axios";

const apiHost = "https://preprod.logistics-buyer.mp2.in"

export const Api = (url: string, options: { method: 'post' | 'put' | 'delete' | 'get', data?: any, headers?: { [k: string]: string } }) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .request({
        url: `${apiHost}${url}`,
        headers: { "content-type": "application/json" },
        ...options,
      })
      .then((respJson) => {
        if (respJson.status === 200) {
          if (['post', 'patch', 'put', 'delete'].includes(options.method)) {
            if (respJson.data["success"]) {
              resolve(respJson.data);
            } else {
              reject(respJson.data);
            }
          } else {
            resolve(respJson.data);
          }
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};