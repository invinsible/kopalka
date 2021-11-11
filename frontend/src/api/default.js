import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import store from '../store';

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

const HTTP = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    headers: {
        'Content-type': 'application/json',
    },
});

const refreshAuthLogic = async failedRequest => {
    const response = await store.dispatch('getAccessToken', store.getters.refreshToken);    
    failedRequest.response.config.headers.Authorization = 'Bearer ' + response.data.accessToken;
    return Promise.resolve();
};

createAuthRefreshInterceptor(HTTP, refreshAuthLogic);

export default HTTP;
