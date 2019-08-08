<template>
    <div class="account-buy">
        <div class="account-buy__container">
            <div class="type-switcher">
                <span @click="switchType('personal')" :class="{'active': currentType === 'personal'}">个人</span>
                <span @click="switchType('business')" :class="{'active': currentType === 'business'}">
                    商业
                    <el-tooltip class="tooltip" effect="light" placement="top">
                        <div slot="content" style="width: 350px;">
                            <p class="font-size: 14px;">个人授权版和商业授权版有何区别？</p>
                            <p class="font-size: 12px;">个人授权版供个人使用，不可用于商业盈利等相关活动。商业授权版供公司或企业使用，可用于公司商业展示等其他商业用途。</p>
                        </div>
                        <span></span>
                    </el-tooltip>
                </span>
                <div class="active-bottom" :class="{'left': currentType === 'personal', 'right': currentType === 'business'}"></div>
            </div>
           
        </div>
        <div class="account-buy__license-container">
            <div class="license-types" v-if="currentType === 'personal'">
                <div class="lifetime hot" @click="setActiveProduct('18180124_L', 'l')" :class="{'active': activeProductId === '18180124_L'}">
                    <p class="title">终身</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.l}}</span><span class="original">￥{{prices.personal.original.l}}</span></p>
                    <!-- <p class="limit"><span>2</span>台电脑</p> -->
                </div>
                <div class="year" @click="setActiveProduct('18180123_Y', 'y')" :class="{'active': activeProductId === '18180123_Y'}">
                    <p class="title">年度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.y}}</span><span class="original">￥{{prices.personal.original.y}}</span></p>
                    <!-- <p class="limit"><span>2</span>台电脑</p> -->
                </div>
                <div class="quarter" @click="setActiveProduct('18180194_Q', 'q')" :class="{'active': activeProductId === '18180194_Q'}">
                    <p class="title">季度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.q}}</span><span class="original">￥{{prices.personal.original.q}}</span></p>
                    <!-- <p class="limit"><span>2</span>台电脑</p> -->
                </div>
                <div class="multi" @click="setActiveProduct('18180204_L', 'multi')" :class="{'active': activeProductId === '18180204_L'}">
                    <p class="title">家庭终身版</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.multi}}</span><span class="original">￥{{prices.personal.original.multi}}</span></p>
                    <p class="limit"><span>5</span>人</p>
                </div>
            </div>
            <div class="license-types business" v-if="currentType === 'business'">
                <div class="lifetime hot" @click="setActiveProduct('18180126_L', 'l')" :class="{'active': activeProductId === '18180126_L'}">
                    <p class="title">终身</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.business.current.l}}</span><span class="original">￥{{prices.business.original.l}}</span></p>
                    <!-- <p class="limit"><span>2</span>台电脑</p> -->
                </div>
                <div class="year" @click="setActiveProduct('18180125_Y', 'y')" :class="{'active': activeProductId === '18180125_Y'}">
                    <p class="title">年度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.business.current.y}}</span><span class="original">￥{{prices.business.original.y}}</span></p>
                    <!-- <p class="limit"><span>2</span>台电脑</p> -->
                </div>
                <div class="quarter" @click="gotoBuy()">
                    <p class="title">团队终身版</p>
                    <p class="link">选择套餐</p>
                </div>
            </div>
        </div>
        <div class="account-buy__coupon-input" :class="{'is-tip': !isShowCouponInput}" v-if="!isShowCouponInput">
            <p @click="showCouponInput()">使用优惠券</p>
        </div>
        <div class="account-buy__coupon-input" v-if="isShowCouponInput">
            <input ref="couponInput" type="text" v-model="coupon" placeholder="请输入优惠码" minlength="4" maxlength="10" />
            <span class="coupon-btn" :class="{'loading': validCouponLoading, 'active': coupon}" @click="useCoupon()"><span v-if="!validCouponLoading">确认</span></span>
            <span class="error" v-if="couponErrorMessage">{{couponErrorMessage}}</span>
        </div>
		<div class="account-buy__pay-container">
			<div class="qrcode-container">
                <div class="qrcode" v-if="isLogined" v-loading.lock="!qrCodeLoaded || loadingPriceDetail">
                    <img v-if="qrCodeUrl && !loadingPriceDetail" :src="qrCodeUrl" />
                    <div class="refresh" v-if="isTimeout && qrCodeLoaded" @click="refresh()">
                        <p>点击刷新</p>
                    </div>
                </div>
                <div class="qrcode placeholder" v-if="!isLogined" @click="gotoLogin()">
                    
                </div>
                <div class="pay-infos" v-if="!loadingPriceDetail">
                    <p class="price">
                        <span class="currency">￥</span>
                        <span class="mount">{{invoice_amount}}</span>
                        <span class="reduce" v-if="reduce">(已优惠 {{reduce}}元)</span>
                    </p>
                    <p class="use">使用微信、支付宝扫码支付</p>
                    <p class="icon">
                        <span class="weixin"></span>
                        <span class="alipay"></span>
                    </p>
                </div>
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
import { generateOrder, queryOrderStatus, getLicenseInfo, queryCoupon } from '@/api/support';
import { stat } from '@/api/account';
import { openUrl } from '@/utils/invoke';
import Store from '@/utils/storage';
const queryUrl = 'https://www.apowersoft.cn/wp/wp-admin/admin-ajax.php?action=ajax_get_info_by_pro_name&pro_name=ApowerRec';

