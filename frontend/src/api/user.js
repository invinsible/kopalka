import HTTP from './default';
const accessToken = localStorage.getItem('accessToken');

export default {
    authorization(refreshToken) {
        return HTTP({
            url: '/auth/refresh',
            method: 'POST',
            data: {
                refreshToken,
            },
        });
    },
    getRefreshToken(data) {
        return HTTP({
            url: '/auth/login',
            method: 'POST',
            data: {
                username: data.username,
                password: data.password,
            },
        });
    },
    checkToken() {
        return HTTP({
            url: '/user/me',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getInventory() {
        return HTTP({
            url: '/inventory',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getTable() {
        return HTTP({
            url: '/work/items',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    getStatus(){
        return HTTP({
            url: '/work/status',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    startWork(){
        return HTTP({
            url: '/work/start',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    startMaze(){
        return HTTP({
            url: '/maze/start',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    getMaze(mazeId) {
        return HTTP({
            url: '/maze/instance/' + mazeId,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    getCurrentMaze() {
        return HTTP({
            url: '/maze/current',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    getRandomMaze(){
        return HTTP({
            url: '/maze/generate',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    moveInMaze(direction){
        return HTTP({
            url: '/maze/move',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                direction,
            },
        });
    },

    exit(){
        return HTTP({
            url: '/maze/exit',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
