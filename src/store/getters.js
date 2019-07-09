const getters = {
    appInfo: state => state.app.appInfo,
    willGoToBuy: state => state.app.willGoToBuy,
    api_token: state => state.user.api_token,
    identity_token: state => state.user.identity_token,
    userInfo: state => state.user.userInfo,
    licenseInfo: state => state.user.licenseInfo,
    errorLogs: state => state.errorLog.logs,
};
export default getters;