// const productList = {
//     'personal': {
//         l: {
//             id: '18180124_L',
//         },
//         m: {
//             id: '18180204_L',
//         },
//         q: {
//             id: '18180194_Q',
//         },
//         y: {
//             id: '18180123_Y',
//         },
//     },
//     'business': {
//         l: {
//             id: '18180126_L',
//         },
//         y: {
//             id: '18180125_Y',
//         },
//     },
// };

export default {
    name: 'buy',
    components: {
    },
    data() {
        return {
            appInfo: null,
            isLogined: false,
            isShowCouponInput: false,
            couponErrorMessage: null,
            coupon: '',
            validCouponLoading: false,
            isValidCoupon: false,
            isGeneratingOrder: false,
            productInfo: null,
            prices: null,
			currentType: 'personal',  // 'personal', 'business'
            activeProductId: '18180124_L',
            activeLicenseType: 'l',
            timeoutInterval: null,
            queryPayStatusTimeout: null,
            transactionIdTimeout: 1.5 * 60 * 60, // 订单过期时间两小时，设置过期时间一个半小时
            payInfos: {
                '18180124_L': {},
                '18180204_L': {},
                '18180194_Q': {},
                '18180123_Y': {},
                '18180126_L': {},
                '18180125_Y': {},
            },
        };
    },

    created: function() {
        this.appInfo = Store.get('appInfo');
    },

    mounted: function() {
        this.payInfos = {
            '18180124_L': {},
            '18180204_L': {},
            '18180194_Q': {},
            '18180123_Y': {},
            '18180126_L': {},
            '18180125_Y': {},
        };
        this.getProductsInfo();

        // const coupon = Store.get('coupon');
        // if (coupon) {
        //     this.isShowCouponInput = true;
        //     this.coupon = coupon;
        //     Store.remove('coupon');
        // }

        // const activeProductId = Store.get('activeProductId');
        // if (activeProductId) {
        //     this.activeProductId = activeProductId;
        //     Store.remove('activeProductId');
        // }

        // const currentType = Store.get('currentType');
        // if (currentType) {
        //     this.currentType = currentType;
        //     Store.remove('currentType');
        // }

        // const isValidCoupon = Store.get('isValidCoupon');
        // if (isValidCoupon) {
        //     this.isValidCoupon = isValidCoupon;
        //     Store.remove('isValidCoupon');
        // }

        // const activeLicenseType = Store.get('activeLicenseType');
        // if (activeLicenseType) {
        //     this.activeLicenseType = activeLicenseType;
        //     Store.remove('activeLicenseType');
        // }


        const identity_token = Store.get('identity_token');
        this.isLogined = !!identity_token;
        this.getTransactionId();
    },

    methods: {

        gotoLogin: function() {
            stat('rec_in_software_purchase', 'buyPageLogin');
            window.clearTimeout(this.queryPayStatusTimeout);
            this.$store.dispatch('setWillGoToBuy', true);
            this.$router.push({ path: '/qrcode', });
        },

        showCouponInput: function() {
            this.isShowCouponInput = true;
            this.$nextTick(() => {
                this.$refs['couponInput'].focus();
            });
        },

        switchType: function(type) {
            if (type !==  this.currentType) {
                this.currentType = type;
                Store.set('currentType', this.currentType);
                if (type === 'personal') {
                    this.activeProductId = '18180124_L';
                } else {
                    this.activeProductId = '18180126_L';
                }
                this.activeLicenseType = 'l';
                if (this.coupon) {
                    this.useCoupon();
                } else {
                    this.getTransactionId();
                }
            }
		},
        
        setActiveProduct: function(id, licenseType) {
            this.activeLicenseType = licenseType;
            Store.set('activeLicenseType', this.activeLicenseType);
            if (id !== this.activeProductId) {
                this.activeProductId = id;
                Store.set('activeProductId', this.activeProductId);
                 if (this.coupon) {
                    this.useCoupon();
                } else {
                    this.getTransactionId();
                }
            }
        },

        gotoBuy: function() {
			const identity_token = Store.get('identity_token');
            openUrl(`https://www.apowersoft.cn/store/apowerrec.html?identity_token=${identity_token}`);
            if (this.isLogined) {
                stat('rec_in_software_purchase', 'gotoTeamEdition');
            }
        },

        getProductsInfo: function() {
            axios.get(queryUrl)
                .then((res) => {
                    if (res.status === 200) {
                        this.productInfo = res.data;
                        this.prices = this.productInfo && this.productInfo.payment.price;
                    } else {
                        this.$message.error('获取产品信息失败!');
                        stat('rec_in_software_purchase', 'getProductInfoFailed');
                    }
                })
                .catch((error) => {
                    this.InvokeDebug('ErrorMessge: 获取产品信息失败');
                    stat('rec_in_software_purchase', 'getProductInfoFailed');
                    this.InvokeDebug(error);
                })
        },

        getTransactionId: function() {
            if (!this.isLogined) {
                return
            }
            const self = this;
            window.clearTimeout(this.queryPayStatusTimeout);
            this.queryPayStatusTimeout = null;
            if (!this.timeoutInterval) {
                this.timeoutInterval = window.setInterval(() => {
                    const keys = Object.keys(this.payInfos);
                    for (let i = 0,l = keys.length; i < l; i++) {
                        if (this.payInfos[keys[i]]['timeoutCount'] && this.payInfos[keys[i]]['timeoutCount'] > 0) {
                            this.payInfos[keys[i]]['timeoutCount']--;
                        } else {
                            this.payInfos[keys[i]]['isTimeout'] = true;
                        }
                    }
                }, 1000);
            }

            if (!this.payInfos[this.activeProductId] ||
                !this.payInfos[this.activeProductId]['transaction_id'] ||
                this.payInfos[this.activeProductId]['isTimeout'] ||
                this.payInfos[this.activeProductId]['coupon'] !== this.coupon) {
                const identity_token = Store.get('identity_token');
                const products = [];
                products.push({
                    product_id: this.activeProductId,
                    quantity: 1,
                });
                this.isGeneratingOrder = true;
                // 带上referer参数方便后台跟踪
                const version = this.appInfo && this.appInfo.app_ver;
                const apptype = this.appInfo && this.appInfo.type;
                const referer = `apowersoft.cn/in_app_purchase?apptype=${apptype}&v=${version}`;
                if (this.isLogined) {
                    stat('rec_in_software_purchase', 'startGenerateOrder');
                }
                generateOrder(this.isValidCoupon ? this.coupon : '', products, identity_token, referer)
                    .then((res) => {
                        this.isGeneratingOrder = false;
                        if (res.data.status === 1) {
                            if (this.isLogined) { 
                                stat('rec_in_software_purchase', 'generateOrderSuccess');
                            }
                            this.payInfos[this.activeProductId] = {
                                'coupon': this.coupon,
                                'isTimeout': false,
                                'timeoutCount': this.transactionIdTimeout,
                                'transaction_id': res.data.data.transaction_id,
                                'invoice_amount': res.data.data.invoice_amount,
                                'qr_loaded': false,
                                'qr_code': `https://support.aoscdn.com/api/buy/apowersoft?action=pay&transaction_id=${res.data.data.transaction_id}&payment_method=alipay_wxpay_qr`,
                            };
                            const qrcodeImage = new Image();
                            if (this.isLogined) {
                                stat('rec_in_software_purchase', 'startLoadQrCode');
                            }
                            qrcodeImage.src = this.payInfos[this.activeProductId]['qr_code'];
                            qrcodeImage.onload = function() {
                                const keys = Object.keys(self.payInfos);
                                for (let i = 0, l = keys.length; i < l; i++) {
                                    if (self.payInfos[keys[i]]['qr_code'] === this.src) {
                                        self.payInfos[keys[i]]['qr_loaded'] = true;
                                    }
                                }
                            };
                            setTimeout(() => {
                                if (qrcodeImage.complete) {
                                    if (self.isLogined) {
                                        stat('rec_in_software_purchase', 'loadQrCodeSuccess');
                                    }
                                } else {
                                    if (self.isLogined) {
                                        stat('rec_in_software_purchase', 'loadQrCodeFailed');
                                    }
                                }
                            }, 2000);
                            this.queryOrderStatus();
                        } else {
                            if (this.isLogined) {
                                stat('rec_in_software_purchase', `generateOrderFailed_${encodeURIComponent(JSON.stringify(res.data))}`);
                            }
                        }

                    })
                    .catch((error) => {
                        if (this.isLogined) {
                            stat('rec_in_software_purchase', `generateOrderFailed_${encodeURIComponent(JSON.stringify(error))}`);
                        }
                        this.InvokeDebug(error);
                    });
            } else {
                this.queryOrderStatus();
            }
        },

        refresh: function() {
            this.getTransactionId();
        },

        queryOrderStatus: async function() {
            const transaction_id = this.payInfos[this.activeProductId] && !this.payInfos[this.activeProductId]['isTimeout'] && this.payInfos[this.activeProductId]['transaction_id']    
            if (!transaction_id) {
                return;
            }
            let { data } = await queryOrderStatus(transaction_id)
            if (data && data.status === 1) {
                window.clearTimeout(this.queryPayStatusTimeout);
                this.queryPayStatusTimeout = null;
                if (!data.data || !data.data['order_detail']){
                    this.queryPayStatusTimeout = window.setTimeout(() => {
                        this.queryOrderStatus();
                    }, 3000);
                }

                const orderInfo = data.data['order_detail'];
                const orderStatus = orderInfo['transaction_status'];

                if(orderStatus === 'unpaid'){
                    this.queryPayStatusTimeout = window.setTimeout(() => {
                        this.queryOrderStatus();
                    }, 1000);
                } else if(orderStatus === "complete"){
                    this.onOrderPaid();
                } else if(orderStatus=== "refund"){
                    this.$message.error('订单已退款');
                } else if(orderStatus === "closed"){
                    this.$message.error('订单关闭');
                }
            }
        },

        onOrderPaid: async function() {
            let { data }  = await getLicenseInfo(this.$i18n.locale);
            if (data.data && data.data.license_info) {
                this.InvokeApp('update-passport-info', {
                    'data': {
						license_info: data.data.license_info,
						user_info: {},
                    },
                });
                stat('rec_in_software_purchase', 'orderPaid');
                this.$store.dispatch('setLicenseInfo', data.data.license_info);
                this.$router.push({ path: '/account-info', });
            }
        },

        useCoupon: function() {
            this.couponErrorMessage = null;
            if (!this.coupon) {
                this.couponErrorMessage = '请输入优惠码';
                return;
            } else if (this.coupon.length < 4) {
                this.couponErrorMessage = '无效优惠码';
                return;
            }

            Store.set('coupon', this.coupon);

            const identity_token = Store.get('identity_token');
            const products = [];
            products.push({
                product_id: this.activeProductId,
                quantity: 1,
            });
            this.validCouponLoading = true;
            queryCoupon(this.coupon, products, identity_token)
                .then((res) => {
                    if (res.data && res.data.info === 'success') {
                        this.isValidCoupon = true;
                    } else {
                        this.couponErrorMessage = '无效优惠券';
                        this.isValidCoupon = false;
                    }
                    Store.set('isValidCoupon', this.isValidCoupon);
                    this.validCouponLoading = false;
                    this.getTransactionId();
                });
            
        },
    },

    computed: {
        loadingPriceDetail: function() {
            return this.validCouponLoading || this.isGeneratingOrder;
        },

        qrCodeUrl: function() {
            return this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId]['qr_code'];
        },

        qrCodeLoaded: function() {
            return this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId]['qr_loaded'];
        },

        isTimeout: function() {
            if (this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId]['isTimeout']) {
                return true;
            } else {
                return false;
            }
        },

        invoice_amount: function() {
            if (this.isLogined) {
                return this.payInfos[this.activeProductId] &&
                   this.payInfos[this.activeProductId]['invoice_amount'] &&
                   this.payInfos[this.activeProductId]['invoice_amount'].replace(/(0+)$/g,"").replace(/(\.)$/g, "");
            } else {
                return this.prices && this.prices[this.currentType] && this.prices[this.currentType]['current'][this.activeLicenseType];
            }
        },

        reduce: function() {
            if (!this.payInfos ||
                !this.payInfos[this.activeProductId] ||
                !this.payInfos[this.activeProductId]['invoice_amount'] ||
                !this.prices ||
                !this.prices[this.currentType] ||
                !this.prices[this.currentType]['current']) {
                if (this.prices && this.prices[this.currentType] && this.prices[this.currentType]['original']) {
                    return Math.round((this.prices[this.currentType]['original'][this.activeLicenseType] * 100 - this.invoice_amount * 100)/100);
                }
            } else {
                if (this.isLogined) {
                    return Math.round((this.prices[this.currentType]['original'][this.activeLicenseType] * 100 - this.payInfos[this.activeProductId]['invoice_amount'] *100)) / 100;
                }
            }
            return 0;
        },
    },
};
</script>
