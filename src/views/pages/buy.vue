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
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year" @click="setActiveProduct('18180123_Y', 'y')" :class="{'active': activeProductId === '18180123_Y'}">
                    <p class="title">年度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.y}}</span><span class="original">￥{{prices.personal.original.y}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter" @click="setActiveProduct('18180194_Q', 'q')" :class="{'active': activeProductId === '18180194_Q'}">
                    <p class="title">季度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.q}}</span><span class="original">￥{{prices.personal.original.q}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="multi" @click="setActiveProduct('18180204_L', 'multi')" :class="{'active': activeProductId === '18180204_L'}">
                    <p class="title">家庭终身版</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.personal.current.multi}}</span><span class="original">￥{{prices.personal.original.multi}}</span></p>
                    <p class="limit"><span>5</span>台电脑</p>
                </div>
            </div>
            <div class="license-types business" v-if="currentType === 'business' && prices">
                <div class="lifetime hot" @click="setActiveProduct('18180126_L', 'l')" :class="{'active': activeProductId === '18180126_L'}">
                    <p class="title">终身</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.business.current.l}}</span><span class="original">￥{{prices.business.original.l}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year" @click="setActiveProduct('18180125_Y', 'y')" :class="{'active': activeProductId === '18180125_Y'}">
                    <p class="title">年度</p>
                    <p class="price" v-if="prices"><span class="currency">￥</span><span class="number">{{prices.business.current.y}}</span><span class="original">￥{{prices.business.original.y}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter" @click="gotoBuy()">
                    <p class="title">团队终身版</p>
                    <p class="link">选择套餐</p>
                </div>
            </div>
        </div>
        <div class="account-buy__coupon-input">
            <input type="text" v-model="coupon" placeholder="请输入优惠码" minlength="4" maxlength="10" />
            <span class="coupon-btn" :class="{'loading': validCouponLoading, 'active': coupon}" @click="useCoupon()"><span v-if="!validCouponLoading">确认</span></span>
            <span class="error" v-if="couponErrorMessage">{{couponErrorMessage}}</span>
        </div>
		<div class="account-buy__pay-container">
			<div class="pay-method">
				<p class="weixin" @click="switchPayMethod('wxpay_qr')" :class="{'active': payMethod === 'wxpay_qr'}">微信</p>
				<p class="alipay" @click="switchPayMethod('alipay_qr')" :class="{'active': payMethod === 'alipay_qr'}">支付宝</p>
			</div>
			<div class="qrcode-container">
                <div class="qrcode" v-loading.lock="!qrCodeLoaded">
                    <img v-if="qrCodeUrl" :src="qrCodeUrl" />
                    <div class="refresh" v-if="isTimeout && qrCodeLoaded" @click="refresh()">
                        <p>点击刷新</p>
                    </div>
                </div>
                <p v-if="qrCodeLoaded">支付金额：
                    <span class="currency">￥</span>
                    <span class="mount">{{invoice_amount}}</span>
                    <span class="reduce" v-if="reduce">(已优惠 {{reduce}}元)</span>
                </p>
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
import { generateOrder, queryOrderStatus, getLicenseInfo, queryCoupon } from '@/api/support';
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
            // loading: false,
            couponErrorMessage: null,
            coupon: '',
            validCouponLoading: false,
            isValidCoupon: false,
            productInfo: null,
            prices: null,
			currentType: 'personal',  // 'personal', 'business'
            payMethod: 'wxpay_qr', // 'wxpay_qr', 'alipay_qr'
            activeProductId: '18180124_L',
            activeLicenseType: 'l',
            qrcodeLoaded: false,
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
        this.getTransactionId();
    },

    methods: {

        switchType: function(type) {
            if (type !==  this.currentType) {
                this.currentType = type;
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
		
		switchPayMethod: function(method) {
            if (method !== this.payMethod) {
                this.payMethod = method;
                 if (this.coupon) {
                    this.useCoupon();
                } else {
                    this.getTransactionId();
                }
            }
        },
        
        setActiveProduct: function(id, licenseType) {
            this.activeLicenseType = licenseType;
            if (id !== this.activeProductId) {
                this.activeProductId = id;
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
        },

        getProductsInfo: function() {
            axios.get(queryUrl)
                .then((res) => {
                    if (res.status === 200) {
                        this.productInfo = res.data;
                        this.prices = this.productInfo && this.productInfo.payment.price;
                    } else {
                        this.$message.error('获取产品信息失败!');
                    }
                })
                .catch((error) => {
					this.InvokeDebug('ErrorMessge: 获取产品信息失败');
                    this.InvokeDebug(error);
                })
        },

        getTransactionId: function() {
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
                this.loading = true;
                this.qrcodeLoaded = false;
                const identity_token = Store.get('identity_token');
                const products = [];
                products.push({
                    product_id: this.activeProductId,
                    quantity: 1,
                });
                generateOrder(this.isValidCoupon ? this.coupon : '', products, identity_token)
                    .then((res) => {
                        this.loading = false;
                        if (res.data.status === 1) {
                            this.payInfos[this.activeProductId] = {
                                'coupon': this.coupon,
                                'isTimeout': false,
                                'timeoutCount': this.transactionIdTimeout,
                                'transaction_id': res.data.data.transaction_id,
                                'invoice_amount': res.data.data.invoice_amount,
                                'wxpay_qr_loaded': false,
                                'alipay_qr_loaded': false,
                                'wxpay_qr': `https://support.aoscdn.com/api/buy/apowersoft?action=pay&transaction_id=${res.data.data.transaction_id}&payment_method=wxpay_qr`,
                                'alipay_qr': `https://support.aoscdn.com/api/buy/apowersoft?action=pay&transaction_id=${res.data.data.transaction_id}&payment_method=alipay_qr`,
                            };
                            const wxpayImage = new Image();
                            const alipayImage = new Image();
                            wxpayImage.src = this.payInfos[this.activeProductId]['wxpay_qr'];
                            wxpayImage.onload = function() {
                                this.payInfos[this.activeProductId]['wxpay_qr_loaded'] = true;
                                this.$forceUpdate();
                            }.bind(this);
                            alipayImage.src = this.payInfos[this.activeProductId]['alipay_qr'];
                            alipayImage.onload = function() {
                                this.payInfos[this.activeProductId]['alipay_qr_loaded'] = true;
                                this.$forceUpdate();
                            }.bind(this);
                            this.queryOrderStatus();
                        }

                    })
                    .catch((error) => {
                        this.InvokeDebug('ErrorMessge: 生成订单失败');
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
                    this.validCouponLoading = false;
                    this.getTransactionId();
                });
            
        },
    },

    computed: {
        qrCodeUrl: function() {
            return this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId][this.payMethod];
        },

        qrCodeLoaded: function() {
            return this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId][this.payMethod + '_loaded'];
        },

        isTimeout: function() {
            if (this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId]['isTimeout']) {
                return true;
            } else {
                return false;
            }
        },

        invoice_amount: function() {
            return Math.floor((this.payInfos[this.activeProductId] && this.payInfos[this.activeProductId]['invoice_amount']) * 100) / 100;
        },

        reduce: function() {
            if (!this.payInfos ||
                !this.payInfos[this.activeProductId] ||
                !this.payInfos[this.activeProductId]['invoice_amount'] ||
                !this.prices ||
                !this.prices[this.currentType] ||
                !this.prices[this.currentType]['current']) {
                return null;
            } else {
                return Math.floor((this.prices[this.currentType]['current'][this.activeLicenseType] - this.payInfos[this.activeProductId]['invoice_amount']) * 100) / 100;
            }
        },
    },
};
</script>
