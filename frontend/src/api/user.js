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

    getStatus(accessToken){
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/work/status',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    startWork(accessToken){
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/work/start',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    getRandomMaze(accessToken){
        return HTTP({
            url: 'http://localhost:3000/maze/generate',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
