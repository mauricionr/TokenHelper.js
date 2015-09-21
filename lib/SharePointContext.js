module.exports = {
    SPutils: SPutils,
    REST: REST
}

var request = require('request');
var q = require('q');

var API = '/_api/'

function loadEndPoint(location) {
    return API + location
}

function REST(SPInfo) {
    if (!SPInfo.access_token || !SPInfo) { throw new Error('accessToken is missing'); }
    this.accessToken = SPInfo.access_token;
    this.SPInfo = SPInfo;
    this.host = SPInfo.SPHostUrl;
    this.AppWebUrl = SPInfo.SPAppWebUrl;

    this.get = function (endpoint) {
        var defer = q.defer();
        var call = request.get(this.host + loadEndPoint(endpoint), this.initoptions(), defer.resolve);
        return defer.promise;
    }

    this.Lists = function () {
        var defer = q.defer();
        var _self = this;
        request(this.host + SPutils._api.lists, this.initoptions(), function (req, res, body) {
            _self.resolve(req, res, body, defer);
        });
        return defer.promise;
    }

    this.initoptions = function () {
        return {
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose"
            }
        }
    }
    this.resolve = function (req, res, body, defer) {
        try {
            defer.resolve(JSON.parse(body));
        } catch (e) {
            defer.reject(arguments[0]);
        }
    }
}

var SPutils = {
    API: API,
    loadEndPoint: loadEndPoint,
    _api: {
        web: loadEndPoint('web'),
        currentUser: loadEndPoint('web/currentuser'),
        lists: loadEndPoint('lists'),
        folders: loadEndPoint('folders'),
        fields: loadEndPoint('fields'),
        user: loadEndPoint('siteusers'),
    }
}

