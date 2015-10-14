var request = require('request');
var q = require('q');
var API = '/_api/'

module.exports = {
    SPutils: SPutils,
    REST: REST
}

function REST(SPInfo) {
    if (!SPInfo.access_token || !SPInfo) { throw new Error('accessToken is missing'); }
    this.accessToken = SPInfo.access_token;
    this.SPInfo = SPInfo;
    this.host = SPInfo.SPHostUrl;
    this.AppWebUrl = SPInfo.SPAppWebUrl;
    this.domain = 'https://' + SPInfo.domain
<<<<<<< HEAD
    
    this.get = function (endpoint) {
        var defer = q.defer();
        request.get(this.domain + loadEndPoint(endpoint), this.initoptions(), defer.resolve);
        return defer.promise;
    }

=======
    this.get = function (endpoint) {
        var defer = q.defer();
        var call = request.get(this.domain + loadEndPoint(endpoint), this.initoptions(), defer.resolve);
        return defer.promise;
    }
    
>>>>>>> 6a89e98b70d9a0d0ccc058b21313897d67b215ba
    this.Lists = function (options) {
        var defer = q.defer();
        var _self = this;
        request(this.domain + SPutils._api.lists, this.initoptions(options), function (req, res, body) {
            console.log(JSON.stringify(body));
            _self.resolve(req, res, body, defer);
        });
        return defer.promise;
    }
<<<<<<< HEAD

=======
    
>>>>>>> 6a89e98b70d9a0d0ccc058b21313897d67b215ba
    this.initoptions = function (options) {
        var response = {
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose"
            }
        }
        if (options) {
            if (options.method) response.method = options.method;
            if (options.form) response.form = options.form;
            if (options.data) response.data = options.data;
        }
        return response
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