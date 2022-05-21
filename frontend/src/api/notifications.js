import HTTP from './default';
const accessToken = localStorage.getItem('accessToken');
export default {
    getNotifications() {
        return HTTP({
            url: '/notifications',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};
