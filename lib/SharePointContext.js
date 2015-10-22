var request = require('request');
var q = require('q');
var API = '/_api/'

module.exports = {
    SPutils: SPutils,
    REST: REST
}

function REST(SPInfo,name) {
    if (!SPInfo.access_token || !SPInfo) {
        throw new Error('accessToken is missing');
    }
    this.requestDigest = 'X-RequestDigest'
    this.accessToken = SPInfo.access_token;
    this.SPInfo = SPInfo;
    this.HostWebUrl = SPInfo.SPSiteUrl;
    this.AppWebUrl = SPInfo.SPSiteUrl;
    this.name = name
    if (this.AppWebUrl.indexOf(this.name) === -1) {
        this.AppWebUrl = this.AppWebUrl + this.name
    }
    this.domain = 'https://' + SPInfo.domain
    this.utils = SPutils;
    this.get = function (endpoint) {
        var defer = q.defer();
        request.get(this.domain + loadEndPoint(endpoint), this.initoptions(), defer.resolve);
        return defer.promise;
    }

    this.GetContext = function (url) {
        var defer = q.defer();
        var _self = this;
        if (!url) {
            throw Error('Missing URL parameter.')
        }
        request.post(url + API + 'contextinfo', this.initoptions(), function (error, message) {
            if (error === null) {
                _self.context = JSON.parse(message.body).d
                defer.resolve({ error: error, message: JSON.parse(message.body).d });
            } else {
                defer.resolve({ error: true, errorMessage: error, message: {} });
            }
        })
        return defer.promise;
    }

    this.Lists = function (options, url) {
        var defer = q.defer();
        var _self = this;
        var _selfoptions = options;
        _selfoptions.headers = options.headers || {}
        function req(requestOptions) {
            request(_self.initoptions(requestOptions), function (req, res, body) {
                try {
                    var response = JSON.parse(body)
                    if (response.error) {
                        console.log(response.error.message)
                    }
                } catch (e) {

                } finally {
                    _self.resolve(req, res, body, defer);
                }

            });
        }
        if (options.method) {
            if (options.method === "POST") {
                this.GetContext(url).then(function (response) {
                    _selfoptions.headers[_self.requestDigest] = response.message.GetContextWebInformation.FormDigestValue
                    req(_selfoptions);
                })
            }
        } else {
            req(options)
        }
        return defer.promise;
    }

    this.initoptions = function (options) {
        var response = {
            headers: {
                'Authorization': 'Bearer ' + this.accessToken,
                'accept': 'application/json;odata=verbose',
                'content-type': 'application/json;odata=verbose',
            }
        }
        if (options) {
            if (options.uri) response.uri = options.uri
            if (options.headers) response.headers = this.mergeObjects(response.headers, options.headers)
            if (options.method) {
                if (options.method === "POST") {
                    response.headers[this.requestDigest] = options.headers[this.requestDigest]
                }
                response.method = options.method
            }
            if (options.form) response.form = options.form
            if (options.data) response.data = options.data
            if (options.body) response.body = typeof options.body === 'object' ? JSON.stringify(options.body) : options.body
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
            defer.resolve(arguments);
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
        listItemsByTitle: function (title) {
            return loadEndPoint("web/lists/getbytitle('" + title + "')/items")
        },
        listItemByTitleAndId: function (title, ID) {
            return loadEndPoint("web/lists/getbytitle('" + title + "')/items(" + ID + ")")
        },
        listByTitle: function (title) {
            return loadEndPoint("web/lists/getbytitle('" + title + "')/")
        },
        folders: loadEndPoint('web/folders'),
        fields: loadEndPoint('web/fields'),
        user: loadEndPoint('web/siteusers'),
    }
}

function loadEndPoint(location) {
    return API + location
}