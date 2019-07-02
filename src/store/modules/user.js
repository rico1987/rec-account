import Cookies from 'js-cookie';
import { login, registerByEmail, registerByPhone, resetPassword, passwordLessLogin, loginByToken, } from '@/api/account';
import { getUnlimitedVipInfo, } from '@/api/support';
import Store from '@/utils/storage';
import { InvokeApp } from '@/utils/invoke';

const user = {
    state: {
        api_token: '',
        identity_token: '',
        userInfo: {},
        licenseInfo: {},
    },

    mutations: {
        SET_API_TOKEN: (state, api_token) => {
            state.api_token = api_token;
        },
        SET_IDENTITY_TOKEN: (state, identity_token) => {
            state.identity_token = identity_token;
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_LICENSE_INFO: (state, licenseInfo) => {
            state.licenseInfo = licenseInfo;
        },
    },

    actions: {
        UpdateUserInfo({ commit, }, userInfo) {
            return new Promise((resolve) => {
                commit('SET_USER_INFO', userInfo);
                Store.set('userInfo', userInfo);
                resolve();
            });
        },

        // 账号密码登陆
        LoginByUsername({ commit, }, loginInfo) {
            const account = loginInfo.account.trim();
            return new Promise((resolve, reject) => {
                login(account, loginInfo.password, loginInfo.language).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        InvokeApp();
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 免密登陆
        PasswordLessLogin({ commit, }, loginInfo) {
            return new Promise((resolve, reject) => {
                passwordLessLogin(loginInfo).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 邮箱注册
        EmailRegister({ commit, }, registerInfo) {
            return new Promise((resolve, reject) => {
                registerByEmail(registerInfo).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 手机注册
        PhoneRegister({ commit, }, registerInfo) {
            return new Promise((resolve, reject) => {
                registerByPhone(registerInfo).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 重置密码
        ResetPassword({ commit, }, postData) {
            return new Promise((resolve, reject) => {
                resetPassword(postData).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 获取license信息
        GetLicenseInfo({ commit, }) {
            return new Promise((resolve, reject) => {
                let saveData = Cookies.get('userInfo');
                let userInfo;
                let userId;
                try {
                    userInfo = JSON.parse(saveData);
                    userId = userInfo.user_id;
                } catch (error) {
                    reject(error);
                }

                getUnlimitedVipInfo(userId).then((response) => {
                    const data = response.data;
                    if (data && data.status === 1) {
                        commit('SET_LICENSE_INFO', data.data.license_info);
                        Store.set('license_info', data.data.license_info);
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },

        // 登出
        Logout({ commit, }) {
            return new Promise((resolve) => {
                commit('SET_API_TOKEN', '');
                commit('SET_IDENTITY_TOKEN', '');
                commit('SET_USER_INFO', {});
                commit('SET_LICENSE_INFO', {});
                Store.remove('api_token');
                Store.remove('identity_token');
                Store.remove('userInfo');
                Store.remove('license_info');
                resolve();
            });
        },

        // token登陆
        LoginByToken({ commit, }, loginInfo) {
            return new Promise((resolve, reject) => {
                loginByToken(loginInfo).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', JSON.stringify(data.data.user));
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },

        SyncLoginState({ commit, }, data) {
            return new Promise((resolve, reject) => {
                if (data.data && data.data.api_token && data.data.identity_token && data.data.user) {
                    commit('SET_API_TOKEN', data.data.api_token);
                    commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                    commit('SET_USER_INFO', data.data.user);
                    Store.set('api_token', data.data.api_token);
                    Store.set('identity_token', data.data.identity_token);
                    Store.set('userInfo', JSON.stringify(data.data.user));
                    resolve();
                } else {
                    reject();
                }
            });
        }
    },
};

export default user;