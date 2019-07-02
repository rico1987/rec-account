<template>
    <div class="account-account-info">
        <div class="account-account-info__container">

        </div>
    </div>
</template>

<script>
import Store from '@/utils/storage';

export default {
    name: 'accountInfo',
    components: {
    },
    data() {
        return {
            userInfo: null,
        };
    },

    created: function() {
        this.getAccountInfo();
        this.getLicenseInfo();
    },
    methods: {
        getAccountInfo: function() {
            this.userInfo = Store.get('userInfo');
        },

        getLicenseInfo: function() {
        },
    },
};
</script>
