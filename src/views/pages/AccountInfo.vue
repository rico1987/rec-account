<template>
    <div class="account-account-info">
        <div class="account-account-info__container">
            <div @click="openMyAccount()" class="account-account-info__avatar"  :class="{'is-default': userInfo && !userInfo.avatar && !userInfo.avatar_url}">
                <img v-if="userInfo && userInfo.avatar || userInfo.avatar_url" :src="userInfo && (userInfo.avatar || userInfo.avatar_url)" />
                <span v-if="userInfo && !userInfo.avatar && !userInfo.avatar_url" class="default-avatar"></span>
            </div>
            <div class="account-account-info__vip" :class="{'active': isVip}" @click="onClickCrown()">

            </div>
            <div class="account-account-info__info">
                <div class="row" style="display: flex; align-items: center;">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ accountName }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <div @click="openMyAccount()" class="menu-account">我的账户</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="openChangePassword()" class="menu-change-password">修改密码</div>
                            </el-dropdown-item>
                            <!-- <el-dropdown-item v-if="!isActivated">
                                <div @click="openActivate()" class="menu-activate">激活</div>
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                                <div @click="logout()" class="menu-logout">退出</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span class="exit" @click="logout()"></span>
                </div>
                <div class="row">
                    <table>
                        <tr>
                            <td class="title">版本：</td>
                            <td class="value">
                                {{productLicenseType}}
                            </td>
                        </tr>
                        <tr>
                            <td class="title">许可类型：</td>
                            <td class="value">
                                {{passportLicenseType}}
                                <span @click="refresh()" class="refresh-btn" :class="{'is-refreshing': isRefreshing}" v-if="licenseInfo && !isVip"></span>
                            </td>
                        </tr>
                        <tr v-if="(isActivated || isExpired) && !isTrial && !isLifeTime">
                            <td class="title">有效期至：</td>
                            <td class="value">
                                {{expiredText}}
                            </td>
                        </tr>
                        <tr v-if="isNearlyExpired">
                            <td colspan="2">
                                <span class="primary-btn" @click="onClickBuy()">续费</span>
                            </td>
                        </tr>
                        <tr v-if="licenseInfo && (!isActivated || isExpired)">
                            <td>&nbsp;</td>
                            <td v-if="language === 'zh'">
                                <span class="primary-btn" @click="onClickBuy()">开通VIP</span>
                            </td>
                            <td v-if="language !== 'zh'">
                                <span class="primary-btn" @click="openActivate()">激活</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="account-account-info__links">
            <span v-if="urls && urls.faq" @click="gotoFaq()">常见问题</span>
            <span v-if="urls && urls.faq">|</span>
            <span v-if="urls && urls.forum" @click="gotoCommunity()">社区</span>
            <span v-if="urls && urls.forum">|</span>
            <span @click="gotoFindVip()">找回VIP</span>
        </div>
        <div class="account-account-info__recommend" @click="gotoRecommended()">
            <div class="icon" v-if="recommended">
                <img v-if="recommended.product_icon" :src="recommended.product_icon" />
            </div>
            <div class="info" v-if="recommended">
                <header>{{recommended.product_name}}</header>
                <p>{{recommended.introduction}}</p>
            </div>
            <div class="link" v-if="recommended">
                <span @click="gotoRecommended()">了解详情</span>
            </div>
        </div>
    </div>
</template>

<script>
import Store from '@/utils/storage';
import { getAccountPreByIdentityToken } from '@/utils';
import { openUrl } from '@/utils/invoke';
import { getMyAccountDomain, getApowersoftDomain } from '@/utils/apower';
import { getRecommendProducts } from '@/api/support';
import { stat } from '@/api/account';

