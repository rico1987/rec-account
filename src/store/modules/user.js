import Cookies from 'js-cookie';
import { login, register, resetPassword, passwordLessLogin, loginByToken, stat } from '@/api/account';
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
            stat('rec_in_software_purchase', '登陆成功');
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
		UpdateIdentityToken({ commit, }, identity_token) {
            return new Promise((resolve) => {
                commit('SET_IDENTITY_TOKEN', identity_token);
                Store.set('identity_token', identity_token);
                resolve();
            });
		},
		
        UpdateUserInfo({ commit, }, userInfo) {
            return new Promise((resolve) => {
                commit('SET_USER_INFO', userInfo);
                Store.set('userInfo', userInfo);
                resolve();
            });
        },

        // 账号密码登录
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
                        InvokeApp('update-passport-info', {
                            'data': {
								user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
								license_info: {},
                            },
                        });
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        // 免密登录
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
						InvokeApp('update-passport-info', {
                            'data': {
								user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
								license_info: {},
                            },
                        });
                        resolve();
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },

        Register({ commit, }, registerInfo) {
            return new Promise((resolve, reject) => {
                register(registerInfo).then((response) => {
                    const data = response.data;
                    if (data && data.status === '1') {
                        commit('SET_API_TOKEN', data.data.api_token);
                        commit('SET_IDENTITY_TOKEN', data.data.identity_token);
                        commit('SET_USER_INFO', data.data.user);
                        Store.set('api_token', data.data.api_token);
                        Store.set('identity_token', data.data.identity_token);
                        Store.set('userInfo', data.data.user);
                        InvokeApp('update-passport-info', {
                            'data': {
								user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
								license_info: {},
                            },
                        });
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
                        InvokeApp('update-passport-info', {
                            'data': {
								user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
								license_info: {},
                            },
                        });
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
                Store.remove('licenseInfo');
                Store.remove('userInfo');
                InvokeApp('update-passport-info', {'data': {}});
                InvokeApp('update-app-passport-info', {'data': {}});
                // 清空所有cookie
                const cookieKeys = Object.keys(Cookies.get());
                for (let i = 0, l = cookieKeys.length; i < l; i++) {
                    Cookies.remove(cookieKeys[i]);
                }
                resolve();
            });
        },

        // token登录
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
						Store.set('userInfo', data.data.user);
                        InvokeApp('update-passport-info', {
                            'data': {
								user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
								license_info: {},
                            },
                        });
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
					Store.set('userInfo', data.data.user);
					InvokeApp('update-passport-info', {
						'data': {
							user_info: Object.assign(data.data.user, {identity_token: data.data.identity_token}),
							license_info: {},
						},
					});
                    resolve();
                } else {
                    reject();
                }
            });
        }
    },
};

export default user;
