import HTTP from './default';

export default {
    authorization(data) {
        return HTTP({
            url: '/auth/login/',
            method: 'GET',
            data: {
                username: data.username,
                password: data.password,
            },           
        });
    },
    // getUser(id, token) {
    //     return HTTP({
    //         url: `/users/${id}/`,
    //         method: 'GET',
    //         headers: {
    //             Authorization: `Token ${token}`,
    //         },
    //     });
    // },
};
