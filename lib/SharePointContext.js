var request = require('request');
var q = require('q');
var API = '/_api/'

module.exports = {
    SPutils: SPutils,
    REST: REST
}

function REST(SPInfo) {
    if (!SPInfo.access_token || !SPInfo) {
        throw new Error('accessToken is missing');
    }
    this.accessToken = SPInfo.access_token;
    console.log('**** Access token: ', this.accessToken)
    this.SPInfo = SPInfo;
    this.host = SPInfo.SPHostUrl;
    console.log('**** Host: ', this.host)
    this.AppWebUrl = SPInfo.SPAppWebUrl;
    console.log('**** App web Url: ', this.AppWebUrl)
    this.domain = 'https://' + SPInfo.domain
    console.log('**** Domain: ', this.domain)

    this.get = function (endpoint) {
        var defer = q.defer();
        request.get(this.domain + loadEndPoint(endpoint), this.initoptions(), defer.resolve);
        return defer.promise;
    }
    this.context = function () {
        var defer = q.defer();
        var _self = this;
        request.post(this.domain + '/_api/contextinfo', this.initoptions(), function (error, message) {
            if (error === null) {
                _self.context = JSON.parse(message.body).d
                defer.resolve({ error: error, message: JSON.parse(message.body).d });
            } else {
                console.log(message.body)
                defer.resolve({ error: true, errorMessage: error, message: {} });
            }
        })
        return defer.promise;
    }
    this.Lists = function (options) {
        var defer = q.defer();
        var _self = this;
        var url = this.domain + SPutils._api.lists
        var _options = this.initoptions(options)
        _options.uri = url;
        request(_options, function (req, res, body) {
            _self.resolve(req, res, body, defer);
        });
        return defer.promise;
    }

    this.initoptions = function (options) {
        var response = {
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
            }
        }
        if (options) {
            if (options.headers) {
                // if (options.headers["X-RequestDigest"]) {
                //     delete response.headers.Authorization
                //     response.headers["X-RequestDigest"] = options.headers["X-RequestDigest"]
                // }
                response.headers = this.mergeObjects(response.headers, options.headers)
            }
            if (options.method) response.method = options.method;
            if (options.form) response.form = options.form;
            if (options.data) response.data = options.data;
        }
        return response
    }

    this.mergeObjects = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
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
        lists: loadEndPoint('web/lists'),
        folders: loadEndPoint('web/folders'),
        fields: loadEndPoint('web/fields'),
        user: loadEndPoint('web/siteusers'),
    }
}

function loadEndPoint(location) {
    return API + location
}