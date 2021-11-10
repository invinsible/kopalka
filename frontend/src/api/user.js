import HTTP from './default';

export default {
    authorization(data) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/auth/login',
            method: 'POST',
            data: {
                username: data.username,
                password: data.password,
            },           
        });
    },
    checkToken(token) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/debug/me',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};
