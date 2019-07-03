import Vue from 'vue';
import Router from 'vue-router';
import QrCode from '../views/pages/QrCode.vue';
import AccountLogin from '../views/pages/AccountLogin.vue';
import ResetPassword from '../views/pages/ResetPassword.vue';
import PasswordLessLogin from '../views/pages/PasswordLessLogin.vue';
import AccountInfo from '../views/pages/AccountInfo.vue';
import Activate from '../views/pages/Activate.vue';
import Vip from '../views/pages/Vip.vue';
import Buy from '../views/pages/Buy.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'qrcode',
        },
        {
            path: '/qrcode',
            name: 'qrcode',
            component: QrCode,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/account-login',
            name: 'accountLogin',
            component: AccountLogin,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/reset-password',
            name: 'resetPassword',
            component: ResetPassword,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/password-less-login',
            name: 'passwordLessLogin',
            component: PasswordLessLogin,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/account-info',
            name: 'accountInfo',
            component: AccountInfo,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/activate',
            name: 'activate',
            component: Activate,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/vip',
            name: 'vip',
            component: Vip,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
        {
            path: '/buy',
            name: 'buy',
            component: Buy,
            meta: {
                bodyWidth: '900px',
                bodyHeight: '612px',
            },
        },
    ],
});
