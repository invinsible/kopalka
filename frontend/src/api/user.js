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
    checkToken(accesToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/debug/me',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accesToken}`,
            },
        });
    },
};
