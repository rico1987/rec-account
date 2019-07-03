import axios from 'axios';
import config from '../config';
import Store from './storage';

const service = axios.create({
    baseURL: config.supportApiBaseUrl,
    timeout: config.timeout,
});

// 添加请求拦截器
service.interceptors.request.use((config) => {
    let identity_token = Store.get('identity_token');
    let appInfo = Store.get('appInfo');
    const product_name = appInfo.name;
    if (identity_token) {
        if (config.data) {
            if (config.data && config.data.length > 0) {
                config.data += `&identity_token=${identity_token}`;
            } else {
                config.data += `identity_token=${identity_token}`;
            }
        } else {
            config.data = `identity_token=${identity_token}`;
        }
    }
    if (product_name) {
        if (config.data) {
            if (config.data && config.data.length > 0) {
                config.data += `&product_name=${product_name}`;
            } else {
                config.data += `product_name=${product_name}`;
            }
        } else {
            config.data = `product_name=${product_name}`;
        }
    }
    return config;
}, error => Promise.reject(error));

// 添加响应拦截器
service.interceptors.response.use(response => response, (error) => {
    Promise.reject(error.message);
});

export default service;
