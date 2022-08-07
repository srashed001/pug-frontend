import axios from "axios";

import { googleApiKey } from "../environment";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class NeabySearchApi {
  // the token for interactive with the API will be stored here.

  static async request({lat, lng}) {

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
        key: googleApiKey, 
        keyword: 'basketball courts',
        radius: 1500,
        location: `${lat},${lng}`
    }
    const method = 'get'
    const headers = {"Access-Control-Allow-Origin": "http://localhost:3000"}

    try {
      return (await axios({ url, method, params, headers })).data;
    } catch (err) {
      console.log("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async get(location){
      let res = await this.request(location)
      return res
  }

}




export default NeabySearchApi;

// 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyApojF0t8e5G5hTZuwtV3D_3Rimwd2M-NE'