<template>
    <div class="account-account-login">
        <Switcher class="account-account-login__switcher"></Switcher>
        <div class="account-account-login__container">
            <h2>登录</h2>
            <el-form ref="accountLoginForm" :model="accountLoginForm" :rules="rules">
                <el-form-item prop="account">
                    <el-input placeholder="手机号/邮箱" minlength="6" maxlength="50" v-model="accountLoginForm.account"></el-input>
                </el-form-item>
                 <el-form-item prop="password" >
                    <el-input placeholder="密码" type="password" minlength="6" maxlength="50" v-model="accountLoginForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div class="account-account-login__submit-btn">
                <p @click="submit()">登录</p>
            </div>
            <div class="account-account-login__links">
                <span @click="goto('/reset-password')">忘记密码</span>
                <span @click="goto('/password-less-login')">免密码登录</span>
            </div>
        </div>
        <ThirdParty class="account-account-login__third-party"></ThirdParty>
    </div>
</template>

<script>
import Switcher from '@/components/Switcher.vue';
import ThirdParty from '@/components/ThirdParty.vue';
import { isEmail } from '@/utils/is';

export default {
    name: 'accountLogin',
    components: {
        Switcher,
        ThirdParty,
    },
    data() {
        return {
            accountLoginForm: {
                account: '',
                password: '',
            },
            rules: {
                account: [
                    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
                    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }        
                ],
            },
            loading: false,
            loadingErr: null,
        };
    },

    created: function() {
    },
    methods: {
        goto: function(route) {
            this.$router.push(route);
        },

        submit: function() {
            this.$refs['accountLoginForm'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$store.dispatch('LoginByUsername', {
                        account: this.accountLoginForm.account,
                        password: this.accountLoginForm.password,
                        language: this.$i18n.locale,
                    }).then(() => {
                        this.$router.push({ path: '/account-info', });
                        this.loading = false;
                    }).catch((error) => {
                        let errorMsg;
                        if (error.status === -200) {
                            if (isEmail(this.accountLoginForm.account)) {
                                errorMsg = '该邮箱无法找到您的账号，请立即注册';
                            } else {
                                errorMsg = '该手机号无法找到您的账号，请立即注册';
                            }
                        } else if (error.status === -207) {
                            errorMsg = '账号或密码错误！';
                        } 
                        this.$message.error(errorMsg)
                        this.loading = false;
                    });
                } else {
                    return false;
                }
            });
		},
    },
};
</script>
