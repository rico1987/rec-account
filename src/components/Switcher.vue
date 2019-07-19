<template>
    <div class="account-switcher" @click="switchLoginMethod()">
        <div class="account-switcher__icon" v-bind:class="switcherIconClass">
        </div>
        <div class="account-switcher__bubble">{{ bubbleText }}</div>
    </div>
</template>

<script>
export default {
    name: 'Switcher',

    componentName: 'Switcher',

    props: {
    },

    computed: {
        switcherIconClass: function() {
            if (this.$route.path === '/qrcode') {
                return 'is-qrcode';
            }
            return '';
        },
        bubbleText: function() {
            if (this.$route.path === '/qrcode') {
                return '账号登陆';
            }
            return '微信登陆';
        },
    },

    methods: {
        switchLoginMethod: function() {
            if (this.$route.path === '/qrcode') {
                if (this.GLOBAL.queryInterval) {
                    window.clearInterval(this.GLOBAL.queryInterval);
                    this.GLOBAL.queryInterval = null;
                }
                this.$router.push('/account-login');
            } else {
                this.$router.push('/qrcode');
            }
        },
    },
};
</script>
