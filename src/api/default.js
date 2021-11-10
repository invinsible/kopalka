import axios from 'axios';

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
    if (response?.data?.error_text === 'Недопустимый токен.') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        window.location.reload();
    }
    return response;
}, function(error) {
    console.log('error', error);

    return Promise.reject(error);
});

export default HTTP;
