import HTTP from './default';

export default {
    authorization(refreshToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/auth/refresh',
            method: 'POST',
            data: {
                refreshToken, 
            },           
        });
    },
    getRefreshToken(data) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/auth/login',
            method: 'POST',
            data: {
                username: data.username,
                password: data.password,
            },           
        });
    },
    checkToken(accessToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/debug/me',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getInventory(accessToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/inventory',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getTable(accessToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/work/items',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
