const Store = {
    get: function(key) {
        const value = window.localStorage.getItem(key);
        try {
            const result = JSON.parse(value);
            return result;
        } catch (e) {
            return {};
        }
    },

    set: function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },

    remove: function(key) {
        window.localStorage.removeItem(key);
    },

    clear: function() {
        window.localStorage.clear();
    }
};

export default Store;