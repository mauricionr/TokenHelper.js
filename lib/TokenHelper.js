var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('config.js');
var q = require('q');
function getSPAccessToken(req) {
    req.session.sp_info = req.query;
    req.session.sp_oauth = req.body;
    var client_ID = config.client_ID;
    var appSecret = config.appSecret;
    var decoded = jwt.decode(req.session.sp_oauth.SPAppToken, appSecret);
    decoded.appctx = JSON.parse(decoded.appctx);
    var appctx = decoded.appctx;
    var options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        form: {
            "grant_type": "refresh_token",
            "client_id": client_ID + '@' + decoded['appctxsender'].split('@')[1],
            "client_secret": appSecret,
            "refresh_token": decoded.refreshtoken,
            "resource": decoded['appctxsender'].split('@')[0] + '/' + "multconnect.sharepoint.com" + '@' + decoded['appctxsender'].split('@')[1]
        }
    };
    console.log('\noptions\n', JSON.stringify(options));
    var callback = function (req, res, body) {
        console.log(JSON.stringify(body));
    }
    return request.post(appctx.SecurityTokenServiceUri, options, callback)
}