<template>
    <div class="account-account-info">
        <div class="account-account-info__container" v-loading.lock="loading">
            <div class="account-account-info__avatar" v-if="userInfo">
                <img v-if="userInfo.avatar || userInfo.avatar_url" :src="userInfo.avatar || userInfo.avatar_url" />
                <span v-if="!userInfo.avatar && !userInfo.avatar_url" class="default-avatar"></span>
            </div>
            <div class="account-account-info__info">
                <div class="row">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ accountName }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <div @click="openMyAccount()">My Account</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="openChangePassword()">Change Password</div>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="!isActivated">
                                <div @click="openActivate()">Activate</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="logout()">Log out</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="row">
                    <table>
                        <tr>
                            <td class="title">版本：</td>
                            <td>
                                {{productLicenseType}}
                            </td>
                        </tr>
                         <tr>
                            <td class="title">许可类型：</td>
                            <td>
                                {{passportLicenseType}}
                                <span class="refresh-btn" v-if="!isActivated"></span>
                            </td>
                        </tr>
                        <tr v-if="isActivated || isExpired">
                            <td class="title">有效期至：</td>
                            <td>
                                {{expiredText}}
                            </td>
                        </tr>
                        <tr v-if="isNearlyExpired">
                            <td colspan="2">
                                <button @click="onClickBuy()">Renew VIP</button>
                            </td>
                        </tr>
                        <tr v-if="!isActivated">
                            <td>&nbsp;</td>
                            <td v-if="language === 'zh'">
                                <button @click="onClickBuy()">Upgrade to VIP</button>
                            </td>
                            <td v-if="language !== 'zh'">
                                <button @click="openActivate()">Activate</button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="row links">
                    <span v-if="urls.faq" @click="gotoFaq()">FAQ</span>
                    <span v-if="urls.faq">|</span>
                    <span v-if="urls.forum" @click="gotoCommunity()">Community</span>
                    <span v-if="urls.forum">|</span>
                    <span @click="gotoFindVip()">找回VIP</span>
                </div>
            </div>
        </div>
        <div class="account-account-info__recommend" @click="gotoRecommended()" v-if="recommended">
            <div class="icon">
                <img v-if="recommended.product_icon" :src="recommended.product_icon" />
            </div>
            <div class="info">
                <header>{{recommended.product_name}}</header>
                <p>{{recommended.introduction}}</p>
            </div>
            <div class="link">
                <span @click="gotoRecommended()">Learn more</span>
            </div>
        </div>
    </div>
</template>

<script>
import Store from '@/utils/storage';
import { getAccountPreByIdentityToken } from '@/utils';
import { openUrl, InvokeApp } from '@/utils/invoke';
import { getMyAccountDomain, getApowersoftDomain } from '@/utils/apower';
import { getRecommendProducts } from '@/api/support';

export default {
    name: 'accountInfo',

    components: {
    },

    data() {
        return {
            language: null,
            userInfo: null,
            licenseInfo: null,
            urls: null,
            loading: false,
            recommended: null,
            PRODUCT_LICENSE_TYPE_TEXT: {
                vol        : 'Personal',
                personal   : 'Personal',
                commercial : 'Commercial',
            },

            PASSPORT_LICENSE_TYPE_text: {
                trial     : 'Trial',
                daily     : 'Daily',
                monthly   : 'Monthly' ,
                quarterly : 'Quarterly',
                yearly    : 'Yearly',
                lifetime  : 'Lifetime',
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
        getAccountInfo: function() {
            this.loading = true;
            this.userInfo = Store.get('userInfo');
            this.loading = false;
        },

        getLicenseInfo: function() {
            this.loading = true;
            this.$store.dispatch('getLicenseInfo', this.$i18n.locale)
                .then((data) => {
                    this.licenseInfo = data;
                    this.loading = false;
                })
                .catch((error) => {
                    this.$message.error(error.msg || 'Faild to get lincense info!');
                    this.loading = false;
                });
        },

        getUrls: function() {
            InvokeApp('get-passport-info', (data) => {
                this.urls = data.data.url_info;
            });
        },

        getRecommendProduct: function() {
            getRecommendProducts(this.$i18n.locale)
                .then((res) => {
                    this.InvokeDebug(res.data.data);
                    if (res.data && res.data.data && res.data.data.recommend_product && res.data.data.recommend_product.length > 0) {
                        this.recommended = res.data.data.recommend_product[0];
                    }
                });
        },

        openMyAccount: function() {
            const identity_token = Store.get('identity_token');
            openUrl(`${getMyAccountDomain(this.$i18n.locale)}?identity_token=${identity_token}`);
        },

        openChangePassword: function() {
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
            const identity_token = Store.get('identity_token');
            let url;
            let isActivatedNowOrBefore = this.isActivated || this.isExpired;
            url = isActivatedNowOrBefore ? this.urls.renew : this.urls.order;
            openUrl(`${url}?identity_token=${identity_token}`);
        },

        gotoFaq: function() {
            const identity_token = Store.get('identity_token');
            openUrl(`${this.urls.faq}?identity_token=${identity_token}`);
        },

        gotoCommunity: function() {
            const identity_token = Store.get('identity_token');
            openUrl(`${this.urls.forum}?identity_token=${identity_token}`);
        },

        gotoFindVip: function() {
            const identity_token = Store.get('identity_token');
            openUrl(`${getApowersoftDomain(this.$i18n.locale)}/support/retrieve-vip/?identity_token=${identity_token}`);
        },

        gotoRecommended: function() {
            const identity_token = Store.get('identity_token');
            openUrl(`${this.recommended.product_url}?identity_token=${identity_token}`);
        },

    },

    computed: {

        accountName: function() {
            const identity_token = Store.get('identity_token');
            const accountPre = getAccountPreByIdentityToken(identity_token);    
            return accountPre + (this.userInfo.nickname || this.userInfo.email.replace(/@.+/, ''));
        },

        isVip: function() {
            return this.licenseInfo && this.licenseInfo.is_activated == 1 && this.passportLicenseType !== 'trial';
        },

        isActivated: function() {
            return parseInt(this.licenseInfo.is_activated) === 1;
        },

        isExpired: function() {
            return this.licenseInfo && parseInt(this.licenseInfo.is_activated) == -2;
        },

        isNearlyExpired: function() {
            if (!this.isVip) {
                return false;
            }
            const remainingDays = this.licenseInfo.remain_days || 0;
            return remainingDays > 0  && remainingDays < (this.WILL_EXPIRED_DAYS[this.passportLicenseType] || 3);
        },

        productLicenseType: function() {
            return this.PRODUCT_LICENSE_TYPE_TEXT[this.licenseInfo.product_license_type] || this.PRODUCT_LICENSE_TYPE_TEXT['personal'];
        },

        passportLicenseType: function() {
            return this.PASSPORT_LICENSE_TYPE_text[this.licenseInfo.passport_license_type.replace('multi-', '') || 'trial'];
        },

        expiredText: function() {
            if (this.isExpired) {
                return 'Expired';
            }
            if (this.isNearlyExpired) {
                const remainingDays = this.licenseInfo.remain_days || 0;
                return `${remainingDays} days later`;
            }
            if (this.licenseInfo.passport_license_type === 'lifetime') {
                return 'Lifetime';
            }
            return this.licenseInfo.expire_date.replace(/T/, ' ').replace(/\.000/, '').replace(/-/g, '/').split(' ')[0];
        },
    },
};
</script>
