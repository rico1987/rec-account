import Store from '@/utils/storage';
import { getLicenseInfo } from '@/api/support';
import { InvokeApp } from '@/utils/invoke';


const app = {
    state: {
        appInfo: {},
        licenseInfo: {},
        isLogined: false,
        willGoToBuy: false,
    },
    mutations: {
        SET_APP_INFO: (state, data) => {
            state.appInfo = data;
        },

        SET_LICENSE_INFO: (state, data) => {
            state.licenseInfo = data;
        },
        
        SET_WILL_GO_TO_BUY: (state, data) => {
            state.willGoToBuy = data;
        },
    },
    actions: {

        setWillGoToBuy({ commit, }, data) {
            commit('SET_WILL_GO_TO_BUY', data);
            Store.set('willGoToBuy', data);
        },

        setAppInfo({ commit, }, data) {
            commit('SET_APP_INFO', data);
            Store.set('appInfo', data);
        },

        setLicenseInfo({ commit, }, data) {
            commit('SET_LICENSE_INFO', data);
            Store.set('licenseInfo', data);
        },

        getLicenseInfo({ commit, }, language) {
            return new Promise((resolve, reject) => {
                getLicenseInfo(language).then((response) => {
                    const data = response.data;
                    if (data && data.status === 1) {
                        InvokeApp('update-passport-info', {
                            'data': {
								user_info: data.data && data.data.user_info ? data.data.user_info : {},
								license_info: data.data && data.data.license_info ? data.data.license_info : {},
                            },
                        });
                        commit('SET_LICENSE_INFO', data.data && data.data.license_info);
                        Store.set('licenseInfo', data.data && data.data.license_info);
                        resolve(data.data && data.data.license_info);
                    } else {
                        reject(data.status);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        },
    },
};

export default app;
