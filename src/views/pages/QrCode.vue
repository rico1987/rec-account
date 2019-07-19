<template>
    <div class="account-qr-code">
        <Switcher class="account-qr-code__switcher"></Switcher>
        <div class="account-qr-code__container">
            <h2>微信登录</h2>
            <div class="account-qr-code__qr-code" v-loading.lock="loading">
                <img :src="qrcodeUrl" />
            </div>
        </div>
    </div>
</template>

<script>
import Switcher from '@/components/Switcher.vue';
import { getQrCode, queryLoginState } from '@/api/account';
import Store from '@/utils/storage';


export default {
    name: 'qrCode',
    components: {
        Switcher,
    },
    data() {
        return {
            loading: false,
            qrcodeUrl: null,
            qrcodeKey: null,
            loadingErr: null,
        };
    },

    created: function() {
        this.getQrcode();
    },
    methods: {
        getQrcode: function() {
            this.loading = true;
            getQrCode(this.$i18n.locale)
                .then((res) => {
                    this.loading = false;
                    if (res.data.data && res.data.data.url) {
                        this.qrcodeUrl = res.data.data.url;
                        this.qrcodeKey = res.data.data.key;
                        this.queryLoginState();
                    }
                });
        },

        queryLoginState: function() {
            if (this.GLOBAL.queryInterval) {
                window.clearInterval(this.GLOBAL.queryInterval);
                this.GLOBAL.queryInterval = null;
            }
            const postData = {
                qrcode_key: this.qrcodeKey,
                language: this.$i18n.locale,
            };
            this.GLOBAL.queryInterval = window.setInterval(async () => {
                let { data } = await queryLoginState(postData);
                if (data.status === '1' && data.data && data.data.identity_token) {
                    this.$store.dispatch('SyncLoginState', data)
                        .then(() => {
                            window.clearInterval(this.GLOBAL.queryInterval);
                            this.GLOBAL.queryInterval = null;
                            const willGoToBuy = Store.get('willGoToBuy');
                            if (willGoToBuy) {
                                this.$store.dispatch('getLicenseInfo', this.$i18n.locale)
                                    .then((data) => {
                                        const isVip = data && data.is_activated == 1 && data.passport_license_type !== 'trial';
                                        if (isVip) {
                                            this.$router.push({ path: '/account-info', });
                                        } else {
                                            this.$store.dispatch('setWillGoToBuy', false);
                                            this.$router.push({ path: '/buy', });
                                        }
                                    });
                            } else {
                                this.$router.push({ path: '/account-info', });
                            }
                            this.loading = false;
                        })
                        .catch((error) => {
							this.InvokeDebug('ErrorMessge: 二维码登录失败');
                            this.InvokeDebug(error);
                        });
                }
            }, 1000);
        },
        
    },
};
</script>
