const isMac = /macintosh/i.test(navigator.userAgent);
const callbackCache = {};

export function InvokeApp(action, obj, cb, scope) {

    if (typeof obj === 'function') {
        scope = cb;
        cb = obj;
        obj = null;
    }

    if (isMac) {
        const mac_object = {
            action: action,
            data: obj,
        };

        if (cb) {
            callbackCache[action] = cb.bind(scope);
        }

        if (window.env && window.env.isInWeb || window.app && window.app.isInWeb) {
            if (cb) {
                cb.call(scope, null);
            }
        } else {
            alert('InvokeApp:' + JSON.stringify(mac_object));
        }
    } else {
        const str = obj ? JSON.stringify(obj) : '{}';
        let result = null;

        try {
            if (action !== 'debug') {
                InvokeApp('debug', {
                    data: 'InvokeApp: ' + action + ': ' + str
                })
            }

            if (typeof window.JsInvokeApp !== 'undefined') {
                result = window.JsInvokeApp(action, str);
            } else {
                result = window.external.InvokeApp(action, str);
            }

            if (result) {
                result = JSON.parse(result);
            }
        } catch (err) {
            if (action !== 'debug') {
                InvokeApp('debug', {
                    data: 'InvokeAppError: ' + err.message,
                });
            }
        }

        if (cb) {
            cb.call(scope, result);
        }
    }
}

export function InvokeDebug(data) {
    InvokeApp('debug', {
        data: JSON.stringify(data),
    });
    console.log(data);
}

export function openUrl(url) {
    InvokeApp('open-file', {
        file: url,
    });
}