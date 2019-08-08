<template>
    <div class="account-activate">
        <div class="account-activate__container">
            <h2>请输入激活码</h2>
            <el-form ref="activateForm" :model="activateForm" :rules="rules">
                <el-form-item prop="code">
                    <el-input placeholder="XXXXX-XXXXX-XXXXX-XXXXX" v-model="activateForm.code"></el-input>
                </el-form-item>
            </el-form>
            <p class="info">请输入邮件种的激活码激活软件。</p>
            <p class="info">没有激活码？<span>马上购买</span></p>
            <div class="account-activate__submit-btn">
                <p @click="submit()">
                    <span v-if="!loading">确定</span>
                    <span v-if="loading" class="loading"></span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// import { activate, } from '@/api/support';

export default {
    name: 'activate',
    components: {
    },
    data() {
        var validateCode = (rule, value, callback) => {
            if (!value || !this.activateForm.code) {
                return callback(new Error('请输入激活码'));
            } else if (!/^\w{5}-\w{5}-\w{5}-\w{5}$/.test(value)) {
                return callback(new Error('请输入有效激活码'));
            } else {
                return callback();
            }
		};
        return {
            loading: false,
            activateForm: {
                code: '',
            },
            rules: {
                code: [
                    { validator: validateCode, trigger: 'blur' },
                ],
            },
        };
    },

    created: function() {

    },
    methods: {
        submit: function() {
            // this.$refs['activateForm'].validate((valid) => {
            //     this.loading = true;
            //     InvokeApp('get-passport-info', {}, (res) => {

            //         const userInfo = res.data.user_info;
            //         const appInfo = res.data.app_info;
                    
            //         activate()
            //     });
            // });
        },
    },
};
</script>
