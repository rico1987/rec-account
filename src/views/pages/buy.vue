<template>
    <div class="account-buy">
        <div class="account-buy__container">
            <div class="type-switcher">
                <span @click="switchType('personal')" :class="{'active': currentType === 'personal'}">个人</span>
                <span @click="switchType('business')" :class="{'active': currentType === 'business'}">商业</span>
                <div class="active-bottom" :class="{'left': currentType === 'personal', 'right': currentType === 'business'}"></div>
            </div>
           
        </div>
        <div class="account-buy__license-container">
            <div class="license-types" v-if="currentType === 'personal' && prices">
                <div class="lifetime hot" @click="setActiveProduct('18180124_L')" :class="{'active': activeProductId === '18180124_L'}">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.personal.current.l}}</span><span class="original">￥{{prices.personal.original.l}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year" @click="setActiveProduct('18180123_Y')" :class="{'active': activeProductId === '18180123_Y'}">
                    <p class="title">年度</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.personal.current.y}}</span><span class="original">￥{{prices.personal.original.y}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter" @click="setActiveProduct('18180194_Q')" :class="{'active': activeProductId === '18180194_Q'}">
                    <p class="title">季度</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.personal.current.q}}</span><span class="original">￥{{prices.personal.original.q}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="multi" @click="setActiveProduct('18180204_L')" :class="{'active': activeProductId === '18180204_L'}">
                    <p class="title">家庭终身版</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.personal.current.multi}}</span><span class="original">￥{{prices.personal.original.multi}}</span></p>
                    <p class="limit"><span>5</span>台电脑</p>
                </div>
            </div>
            <div class="license-types business" v-if="currentType === 'business' && prices">
                <div class="lifetime hot" @click="setActiveProduct('18180126_L')" :class="{'active': activeProductId === '18180126_L'}">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.business.current.l}}</span><span class="original">￥{{prices.business.original.l}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year" @click="setActiveProduct('18180125_Y')" :class="{'active': activeProductId === '18180125_Y'}">
                    <p class="title">年度</p>
                    <p class="price"><span class="currency">￥</span><span class="number">{{prices.business.current.y}}</span><span class="original">￥{{prices.business.original.y}}</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter" @click="gotoBuy()">
                    <p class="title">团队终身版</p>
                    <p class="link">选择套餐</p>
                </div>
            </div>
        </div>
		<div class="account-buy__pay-container">
			<div class="pay-method">
				<p class="weixin" @click="switchPayMethod('wxpay_qr')" :class="{'active': payMethod === 'wxpay_qr'}">微信</p>
				<p class="alipay" @click="switchPayMethod('alipay_qr')" :class="{'active': payMethod === 'alipay_qr'}">支付宝</p>
			</div>
			<div class="qrcode-container">
                <div class="qrcode" v-loading.lock="loading || !qrcodeLoaded">
                    <img v-if="qrcodeLoaded" :src="qrCodeUrl" />
                    <div class="refresh" v-if="isTimeout" @click="refresh()">
                        <p>点击刷新</p>
                    </div>
                </div>
                <p v-if="qrcodeLoaded">支付金额：<span class="currency">￥</span><span class="mount">{{invoice_amount}}</span></p>
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
import { generateOrder, queryOrderStatus, getLicenseInfo } from '@/api/support';
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
            loading: false,
            productInfo: null,
            prices: null,
			currentType: 'personal',  // 'personal', 'business'
            payMethod: 'wxpay_qr', // 'wxpay_qr', 'alipay_qr'
            activeProductId: '18180124_L',
            transaction_id: null,
            prepayInfo: null,
            invoice_amount: null,
            qrcodeLoaded: false,
            timeoutInterval: null,
            timeout: 300, // 二维码过期时间
            timeoutCount: null, 
            isTimeout: false,
            queryOrderStatusInterval: null,
        };
    },

    created: function() {
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
                this.getTransactionId();
            }
		},
		
		switchPayMethod: function(method) {
            if (method !== this.payMethod) {
                this.payMethod = method;
                this.getTransactionId();
            }
        },
        
        setActiveProduct: function(id) {
            if (id !== this.activeProductId) {
                this.activeProductId = id;
                this.getTransactionId();
            }
        },

        gotoBuy: function() {

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
                    this.InvokeDebug(error);
                })
        },

        getTransactionId: function() {
            this.loading = true;
            this.qrcodeLoaded =false;
            this.transaction_id = null;
            this.isTimeout = false;
            const identity_token = Store.get('identity_token');
            const products = [];
            products.push({
                product_id: this.activeProductId,
                quantity: 1,
            })
            generateOrder('', products, identity_token)
                .then((res) => {
                    if (res.data.status === 1) {
                        this.prepayInfo = res.data.data;
                        this.transaction_id = this.prepayInfo.transaction_id;
                        this.invoice_amount = this.prepayInfo.invoice_amount;
                        const imageSrc = `https://support.aoscdn.com/api/buy/apowersoft?action=pay&transaction_id=${this.transaction_id}&payment_method=${this.payMethod}`;
                        const image = new Image();
                        image.src = imageSrc;
                        image.onload = function() {
                            this.qrcodeLoaded = true;
                        }.bind(this);
                        this.timeoutCount = this.timeout;
                        this.timeoutInterval = window.setInterval(() => {
                            if (this.timeoutCount === 0) {
                                this.isTimeout = true;
                                window.clearInterval(this.timeoutInterval);
                                this.timeoutInterval = null;
                                window.clearInterval(this.queryOrderStatusInterval);
                                this.queryOrderStatusInterval = null;
                            } else {
                                this.timeoutCount--;
                            }
                        }, 1000);
                        this.queryOrderStatus(this.transaction_id);
                    }
                    this.loading = false;
                })
                .catch((error) => {
                    this.InvokeDebug(error);
                });
        },

        refresh: function() {
            this.getTransactionId();
        },

        queryOrderStatus: function(transaction_id) {
            if (this.isTimeout) {
                return;
            }
            queryOrderStatus(transaction_id)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        let data = res.data.data;
                        if (!data || !data['order_detail']){
                            window.setTimeout(() => {
                                this.queryOrderStatus();
                            }, 3000);
                        }

                        const orderInfo = data['order_detail'];
                        const orderStatus = orderInfo['transaction_status'];

                        if(orderStatus === 'unpaid'){
                           window.setTimeout(() => {
                               this.queryOrderStatus();
                           }, 0);
                        } else if(orderStatus === "complete"){
                            this.onOrderPaid();
                        } else if(orderStatus=== "refund"){
                            this.$message.error('订单已退款');
                        } else if(orderStatus === "closed"){
                            this.$message.error('订单关闭');
                        }
                    }
                });
        },

        onOrderPaid: async function() {
            let { data }  = await getLicenseInfo(this.$i18n.locale);
            if (data.data && data.data.license_info) {
                this.InvokeApp('update-passport-info', {
                    'data': {
                        'license_info': data.data.license_info,
                    },
                });
                this.$store.dispatch('setLicenseInfo', data.data.license_info);
                this.$router.push({ path: '/account-info', });
            }
        },
        
    },

    computed: {
        qrCodeUrl: function() {
            return `https://support.aoscdn.com/api/buy/apowersoft?action=pay&transaction_id=${this.transaction_id}&payment_method=${this.payMethod}`;
        },
    },
};
</script>
