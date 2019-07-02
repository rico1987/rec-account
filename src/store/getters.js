const getters = {
    language: state => state.app.language,
    route: state => state.app.route,
    api_token: state => state.user.api_token,
    identity_token: state => state.user.identity_token,
    userInfo: state => state.user.userInfo,
    licenseInfo: state => state.user.licenseInfo,
    errorLogs: state => state.errorLog.logs,
};
export default getters;
