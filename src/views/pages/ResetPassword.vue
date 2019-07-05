<template>
    <div class="account-reset-password">
        <Switcher class="account-reset-password__switcher"></Switcher>
        <div class="account-reset-password__container">
            <div class="account-reset-password__way-switcher">
                <span class="phone" @click="switchLoginWay('phone')" v-bind:class="{ active: activeWay === 'phone' }"></span>
                <span class="email" @click="switchLoginWay('email')" v-bind:class="{ active: activeWay === 'email' }"></span>
            </div>
            <el-form ref="resetPasswordForm" :model="resetPasswordForm" :rules="rules">
                <el-form-item ref="phone" prop="phone" v-show="activeWay === 'phone'">
                    <el-input placeholder="请输入手机号" v-model="resetPasswordForm.phone">
                        <el-select v-model="resetPasswordForm.areaCode" slot="prepend" filterable placeholder="请选择">
                            <el-option
                            v-for="item in areacodes"
                            :key="item.key"
                            :label="item.code"
                            :value="item.key">
                                <span style="float: left">{{ item.area }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item ref="email" prop="email" v-show="activeWay === 'email'">
                    <el-input placeholder="邮箱" minlength="6" maxlength="50" v-model="resetPasswordForm.email">
                    </el-input>
                </el-form-item>
                <el-form-item ref="captcha" prop="captcha">
                    <el-input placeholder="验证码" minlength="6" maxlength="10" v-model="resetPasswordForm.captcha">
                        <span class="get-captcha-btn" slot="append" >
                            <span v-if="activeWay === 'phone'">
                                <span v-if="phoneTimeOutInterval">{{ phoneTimeOutCount }}</span>
                                <span class="btn" @click="sendCaptcha()" v-if="!phoneTimeOutInterval">获取</span>
                            </span>
                            <span v-if="activeWay === 'email'">
                                <span v-if="emailTimeOutInterval">{{ emailTimeOutCount }}</span>
                                <span class="btn" @click="sendCaptcha()" v-if="!emailTimeOutInterval">获取</span>
                            </span>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item ref="password" prop="password">
                    <el-input placeholder="密码" :type="passwordType" minlength="6" maxlength="50" v-model="resetPasswordForm.password">
                        <span v-bind:class="passwordAppendClass" slot="append" @click="switchPasswordType()"></span>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="account-reset-password__submit-btn">
                <p @click="submit()">重置密码</p>
            </div>
        </div>
    </div>
</template>

<script>
import Switcher from '@/components/Switcher.vue';
import { getAreaCodes, sendVcode } from '@/api/account';
import { isPhone, isEmail } from '@/utils/is';

export default {
    name: 'resetPassword',
    components: {
        Switcher,
    },
    data() {

        var validatePhone = (rule, value, callback) => {
            if (!value || !this.resetPasswordForm.areaCode) {
                return callback(new Error('Please input your phone number'));
            } else if (!isPhone(value)) {
                return callback(new Error('Please input a valid phone number'));
            } else {
                return callback();
            }
		};
		var validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                return callback(new Error('Please input a valid email address'));
            } else {
                return callback();
            }
		};
        var validateCaptcha = (rule, value, callback) => {
            if (!value || value.length !== 4) {
                return callback(new Error('Invalid verification code'));
            } else {
                return callback();
            }
        };
        return {
            areacodes: [],
            activeWay: 'phone',  // 'phone' or 'email'
            passwordType: 'password',
            resetPasswordForm: {
                phone: '',
                email: '',
                captcha: '',
                password: '',
                areaCode: '',
            },
            captchasScene: 'resetpwd',
            resendInterval: 60,
            phoneTimeOutCount: 0,
            phoneTimeOutInterval: null,
            emailTimeOutCount: 0,
            emailTimeOutInterval: null,
            rules: {
                phone: [
                    { validator: validatePhone, trigger: 'blur' },
                ],
                email: [
					{ required: true, message: 'Please input your email address', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' },
                ],
                captcha: [
                    { required: true, message: 'Please input verification code', trigger: 'blur' },
                    { validator: validateCaptcha, trigger: 'blur' },
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { min: 6, max: 30, message: 'The password length should not be less than 6 digits!', trigger: 'blur' }
                ],
            },
            loading: false,
        };
    },

    created: function() {
        this.getAreaCodes();
    },
    methods: {

        submit: function() {
            let post = {
                language: this.$i18n.locale,
			};
			if (this.activeWay === 'phone') {
				this.$refs['resetPasswordForm'].validateField('phone');
				this.$refs['resetPasswordForm'].validateField('captcha');
				this.$refs['resetPasswordForm'].validateField('password');
				if (this.$refs['phone'].validateState === 'error' ||
					this.$refs['captcha'].validateState === 'error' ||
					this.$refs['password'].validateState === 'error'
				) {
                    return;
                }
			} else if (this.activeWay === 'email') {
				this.$refs['resetPasswordForm'].validateField('email');
				this.$refs['resetPasswordForm'].validateField('captcha');
				this.$refs['resetPasswordForm'].validateField('password');
				if (this.$refs['email'].validateState === 'error' ||
					this.$refs['captcha'].validateState === 'error' ||
					this.$refs['password'].validateState === 'error'
				) {
                    return;
                }
			}
            this.loading = true;
			post['captcha'] = this.resetPasswordForm.captcha;
			post['password'] = this.resetPasswordForm.password;
			if (this.activeWay === 'phone') {
				post['country_code'] = this.resetPasswordForm.areaCode.split(':')[0];
				post['telephone'] = this.resetPasswordForm.phone;
			} else if (this.activeWay === 'email') {
				post['email'] = this.resetPasswordForm.email;
			}
			this.$store.dispatch('ResetPassword', post)
				.then(() => {
					this.$router.push({ path: '/account-info', });
					this.loading = false;
				})
				.catch((error) => {
					let errorMsg;
					if (error.status === -200) {
						if (this.activeWay === 'email') {
							errorMsg = 'The email address doesn\'t have an associated user account. You can Register Now';
						} else {
							errorMsg = 'The phone number doesn\'t have an associated user account. You can Register Now';
						}
					} else if (error.status === -206) {
						errorMsg = 'Invalid verification code';
					} 
					this.$message.error(errorMsg)
					this.loading = false;
				});
        },

        sendCaptcha: function() {
            if (this.activeWay === 'phone') {
                this.$refs['resetPasswordForm'].validateField('phone');
                if (this.$refs['phone'].validateState === 'error') {
                    this.$message.error(this.$refs['phone'].validateMessage);
                    return;
                }
            } else if (this.activeWay === 'email') {
                this.$refs['resetPasswordForm'].validateField('email');
                if (this.$refs['email'].validateState === 'error') {
                    this.$message.error(this.$refs['email'].validateMessage);
                    return;
                }
            }

            const post = {
                scene: this.captchasScene,
                language: this.$i18n.locale,
            };
            if (this.activeWay === 'phone') {
                post['telephone'] = this.resetPasswordForm.phone;
                post['country_code'] = this.resetPasswordForm.areaCode.split(':')[0];
            } else {
                post['email'] = this.resetPasswordForm.email;
            }

            sendVcode(post)
                .then((res) => {
                    if (res.data.status === '1') {
                        if (this.activeWay === 'phone') {
                            this.phoneTimeOutCount = this.resendInterval;
                            this.phoneTimeOutInterval = window.setInterval(() => {
                                this.phoneTimeOutCount --;
                                if (this.phoneTimeOutCount === 0) {
                                    window.clearInterval(this.phoneTimeOutInterval);
                                    this.phoneTimeOutInterval = null;
                                }
                            }, 1000);
                        } else if (this.activeWay === 'email') {
                            this.emailTimeOutCount = this.resendInterval;
                            this.emailTimeOutInterval = window.setInterval(() => {
                                this.emailTimeOutCount --;
                                if (this.emailTimeOutCount === 0) {
                                    window.clearInterval(this.emailTimeOutInterval);
                                    this.emailTimeOutInterval = null;
                                }
                            }, 1000);
                        }
                    }
                })
                .catch((error) => {
                    let errorMsg;
                    if (error.status === -210) {
                        errorMsg = 'You can\'t send verification code to an email address more than 3 times each day';
                    } else if (error.status === -211) {
                        errorMsg = 'You can\'t send verification code to a phone number more than 3 times each day';
                    } 
                    this.$message.error(errorMsg)
                    this.loading = false;
                });
        },

        getAreaCodes: function() {
            getAreaCodes()
                .then((res) => {
                    const arr = res.data.data;
                    if (arr) {
                        arr.forEach((ele) => {
                            this.areacodes.push({
                                code: ele.split(':')[0],
                                area: ele.split(':')[1],
                                key: ele
                            })
                        });
                    }
                });
        },

        switchLoginWay: function(way) {
            this.activeWay = way;
            this.$refs['resetPasswordForm'].resetFields();
        },

        switchPasswordType: function() {
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
    },

    computed: {
        passwordAppendClass: function() {
            return this.passwordType === 'password' ? 'eye-closed' : 'eye-open';
        },
    },
};
</script>
