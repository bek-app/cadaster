var webSocket = null;
var heartbeat_msg = '--heartbeat--';
var heartbeat_interval = null;
var missed_heartbeats = 0;
var missed_heartbeats_limit_min = 3;
var missed_heartbeats_limit_max = 50;
var missed_heartbeats_limit = missed_heartbeats_limit_min;
var callback = null;
var isSetLimitMin = true;
//var rw = null;


var webSocket_init = function (callbackM, callbackError) {
    if (webSocket === null || webSocket.readyState === 3 || webSocket.readyState === 2) {
        webSocket = new WebSocket('wss://127.0.0.1:13579/');

        webSocket.onopen = function (event) {
            if (heartbeat_interval === null) {
                missed_heartbeats = 0;
                heartbeat_interval = setInterval(pingLayer, 2000);
            }
            isSetLimitMin = false;
            if (callbackM) {
                window[callbackM]();
            }
            console.log("Connection opened");
        };

        webSocket.onclose = function (event) {
            if (event.wasClean) {
                console.log('connection has been closed');
            } else {
                console.log('Connection error');
                openDialog();
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
        };

        webSocket.onmessage = function (event) {
            if (event.data === heartbeat_msg) {
                missed_heartbeats = 0;
                return;
            }

            var result = JSON.parse(event.data);

            if (result != null) {
                var rw = {
                    code: result['code'],
                    message: result['message'],
                    responseObject: result['responseObject'],
                    getResult: function () {
                        return this.result;
                    },
                    getMessage: function () {
                        return this.message;
                    },
                    getResponseObject: function () {
                        return this.responseObject;
                    },
                    getCode: function () {
                        return this.code;
                    }
                };
                if (callback)
                    window[callback](rw);
            }
            console.log(event);
            if (isSetLimitMin)
                setMissedHeartbeatsLimitToMin();
            isSetLimitMin = true;
        };

        webSocket.onerror = function(event) {
            if (callbackError) {
                callbackError();
            }
            console.log('Connection error');
            openDialog();
        };

        return true;
    }
    return false;
}

function setMissedHeartbeatsLimitToMax() {
    missed_heartbeats_limit = missed_heartbeats_limit_max;
}

function setMissedHeartbeatsLimitToMin() {
    missed_heartbeats_limit = missed_heartbeats_limit_min;
}

function blockScreen() {
    $.blockUI({
        message: 'Подождите, идет загрузка Java-апплета...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
}

function openDialog() {
    if (confirm("Ошибка при подключений к NCALayer. Убедитесь что программа запущена и нажмите ОК") === true) {
        location.reload();
    }
}

function unBlockScreen() {
    $.unblockUI();
}

function pingLayer() {
    console.log("pinging...");
    try {
        missed_heartbeats++;
        if (missed_heartbeats >= missed_heartbeats_limit)
            throw new Error("Too many missed heartbeats.");
        webSocket.send(heartbeat_msg);
    } catch (e) {
        clearInterval(heartbeat_interval);
        heartbeat_interval = null;
        console.warn("Closing connection. Reason: " + e.message);
        webSocket.close();
    }
}

function getActiveTokens(callBack) {
    var getActiveTokens = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "getActiveTokens"
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(getActiveTokens));
}

function getKeyInfo(storageName, callBack) {
    var getKeyInfo = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "getKeyInfo",
        "args": [storageName]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(getKeyInfo));
}

function signXml(storageName, keyType, xmlToSign, callBack) {
    var signXml = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "signXml",
        "args": [storageName, keyType, xmlToSign, "", ""]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(signXml));
}

function createCMSSignatureFromFile(storageName, keyType, filePath, flag, callBack) {
    var createCMSSignatureFromFile = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "createCMSSignatureFromFile",
        "args": [storageName, keyType, filePath, flag]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCMSSignatureFromFile));
}

function createCAdESFromBase64(storageName, keyType, base64ToSign, flag, callBack) {
    var createCAdESFromBase64 = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "createCAdESFromBase64",
        "args": [storageName, keyType, base64ToSign, flag]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCAdESFromBase64));
}

function createCAdESFromBase64Hash(storageName, keyType, base64ToSign, callBack) {
    var createCAdESFromBase64Hash = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "createCAdESFromBase64Hash",
        "args": [storageName, keyType, base64ToSign]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCAdESFromBase64Hash));
}

function createCMSSignatureFromFile(storageName, keyType, filePath, flag, callBack) {
    var createCMSSignatureFromFile = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "createCMSSignatureFromFile",
        "args": [storageName, keyType, filePath, flag]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCMSSignatureFromFile));
}

function createCMSSignatureFromBase64(storageName, keyType, base64ToSign, flag, callBack) {
    var createCMSSignatureFromBase64 = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "createCMSSignatureFromBase64",
        "args": [storageName, keyType, base64ToSign, flag]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCMSSignatureFromBase64));
}


function applyCAdEST(storageName, keyType, cmsForTS, callBack) {
    var applyCAdEST = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "applyCAdEST",
        "args": [storageName, keyType, cmsForTS]
    };
    callback = callBack;
    webSocket.send(JSON.stringify(applyCAdEST));
}

function showFileChooser(fileExtension, currentDirectory, callBack) {
    var showFileChooser = {
		"module": "kz.gov.pki.knca.commonUtils",
        "method": "showFileChooser",
        "args": [fileExtension, currentDirectory]
    };
    callback = callBack;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(showFileChooser));
}

function createCMSSignatureEsedo(dataToSignBase64, signFileNames, callBackP) {
    var createCMSSignatureFromBase64 = {
		"module": "kz.nitec.eup.eupsigner",
        "args": [dataToSignBase64, signFileNames]
    };
    callback = callBackP;
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(createCMSSignatureFromBase64));
}