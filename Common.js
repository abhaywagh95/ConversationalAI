const axios = require('axios');

/**
* Cron job function to send low balance notification email to customers.
* @param {string} method
* @param {string} baseURL
* @param {string} url
* @param {Array} parameters
* @param {Array} header
* @return {Object}
*/
const GetApiCall = async (method, baseURL, url, parameters, header ) => {

    const config = {
        method,
        baseURL,
        url,
        headers: header
    };

    if(parameters){
        const params = await paramsSerializer(parameters)
        config.url += params; 
    }

    try {
        return await axios(config);
    } catch (error) {
        return error;
    }
}

async function paramsSerializer(params) {       
    return Object.entries(Object.assign({}, params)).
      map(([key, value]) => `${key}=${value}`).
      join('&');
}

module.exports = { GetApiCall };