<template>
    <div class="account-register">
        <Switcher class="account-register__switcher"></Switcher>
        <div class="account-register__container">
            <div class="account-register__way-switcher">
                <span class="phone" @click="switchLoginWay('phone')" v-bind:class="{ active: activeWay === 'phone' }"></span>
                <span class="email" @click="switchLoginWay('email')" v-bind:class="{ active: activeWay === 'email' }"></span>
            </div>
            <el-form ref="registerForm" :model="registerForm" :rules="rules">
                <el-form-item ref="phone" prop="phone" v-show="activeWay === 'phone'">
                    <el-input placeholder="请输入手机号" v-model="registerForm.phone">
                        <el-select v-model="registerForm.areaCode" slot="prepend" filterable placeholder="请选择">
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
                    <el-input placeholder="邮箱" minlength="6" maxlength="50" v-model="registerForm.email">
                    </el-input>
                </el-form-item>
                <el-form-item ref="captcha" prop="captcha">
                    <el-input placeholder="验证码" minlength="6" maxlength="10" v-model="registerForm.captcha">
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
                    <el-input placeholder="密码" :type="passwordType" minlength="6" maxlength="50" v-model="registerForm.password">
                        <span v-bind:class="passwordAppendClass" slot="append" @click="switchPasswordType()"></span>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="account-register__submit-btn">
                <p @click="submit()">注册</p>
            </div>
            <div class="account-password-less-login__links">
                <span @click="goto('/qrcode')">二维码登陆</span>
                <span @click="goto('/account-login')">账号密码登陆</span>
            </div>
        </div>
    </div>
</template>

<script>
import Switcher from '@/components/Switcher.vue';
import ThirdParty from '@/components/ThirdParty.vue';
import { getAreaCodes, sendVcode } from '@/api/account';
import { isPhone, isEmail } from '@/utils/is';

export default {
    name: 'register',
    components: {
        Switcher,
        ThirdParty,
    },
    data() {

        var validatePhone = (rule, value, callback) => {
            if (!value || !this.registerForm.areaCode) {
                return callback(new Error('请输入手机号码'));
            } else if (!isPhone(value)) {
                return callback(new Error('请输入有效手机号码'));
            } else {
                return callback();
            }
		};
		var validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                return callback(new Error('请输入有效邮箱'));
            } else {
                return callback();
            }
		};
        var validateCaptcha = (rule, value, callback) => {
            if (!value || value.length !== 4) {
                return callback(new Error('无效验证码'));
            } else {
                return callback();
            }
        };
        return {
            areacodes: [],
            activeWay: 'phone',  // 'phone' or 'email'
            passwordType: 'password',
            registerForm: {
                phone: '',
                email: '',
                captcha: '',
                password: '',
                areaCode: '',
            },
            captchasScene: 'register',
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
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' },
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { validator: validateCaptcha, trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 30, message: '密码长度至少为6位！', trigger: 'blur' }
                ],
            },
            loading: false,
        };
    },

    created: function() {
        this.getAreaCodes();
    },
    methods: {

        goto: function(route) {
            this.$router.push(route);
        },
        
        submit: function() {
            let post = {
                language: this.$i18n.locale,
			};
			if (this.activeWay === 'phone') {
				this.$refs['registerForm'].validateField('phone');
				this.$refs['registerForm'].validateField('captcha');
				this.$refs['registerForm'].validateField('password');
				if (this.$refs['phone'].validateState === 'error' ||
					this.$refs['captcha'].validateState === 'error' ||
					this.$refs['password'].validateState === 'error'
				) {
                    return;
                }
			} else if (this.activeWay === 'email') {
				this.$refs['registerForm'].validateField('email');
				this.$refs['registerForm'].validateField('captcha');
				this.$refs['registerForm'].validateField('password');
				if (this.$refs['email'].validateState === 'error' ||
					this.$refs['captcha'].validateState === 'error' ||
					this.$refs['password'].validateState === 'error'
				) {
                    return;
                }
			}
            this.loading = true;
            post['brand'] = 'Apowersoft';
			post['captcha'] = this.registerForm.captcha;
            post['password'] = this.registerForm.password;
            post['language'] = this.$i18n.locale;
            post['registed_app'] = 'ApowerRec';
			if (this.activeWay === 'phone') {
				post['country_code'] = this.registerForm.areaCode.split(':')[0];
				post['telephone'] = this.registerForm.phone;
			} else if (this.activeWay === 'email') {
				post['email'] = this.registerForm.email;
			}
			this.$store.dispatch('Register', post)
				.then(() => {
					this.$router.push({ path: '/account-info', });
					this.loading = false;
				})
				.catch((error) => {
					let errorMsg;
					if (error.status === -208) {
						if (this.activeWay === 'email') {
							errorMsg = '该邮箱已注册，可直接登录';
						} else {
							errorMsg = '该手机号已注册，请直接登录';
						}
					} else if (error.status === -206) {
                        errorMsg = '无效验证码';
                    }
					this.$message.error(errorMsg)
					this.loading = false;
				});
        },

        sendCaptcha: function() {
            if (this.activeWay === 'phone') {
                this.$refs['registerForm'].validateField('phone');
                if (this.$refs['phone'].validateState === 'error') {
                    this.$message.error(this.$refs['phone'].validateMessage);
                    return;
                }
            } else if (this.activeWay === 'email') {
                this.$refs['registerForm'].validateField('email');
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
                post['telephone'] = this.registerForm.phone;
                post['country_code'] = this.registerForm.areaCode.split(':')[0];
            } else {
                post['email'] = this.registerForm.email;
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
                        errorMsg = '同一邮箱每天只能发送三次验证码';
                    } else if (error.status === -211) {
                        errorMsg = '同一手机号码每天只能发送三次验证码';
                    } else if (error.status === -208) {
                        if (this.activeWay === 'email') {
							errorMsg = '该邮箱已注册，可直接登录';
						} else {
							errorMsg = '该手机号已注册，请直接登录';
						}
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
            this.$refs['registerForm'].resetFields();
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
