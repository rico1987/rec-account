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
                <div></div>
                <div></div>
                <div></div>
                <div></div>
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
        };
    },

    created: function() {
        this.getProductsInfo();
    },
    methods: {

        switchType: function(type) {
            this.currentType = type;
        },

        getProductsInfo: function() {
            axios.get(queryUrl)
                .then((res) => {
                    if (res.status === 200) {
                        this.productInfo = res.data;
                        console.log(this.productInfo);
                    } else {
                        this.$message.error('获取产品信息失败!');
                    }
                })
                .catch((error) => {
                    this.InvokeDebug(error);
                })
        },

        getQrCode: function() {

        },
    },
};
</script>
