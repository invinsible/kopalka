import {emailRegexp} from '../consts/regexp';

export const isEmail = email => {
    if (email && email.length) {
        return emailRegexp.test(String(email.trim()).toLowerCase());
    }

    return false; // if empty, its not email
};