export default {
    name: 'accountInfo',

    components: {
    },

    data() {
        return {
            isVip: false,
            isActivated: false,
            isExpired: false,
            isTrial: true,
            isNearlyExpired: false,
            isLifeTime: false,
            productLicenseType: '',
            passportLicenseType: '',
            expiredText: '',
            hasTrial: false,
            accountName: '',
            language: null,
            userInfo: {},
            licenseInfo: null,
            urls: null,
			loading: false,
			isRefreshing: false,
            recommended: null,
            PRODUCT_LICENSE_TYPE_TEXT: {
                vol        : '个人授权版',
                personal   : '个人授权版',
                commercial : '商业授权版',
            },

            PASSPORT_LICENSE_TYPE_text: {
                trial     : '试用版',
                daily     : '日度',
                monthly   : '月度' ,
                quarterly : '季度',
                yearly    : '年度',
                lifetime  : '终身',
            },

            WILL_EXPIRED_DAYS: {
                trial     : 3,
                daily     : 1,
                monthly   : 7,
                quarterly : 10,
                yearly    : 15,
            },

        };
    },

    created: function() {
        this.language = this.$i18n.locale;
        this.getAccountInfo();
        this.getLicenseInfo();
        this.getUrls();
        this.getRecommendProduct();
    },

    methods: {

        onClickCrown: function() {
            if (this.isVip) {
                this.openMyAccount();
            } else {
                this.onClickBuy();
            }
        },

        getAccountInfo: function() {
            this.userInfo = Store.get('userInfo');
            const identity_token = Store.get('identity_token');
            const accountPre = getAccountPreByIdentityToken(identity_token);    
            this.accountName =  accountPre + (this.userInfo && (this.userInfo.nickname || this.userInfo.email.replace(/@.+/, '')));
        },

        getLicenseInfo: function() {
            this.loading = true;

            this.$store.dispatch('getLicenseInfo', this.$i18n.locale)
                .then((data) => {
                    this.licenseInfo = data;
                    this.loading = false;
                    this.isVip = this.licenseInfo && this.licenseInfo.is_activated == 1 && this.passportLicenseType !== 'trial';
                    this.isActivated = parseInt(this.licenseInfo.is_activated) === 1;
                    this.isExpired = this.licenseInfo && parseInt(this.licenseInfo.is_activated) == -2;
                    this.isTrial = this.licenseInfo && this.licenseInfo.passport_license_type === 'trial';
                    this.hasTrial = this.licenseInfo && this.licenseInfo.no_trial !== '1';
                    const remainingDays = this.licenseInfo.remain_days || 0;
                    this.isNearlyExpired = this.isVip && remainingDays > 0  && remainingDays < (this.WILL_EXPIRED_DAYS[this.passportLicenseType] || 3);
                    this.productLicenseType = this.PRODUCT_LICENSE_TYPE_TEXT[this.licenseInfo.product_license_type] || this.PRODUCT_LICENSE_TYPE_TEXT['personal'];
                    this.passportLicenseType = this.PASSPORT_LICENSE_TYPE_text[this.licenseInfo.passport_license_type.replace('multi-', '') || 'trial'];
                    this.isLifeTime = this.licenseInfo.passport_license_type === 'lifetime';
                    if (this.isExpired) {
                        this.expiredText = '已过期';
                    } else if (this.isNearlyExpired) {
                        const remainingDays = this.licenseInfo.remain_days || 0;
                        this.expiredText = `${remainingDays} 天后`;
                    } else if (this.licenseInfo.passport_license_type === 'lifetime') {
                        this.expiredText = '终身';
                    } else {
                        this.expiredText = this.licenseInfo.expire_date.replace(/T/, ' ').replace(/\.000/, '').replace(/-/g, '/').split(' ')[0];
                    }
                })
                .catch((error) => {
                    this.$message.error(error.msg || '获取授权信息失败!');
                    stat('rec_in_software_purchase', 'getLicenseInfoFailed');
                    this.loading = false;
                });
        },

        getUrls: function() {
            this.InvokeApp('get-passport-info', (data) => {
                this.urls = data.data.url_info;
            });
        },

        getRecommendProduct: function() {
            getRecommendProducts(this.$i18n.locale)
                .then((res) => {
                    if (res.data && res.data.data && res.data.data.recommend_product && res.data.data.recommend_product.length > 0) {
                        this.recommended = res.data.data.recommend_product[0];
                    }
                });
        },

        openMyAccount: function() {
            stat('rec_in_software_purchase', 'goToWebAccount');
            const identity_token = Store.get('identity_token');
            openUrl(`${getMyAccountDomain(this.$i18n.locale)}?identity_token=${identity_token}`);
        },

        openChangePassword: function() {
            stat('rec_in_software_purchase', 'goToWebAccount');
            const identity_token = Store.get('identity_token');
            openUrl(`${getMyAccountDomain(this.$i18n.locale)}?init=change-password&identity_token=${identity_token}`);
        },

        openActivate: function() {
            this.$router.push({ path: '/activate', });
        },

        logout: function() {
            this.$store.dispatch('Logout')
                .then(() => {
                    this.$router.push({ path: '/qrcode', });
                });
        },

        onClickBuy: function() {
            stat('rec_in_software_purchase', 'clickBuyButton');
            this.$router.push({ path: '/buy', });
        },

        gotoFaq: function() {
            stat('rec_in_software_purchase', 'goToWeb');
            const identity_token = Store.get('identity_token');
            openUrl(`${this.urls.faq}?identity_token=${identity_token}`);
        },

        gotoCommunity: function() {
            stat('rec_in_software_purchase', 'goToWeb');
            const identity_token = Store.get('identity_token');
            openUrl(`${this.urls.forum}?identity_token=${identity_token}`);
        },

        gotoFindVip: function() {
            stat('rec_in_software_purchase', 'goToWeb');
            const identity_token = Store.get('identity_token');
            openUrl(`${getApowersoftDomain(this.$i18n.locale)}/support/retrieve-vip/?identity_token=${identity_token}`);
        },

        gotoRecommended: function() {
            stat('rec_in_software_purchase', 'goToWeb');
            const identity_token = Store.get('identity_token');
            openUrl(`${this.recommended.product_url}?identity_token=${identity_token}`);
		},
		
		refresh: function() {
			this.isRefreshing = true;
			this.$store.dispatch('getLicenseInfo', this.$i18n.locale)
                .then((data) => {
                    this.licenseInfo = data;
                    this.isRefreshing = false;
                    this.isVip = this.licenseInfo && this.licenseInfo.is_activated == 1 && this.passportLicenseType !== 'trial';
                    this.isActivated = parseInt(this.licenseInfo.is_activated) === 1;
                    this.isExpired = this.licenseInfo && parseInt(this.licenseInfo.is_activated) == -2;
                    this.isTrial = this.licenseInfo && this.licenseInfo.passport_license_type === 'trial';
                    this.hasTrial = this.licenseInfo && this.licenseInfo.no_trial !== '1';
                    const remainingDays = this.licenseInfo.remain_days || 0;
                    this.isNearlyExpired = this.isVip && remainingDays > 0  && remainingDays < (this.WILL_EXPIRED_DAYS[this.passportLicenseType] || 3);
                    this.productLicenseType = this.PRODUCT_LICENSE_TYPE_TEXT[this.licenseInfo.product_license_type] || this.PRODUCT_LICENSE_TYPE_TEXT['personal'];
                    this.passportLicenseType = this.PASSPORT_LICENSE_TYPE_text[this.licenseInfo.passport_license_type.replace('multi-', '') || 'trial'];

                    if (this.isExpired) {
                        this.expiredText = '已过期';
                    }
                    if (this.isNearlyExpired) {
                        const remainingDays = this.licenseInfo.remain_days || 0;
                        this.expiredText = `${remainingDays} 天后`;
                    }
                    if (this.licenseInfo.passport_license_type === 'lifetime') {
                        this.expiredText = '终身';
                    }
                    this.expiredText = this.licenseInfo.expire_date.replace(/T/, ' ').replace(/\.000/, '').replace(/-/g, '/').split(' ')[0];
                })
                .catch((error) => {
                    this.$message.error(error.msg || '获取授权信息失败!');
                    stat('rec_in_software_purchase', 'getLicenseInfoFailed');
                    this.isRefreshing = false;
                });
		},

    },
};
</script>
