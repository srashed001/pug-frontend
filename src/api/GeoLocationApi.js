




import axios from "axios";

import environment from "../environment"

const { googleApiKey } = environment;
const BASE_URL = `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleApiKey}`;

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class GeoLocationApi {

  static api_key = googleApiKey
  // the token for interactive with the API will be stored here.
  static async request(data = {}, method = "get") {
    console.debug("API Call:", data, method);

    const url = BASE_URL;
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async get(){
      let res = await this.request({}, 'post')
      return res
  }




}


export default GeoLocationApi;
