import axios from 'axios';
import store from '../store';

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

const HTTP = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    headers: {
        'Content-type': 'application/json',
    },
    validateStatus(status) {
        return status >= 200 && status <= 500;
    },
});

HTTP.interceptors.response.use(function(response) {
    if (response.config.url.includes('/debug/me') && response.status === 401) {
        localStorage.removeItem('accesToken');
        store.dispatch('getAccessToken', store.getters.refreshToken);                
    }
    return response;
}, function(error) {
    console.log('error', error);
    return Promise.reject(error);
});

export default HTTP;
