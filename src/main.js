// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Form,
    FormItem,
    Input,
    Loading,
    Select,
    Option,
    Message,
    Tooltip,
} from 'element-ui';
import './styles/themes/default/index.scss';
import Layout from './views/layout/layout.vue';
import router from './router';
import store from './store';
import { getQueryValue, } from './utils/index';
import { InvokeApp, InvokeDebug } from './utils/invoke';

// import languages
import LangEn from './lang/en.json';
import LangZh from './lang/zh.json';
import LangCs from './lang/cs.json';
import LangDa from './lang/da.json';
import LangDe from './lang/de.json';
import LangEl from './lang/el.json';
import LangEs from './lang/es.json';
import LangFi from './lang/fi.json';
import LangFr from './lang/fr.json';
import LangHu from './lang/hu.json';
import LangIt from './lang/it.json';
import LangJa from './lang/ja.json';
import LangNl from './lang/nl.json';
import LangNo from './lang/no.json';
import LangPl from './lang/pl.json';
import LangPt from './lang/pt.json';
import LangSv from './lang/sv.json';
import LangTr from './lang/tr.json';
import LangTw from './lang/tw.json';

Vue.config.productionTip = false;

Vue.config.keyCodes = {
	enter: 13,
};

Vue.use(VueI18n);

// element components
Vue.use(Loading.directive);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tooltip);

Vue.prototype.$message = Message;

Vue.prototype.GLOBAL = {};

Vue.prototype.InvokeApp = InvokeApp;

Vue.prototype.InvokeDebug = InvokeDebug;

// 拉取软件信息
let isLogined = false;

InvokeApp('get-passport-info', {}, (res) => {
    store.dispatch('setAppInfo', res && res.data.app_info);

    if (res && res.data) {
        if (res.data.user_info) {
            store.dispatch('UpdateUserInfo', res.data.user_info);
        }
        if (res.data.user_info && res.data.user_info.identity_token) {
            store.dispatch('UpdateIdentityToken', res.data.user_info.identity_token);
            isLogined = true;
            InvokeDebug('Login status: logined');
        }
        if (res.data.license_info) {
            store.dispatch('setLicenseInfo', res.data.license_info);
        }
    }
});

// 获取传过来page参数
let page, search = window.location.search;

if (search) {
	const params = search.substr(1).split('&').map((ele) => {
		return {
			key: ele.split('=')[0],
			value: ele.split('=')[1],
		};
	});
	page = params.find((ele) => ele.key === 'page')['value'];
}


let lang = getQueryValue('lang') || 'zh';

if (page && page === 'buy' && !isLogined) {
    store.dispatch('setWillGoToBuy', true);
}

// 获取html中定义的全局变量，决定跳转

router.beforeEach((to, from, next) => {
    InvokeDebug(to);
    const bodyWidth = to.meta.bodyWidth;
    const bodyHeight = to.meta.bodyHeight;
    if (bodyWidth && bodyHeight) {
        document.body.style.width = bodyWidth;
        document.body.style.height = bodyHeight;
    }
    if (page) {
        if (page === 'buy') {
            page = null;
            if (isLogined) {
                if (to.path === '/buy') {
                    next();
                } else {
                    next({
                        path: '/buy',
                    });
                }
            } else {
                if (to.path === '/qrcode') {
                    next();
                } else {
                    next({
                        path: '/qrcode',
                    });
                }
            }
        } else {
            page = null;
            if (isLogined) {
                if (to.path === '/account-info') {
                    next();
                } else {
                    next({
                        path: '/account-info',
                    });
                }
            } else {
                if (to.path === '/qrcode') {
                    next();
                } else {
                    next({
                        path: '/qrcode',
                    });
                }
            }
        }
    } else {
        next();
    }
});

const i18n = new VueI18n({
    locale: lang,
    messages: {
        'zh': LangZh,
        'en': LangEn,
        'cs': LangCs,
        'da': LangDa,
        'de': LangDe,
        'el': LangEl,
        'es': LangEs,
        'fi': LangFi,
        'fr': LangFr,
        'hu': LangHu,
        'it': LangIt,
        'ja': LangJa,
        'nl': LangNl,
        'no': LangNo,
        'pl': LangPl,
        'pt': LangPt,
        'sv': LangSv,
        'tr': LangTr,
        'tw': LangTw,
    },
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { Layout, },
    render: h => h(Layout),
}).$mount('#app');
