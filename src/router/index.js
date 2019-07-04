import Vue from 'vue';
import Router from 'vue-router';
import QrCode from '../views/pages/QrCode.vue';
import AccountLogin from '../views/pages/AccountLogin.vue';
import ResetPassword from '../views/pages/ResetPassword.vue';
import PasswordLessLogin from '../views/pages/PasswordLessLogin.vue';
import AccountInfo from '../views/pages/AccountInfo.vue';
import Activate from '../views/pages/Activate.vue';
import Buy from '../views/pages/Buy.vue';
import Register from '../views/pages/Register.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'qrcode',
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/qrcode',
            name: 'qrcode',
            component: QrCode,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/account-login',
            name: 'accountLogin',
            component: AccountLogin,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/reset-password',
            name: 'resetPassword',
            component: ResetPassword,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/password-less-login',
            name: 'passwordLessLogin',
            component: PasswordLessLogin,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/account-info',
            name: 'accountInfo',
            component: AccountInfo,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/activate',
            name: 'activate',
            component: Activate,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
        {
            path: '/buy',
            name: 'buy',
            component: Buy,
            meta: {
                bodyWidth: '630px',
                bodyHeight: '393px',
            },
        },
    ],
});
