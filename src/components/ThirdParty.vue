<template>
    <div class="account-third-party">
        <!-- <div class="account-third-party__label">
            <p v-if="$route.path !== '/register'"><span @click="gotoRegister()">注册</span>&nbsp;或者&nbsp;使用第三方账号登录</p>
            <p v-if="$route.path === '/register'"><span @click="gotoLogin()">登录</span>&nbsp;或者&nbsp;使用第三方账号登录</p>
        </div> -->
        <div class="account-third-party__links">
            <span class="weixin" @click="thirdPartyLogin('weixin')"></span>
            <!-- <span class="qq" @click="thirdPartyLogin('qq')"></span>
            <span class="weibo" @click="thirdPartyLogin('weibo')"></span>
            <span class="dingtalk" @click="thirdPartyLogin('dingtalk')"></span> -->
        </div>
    </div>
</template>

<script>
import { useQuery } from '@/utils/index';

export default {
    name: 'ThirdParty',

    componentName: 'ThirdParty',

    props: {
    },

    methods: {
        gotoRegister: function() {
            this.$router.push('/register');
        },

        gotoLogin: function() {
            this.$router.push('/account-login');
        },

        thirdPartyLogin: function(name) {
            if (name === 'weixin') {
                this.$router.push('/qrcode');
            } else {
                window.open(this.getLoginURL(name));
            }
        },

        getLoginURL: function(name) {
            let origin = "https://passport.aoscdn.com";
            let provider = name;

            let returnedUrl = location.href;
            let query = {
                action: 'login',
                is_in_software: 1,
            };

            let callbackURL = useQuery(returnedUrl, query);
            
            let url = `${origin}/login/${provider}?callback_frontend=${encodeURIComponent(callbackURL)}&referer=frontend`

            return url;
        },
        
    },
};
</script>
