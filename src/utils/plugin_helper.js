import objectAssign from 'object-assign';

const mergeOptions = ($vm, options) => {
    const defaults = {};
    // eslint-disable-next-line
    for (let i in $vm.$options.props) {
        if (i !== 'value') {
            defaults[i] = $vm.$options.props[i].default;
        }
    }
    const _options = objectAssign({}, defaults, options);
    // eslint-disable-next-line
    for (let i in _options) {
        $vm[i] = _options[i];
    }
};

export default mergeOptions;
