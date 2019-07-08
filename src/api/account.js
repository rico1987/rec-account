import qs from 'qs';
import accountFetch from '../utils/accountFetch';
import * as is from '../utils/is';
import { objToQuery, } from '../utils/index';

export function queryLoginState(data) {
    const postData = {
        qrcode_key: data.qrcode_key,
        language: data.language,
        brand: 'Apowersoft',
        registed_app: data.registed_app,
    };
    return accountFetch.post('/sessions', qs.stringify(postData));
}

export function getQrCode(language) {
    return accountFetch.get(`qrcode${objToQuery({
        brand: 'Apowersoft',
        language,
    })}`);
}

export function login(account, password, language) {
    const data = {
        password,
        brand: 'Apowersoft',
        language,
    };
    if (is.isEmail(account)) {
        data.email = account;
    } else {
        data.telephone = account;
    }
    return accountFetch.post('/sessions', qs.stringify(data));
}

export function loginByToken(data) {
    const postData = {
        identity_token: data.identity_token,
        brand: 'Apowersoft',
        language: data.language,
    };
    return accountFetch.post('/sessions', qs.stringify(postData));
}

export function passwordLessLogin(data) {
    return accountFetch.post('/sessions', qs.stringify(Object.assign(data, {
        brand: 'Apowersoft',
        registed_app: 'ApowerRec',
    })));
}

export function register(data) {
    return accountFetch.post('/users', qs.stringify(data));
}

export function changeAvatar() {

}

export function bindEmail(userId, email, vcode, language) {
    return accountFetch.put(`/users/${userId}/bindings/contactinfo`, qs.stringify({
        brand: 'Apowersoft',
        language,
        email,
        captcha: vcode,
    }));
}

export function bindPhone(userId, phone, vcode, areaCode, language) {
    return accountFetch.put(`/users/${userId}/bindings/contactinfo`, qs.stringify({
        brand: 'Apowersoft',
        language,
        telephone: phone,
        captcha: vcode,
        country_code: areaCode,
    }));
}

export function changePassword(data) {
    return accountFetch.put(`/users/${data.account}/passwords`, qs.stringify({
        brand: 'Apowersoft',
        password: data.password,
        password2: data.confirmPassword,
        language: data.language,
    }));
}

export function updateUserInfo() {

}

export function getAreaCodes(language) {
    return accountFetch.get(`countrycodes${objToQuery({
        brand: 'Apowersoft',
        language,
    })}`);
}

export function sendVcode(data) {
    return accountFetch.post('/captchas', qs.stringify(Object.assign(data, {
        brand: 'Apowersoft',
    })));
}

export function resetPassword(data) {
    return accountFetch.put('/passwords', qs.stringify(Object.assign(data, {
        brand: 'Apowersoft',
    })));
}

export function validateEmail(data) {
    return accountFetch.get(`validation${objToQuery({
        brand: 'Apowersoft',
        email: data.email,
        language: data.language,
    })}`);
}


export function validateAccount(data) {
    return accountFetch.get(`validation${objToQuery(Object.assign(data, {
        brand: 'Apowersoft',
    }))}`);
}