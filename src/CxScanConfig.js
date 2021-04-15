class CxScanConfig {
    constructor(baseuri, authType, key, secret, token, paramMap) {
        this._baseuri = baseuri;
        this._authType = authType;
        this._key = key;
        this._secret = secret;
        this._token = token;
        this._paramMap = paramMap
    }


    get baseuri() {
        return this._baseuri;
    }

    set baseuri(value) {
        this._baseuri = value;
    }

    get authType() {
        return this._authType;
    }

    set authType(value) {
        this._authType = value;
    }

    get key() {
        return this._key;
    }

    set key(value) {
        this._key = value;
    }

    get secret() {
        return this._secret;
    }

    set secret(value) {
        this._secret = value;
    }

    get token() {
        return this._token;
    }

    set token(value) {
        this._token = value;
    }

    get paramMap() {
        return this._paramMap;
    }

    set paramMap(value) {
        this._paramMap = value;
    }
}

module.exports = CxScanConfig