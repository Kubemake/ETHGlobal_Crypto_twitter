import Axios from "axios";
import config from '../../config';

const initializers = {};

function returnAxiosInstance() {
    return Axios.create(initializers);
}

export async function get(url) {
    const axios = await returnAxiosInstance();
    return axios.get(config.backendApiBaseUrl + url);
}

export async function post(url, requestData) {
    const axios = await returnAxiosInstance();
    return axios.post(config.backendApiBaseUrl + url, requestData);
}

export async function getLastTweets(limit = 10, offset = 0) {
    const result = await get('list?limit=' + limit + '&offset=' + offset);
    return result.data;
}