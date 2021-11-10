import HTTP from './default';

export default {
    getUserInfo(id, token) {
        return HTTP({
            url: `/users/${id}/`,
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    },
};
