import qs from 'qs';
import supportFetch from '../utils/supportFetch';

export function getLicenseInfo(language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-user-license-info',
        language,
    }));
}

export function getOrders(page = 1, size = 10, language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-orders',
        language,
        page: page,
        per_page: size,
    }));
}

export function getRecommendProducts(language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-recommend-product',
        language,
    }));
}

export function getUrls(language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-product-urls',
        language,
    })); 
}

export function getTickets(page = 1, size = 10, language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-tickets',
        language,
        page: page,
        per_page: size,
    }));
}

export function getUnlimitedVipInfo(userId, language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-user-license-info',
        language,
        product_name: 'Online Unlimited',
    }));
}

export function getProductsList(language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get_all_apowersoft_software',
        language,
    }));
}

export function submitTicket(postData) {
    return supportFetch.post('/account', qs.stringify(postData));
}

export function queryOrderStatus(transaction_id,) {
    return supportFetch.post('/buy/apowersoft?action=query_order_status&nocache=1', qs.stringify({
        transaction_id,
    }), {
        timeout: 50000,
    });
}

export function generateOrder(coupon_code, products, identity_token, referer) {
    let postData = new FormData();
    if (coupon_code) {
        postData.append('coupon_code', coupon_code);
    }
    postData.append('type', 'attachment');
    postData.append('identity_token', identity_token);
    postData.append('Referer', referer);
    for (let i = 0, l = products.length; i < l; i++) {
        postData.append(`product[${i}][product_id]`, products[i]['product_id']);
        postData.append(`product[${i}][quantity]`, products[i]['quantity']);
    }
    return supportFetch.post(`/buy/apowersoft?action=generate_order&nocache=1`, postData);
}

export function queryCoupon(coupon_code, products, identity_token) {
    let postData = new FormData();
    postData.append('coupon_code', coupon_code);
    postData.append('type', 'attachment');
    postData.append('identity_token', identity_token);
    for (let i = 0, l = products.length; i < l; i++) {
        postData.append(`product[${i}][product_id]`, products[i]['product_id']);
        postData.append(`product[${i}][quantity]`, products[i]['quantity']);
    }
    return supportFetch.post('/buy/apowersoft?action=query_coupon&nocache=1', postData);
}