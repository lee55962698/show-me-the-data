var PARAM_KEY = '__qa',
    LANGUAGE_KEY = '__type';

(function() {
    var KEY_URL = 'http://cp01-tieba-ftp00.cp01.baidu.com:8080/tbtool/ajax/key.php';
    // var KEY_URL = 'http://shishaokun.fe.baidu.com/tbtool/showmethedata/key.php';

    function _getKeyFromCache() {
        try {
            var value = localStorage.getItem(PARAM_KEY);
            if (value === "") {
                return false;
            } else {
                var time = localStorage.getItem('time');
                if ((new Date(Number(time))).toDateString() === (new Date()).toDateString()) {
                    return value;
                } else {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    function _cacheKeyFromServer(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function handleStateChange(xhrpe) {
            if (xhrpe.srcElement.readyState !== 4) {
                return;
            }
            var response = xhrpe.srcElement.response;
            localStorage.setItem(PARAM_KEY, response);
            localStorage.setItem('time', Date.now());
            if (typeof callback === 'function') callback(response);
        };
        xhr.open("GET", KEY_URL, true);
        xhr.send();
    }

    var Cache = {
        getKey: function(callback) {
            var key = _getKeyFromCache();
            if (key) {
                callback(key);
            } else {
                _cacheKeyFromServer(callback);
            }
        },
        getLanguage: function() {
            try {
                language = localStorage.getItem('language');
            } catch (e) {}
            return language || 'php';
        },
        setLanguage: function(language) {
            try {
                localStorage.setItem('language', language);
            } catch (e) {}
        }
    };

    window.Cache = Cache;
})();