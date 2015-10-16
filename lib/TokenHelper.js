var request = require('request');
var jwt = require('jsonwebtoken');
var q = require('q');

module.exports = {
    GetAccessTokenFromContextTokenRequest: GetAccessTokenFromContextTokenRequest
}
/**
 * Private
 */
function GetContextTokenFromRequest(obj) {
    return obj.refreshtoken;
}
function GetFormattedPrincipal(principalName, hostName, realm) {
    var name;
    if (hostName) {
        name = principalName + "/" + hostName + "@" + realm;
    } else {
        name = principalName + "@" + realm
    }
    console.log('Formated princial :', name)
    return name
}
/**
 * Public
 */
function GetAccessTokenFromContextTokenRequest(req, client_ID, appSecret) {
    req.session.sp_info = req.query;
    req.session.sp_oauth = req.body;
    var defer = q.defer()
    var decoded = jwt.decode(req.session.sp_oauth.SPAppToken, appSecret);
    decoded.appctx = JSON.parse(decoded.appctx);
    var domain = getDomain(req.session.sp_oauth.SPSiteUrl);
    var appctx = decoded.appctx
    var params = decoded['appctxsender'].split('@')
    var form = {
        "grant_type": "refresh_token",
        "client_id": GetFormattedPrincipal(client_ID, false, params[1]),
        "client_secret": appSecret,
        "refresh_token": decoded.refreshtoken,
        "resource": GetFormattedPrincipal(params[0], domain, params[1])
    }
    var headers = { "Content-Type": "application/x-www-form-urlencoded" }
    var options = {
        headers: headers,
        form: form
    }
    var callback = function (req, res, body) {
        defer.resolve({ req: req, res: res, body: body, domain: domain });
    };
    request.post(appctx.SecurityTokenServiceUri, options, callback);
    return defer.promise;
}
function getDomain(SPSiteUrl) {
    SPSiteUrl = SPSiteUrl.split('://')[1];
    var start = SPSiteUrl.indexOf('/');
    return SPSiteUrl.substring(0, start)
}
function getSite(url) {
    url = url.split('://')[1];
    return url
}