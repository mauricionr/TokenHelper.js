var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('config.js');
var q = require('q');


function GetContextTokenFromRequest(obj) {
    return obj.refreshtoken;
}
function GetFormattedPrincipal(principalName, hostName, realm) {
    if (hostName) {
        return String.Format("{0}/{1}@{2}", principalName, hostName, realm);
    }
    return String.Format("{0}@{1}", principalName, realm);
}
function GetAccessTokenFromContextTokenRequest(req) {
    req.session.sp_info = req.query;
    req.session.sp_oauth = req.body;
    var defer = q.defer()
        , client_ID = config.client_ID
        , appSecret = config.appSecret
        , decoded = jwt.decode(req.session.sp_oauth.SPAppToken, appSecret);

    decoded.appctx = JSON.parse(decoded.appctx);
    var appctx = decoded.appctx
        , params = decoded['appctxsender'].split('@')
        , options = {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            form: {
                "grant_type": "refresh_token",
                "client_id": GetFormattedPrincipal(client_ID, params[1]),
                "client_secret": appSecret,
                "refresh_token": decoded.refreshtoken,
                "resource": GetFormattedPrincipal(params[0], "<domain>.sharepoint.com", params[1])
            }
        },
        callback = function (req, res, body) {
            defer.resolve({ req: req, res: res, body: body });
        };
    request.post(appctx.SecurityTokenServiceUri, options, callback);
    return defer.promise;
}


if (!String.prototype.Format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}