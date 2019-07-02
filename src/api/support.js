import qs from 'qs';
import supportFetch from '../utils/supportFetch';

export function getOrders(page = 1, size = 10, language) {
    return supportFetch.post('/account', qs.stringify({
        action: 'get-orders',
        language,
        page: page,
        per_page: size,
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

