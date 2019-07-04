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
            <div class="license-types" v-if="currentType === 'personal'">
                <div class="lifetime active hot">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="multi">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
            </div>
            <div class="license-types" v-if="currentType === 'business'">
                <div class="lifetime active hot">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="year">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
                <div class="quarter">
                    <p class="title">终身</p>
                    <p class="price"><span class="currency">￥</span><span class="number">199</span><span class="original">￥499</span></p>
                    <p class="limit"><span>2</span>台电脑</p>
                </div>
            </div>
        </div>
		<div class="account-buy__pay-container">
			<div class="pay-method">
				<p class="weixin" @click="switchPayMethod('weixin')" :class="{'active': payMethod === 'weixin'}">微信</p>
				<p class="alipay" @click="switchPayMethod('alipay')" :class="{'active': payMethod === 'alipay'}">支付宝</p>
			</div>
			<div class="qrcode-container" v-loading.lock="loading">
				<img :src="qrcodeUrl" />
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
const queryUrl = 'https://www.apowersoft.cn/wp/wp-admin/admin-ajax.php?action=ajax_get_info_by_pro_name&pro_name=ApowerRec';

export default {
    name: 'buy',
    components: {
    },
    data() {
        return {
            loading: false,
            productInfo: null,
			currentType: 'personal',  // 'personal', 'business'
			payMethod: 'weixin', // 'weixin', 'alipay'
			qrCodeUrl: null,
        };
    },

    created: function() {
		this.getProductsInfo();
		this.getQrCode();
    },
    methods: {

        switchType: function(type) {
			this.currentType = type;
			this.getQrCode();
		},
		
		switchPayMethod: function(method) {
			this.payMethod = method;
			this.getQrCode();
		},

        getProductsInfo: function() {
            axios.get(queryUrl)
                .then((res) => {
                    if (res.status === 200) {
                        this.productInfo = res.data;
                    } else {
                        this.$message.error('获取产品信息失败!');
                    }
                })
                .catch((error) => {
                    this.InvokeDebug(error);
                })
        },

        getQrCode: function() {
			this.loading = true;
        },
    },
};
</script>
