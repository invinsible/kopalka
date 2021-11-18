import HTTP from './default';

export default {
    getNotifications(accessToken) {
        return HTTP({
            url: 'https://kopalka.paaashka.ru/api/notifications',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
