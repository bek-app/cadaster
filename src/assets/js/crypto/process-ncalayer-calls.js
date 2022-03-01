var _selectedStorage = "PKCS12";
/*
function getActiveTokensCall() {
	getActiveTokens("getActiveTokensBack");
}

function getActiveTokensBack(result) {
    if (result['code'] === "500") {
        alert(result['message']);
    } else if (result['code'] === "200") {
        var listOfTokens = result['responseObject'];        
        $('#storageSelect').empty();
        $('#storageSelect').append('<option value="PKCS12">PKCS12</option>');
        for (var i = 0; i < listOfTokens.length; i++) {
            $('#storageSelect').append('<option value="' + listOfTokens[i] + '">' + listOfTokens[i] + '</option>');
        }
    }
}
*/


// AUTHENTICATION
_afterGetKeyFn: any = null;
function getKeyInfoAuthCall(afterGetKeyFn) {
    var selectedStorage = _selectedStorage;
    _afterSignFn = afterGetKeyFn;
    getKeyInfo(selectedStorage, "getKeyInfoBack");
}

function getKeyInfoCall() {
    var selectedStorage = _selectedStorage;
    getKeyInfo(selectedStorage, "getKeyInfoBack");
}

function getKeyInfoBack(result) {
    if (result['code'] === "500") {
        // alert(result['message']);
    } else if (result['code'] === "200") {
        
        var res = result['responseObject'];
        if (_afterSignFn) {
            _afterSignFn(res);
        } else {
            fillPersonData(res);
            fillOrgData(res);
            /*
            var alias = res['alias'];
            $("#alias").val(alias);

            var keyId = res['keyId'];
            $("#keyId").val(keyId);

            var algorithm = res['algorithm'];
            $("#algorithm").val(algorithm);

            var subjectCn = res['subjectCn'];
            $("#subjectCn").val(subjectCn);

            var subjectDn = res['subjectDn'];
            $("#subjectDn").val(subjectDn);

            var issuerCn = res['issuerCn'];
            $("#issuerCn").val(issuerCn);

            var issuerDn = res['issuerDn'];
            $("#issuerDn").val(issuerDn);

            var serialNumber = res['serialNumber'];
            $("#serialNumber").val(serialNumber);
            */

            var eventInput = new Event('input');
            var eventChange = new Event('change');

            var dateString = res['certNotBefore'];
            var date = new Date(Number(dateString));
            if (document.getElementById('signDateFrom')) {
                var dateFrom = date.toLocaleDateString("ru-RU");
                document.getElementById('signDateFrom').innerHTML = dateString;
                document.getElementById('signDateFrom').value = dateString;
                
                document.getElementById('signDateFrom').dispatchEvent(eventInput);        
                document.getElementById('signDateFrom').dispatchEvent(eventChange);
            }

            dateString = res['certNotAfter'];
            date = new Date(Number(dateString));
            if (document.getElementById('signDateTo')) {
                var dateFrom = date.toLocaleDateString("ru-RU");
                document.getElementById('signDateTo').innerHTML = dateString;
                document.getElementById('signDateTo').value = dateString;
                
                document.getElementById('signDateTo').dispatchEvent(eventInput);        
                document.getElementById('signDateTo').dispatchEvent(eventChange);
            }
            
            var pem = res['pem'];
            if (document.getElementById('Certificate')) {
                document.getElementById('Certificate').innerHTML = pem;
                document.getElementById('Certificate').value = pem;
                
                document.getElementById('Certificate').dispatchEvent(eventInput);        
                document.getElementById('Certificate').dispatchEvent(eventChange);
            }
        }
    }
}


var _afterSignFn = null;
var _errorSignFn = null;
var signXmlCall = function (afterSignFn, xmlToSign) {
    _afterSignFn = afterSignFn;
    var selectedStorage = _selectedStorage;

    var xmlToSignData = xmlToSign;
    if (!xmlToSign) {
        xmlToSignData = $("#xmlToSign").val();
    }

	//$.blockUI();
    signXml(selectedStorage, "SIGNATURE", xmlToSignData, "signXmlBack");
}

function signXmlBack(result) {
	//$.unblockUI();
    if (result['code'] === "500") {
        if (result['message'] == 'action.canceled') {
            
        } else {
            alert(result['message']);
        }
        
        if (_errorSignFn)
            _errorSignFn(result);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        if (_afterSignFn)
            _afterSignFn(res);
    }
}

var signXmlWithErrorCall = function (afterSignFn, errorSignFn, xmlToSign) {
    _afterSignFn = afterSignFn;
    _errorSignFn = errorSignFn;
    var selectedStorage = _selectedStorage;

    var xmlToSignData = xmlToSign;
    if (!xmlToSign) {
        xmlToSignData = $("#xmlToSign").val();
    }

	//$.blockUI();
    signXml(selectedStorage, "SIGNATURE", xmlToSignData, "signXmlBack");
}


function createCMSSignatureFromFileCall() {
    var selectedStorage = _selectedStorage;
    var flag = $("#flag").is(':checked');
    var filePath = $("#filePath").val();
    if (filePath !== null && filePath !== "") {
		$.blockUI();
        createCMSSignatureFromFile(selectedStorage, "SIGNATURE", filePath, flag, "createCMSSignatureFromFileBack");
    } else {
        alert("Не выбран файл для подписи!");
    }
}

function createCMSSignatureFromFileBack(result) {
	$.unblockUI();
    if (result['code'] === "500") {
        alert(result['message']);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        $("#createdCMS").val(res);
    }
}

function createCAdESFromBase64Call(base64ToSign, flag, afterSignFn) {
    _afterSignFn = afterSignFn;
    var selectedStorage = _selectedStorage;  
    if (base64ToSign !== null && base64ToSign !== "") {
        createCAdESFromBase64(selectedStorage, "SIGNATURE", base64ToSign, flag, "createCAdESFromBase64Back");
    } else {
        alert("Нет данных для подписи!");
    }
}

function createCAdESFromBase64Back(result) {
    if (result['code'] === "500") {
        alert(result['message']);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        //$("#createdCMSforBase64").val(res);
        if (_afterSignFn)
            _afterSignFn(res);
    }
}



function showFileChooserCall() {
    showFileChooser("ALL", "", "showFileChooserBack");
}

function showFileChooserBack(result) {
    if (result['code'] === "500") {
        alert(result['message']);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        $("#filePath").val(res);
    }
}


function findSubjectAttr(attrs, attr) {
    var tmp;
    var numb;

    for (numb = 0; numb < attrs.length; numb++) {
        tmp = attrs[numb].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if (tmp.indexOf(attr + '=') === 0) {
            return tmp.substr(attr.length + 1);
        }
    }

    return null;
}

function fillPersonData(data) {
    var subjectAttrs = data.subjectDn.split(',');
    var iin = findSubjectAttr(subjectAttrs, 'SERIALNUMBER').substr(3);
    var email = findSubjectAttr(subjectAttrs, 'E');
    var cn = findSubjectAttr(subjectAttrs, 'CN');
    cn = cn || '';
    var middleName = findSubjectAttr(subjectAttrs, 'G');
    middleName = middleName || '';
    var fullName = cn.concat(" ").concat(middleName);
    var eventInput = new Event('input');
    var eventChange = new Event('change');

    if (document.getElementById('signIIN')) {
        document.getElementById('signIIN').innerHTML = iin;
        document.getElementById('signIIN').value = iin;

        document.getElementById('signIIN').dispatchEvent(eventInput);        
        document.getElementById('signIIN').dispatchEvent(eventChange);
    }

    if (document.getElementById('UserName')) {
        document.getElementById('UserName').innerHTML = iin;
        document.getElementById('UserName').value = iin;

        document.getElementById('UserName').dispatchEvent(eventInput);        
        document.getElementById('UserName').dispatchEvent(eventChange);
    }

    if (document.getElementById('signEmail')) {
        document.getElementById('signEmail').innerHTML = email;
        document.getElementById('signEmail').value = email;
        
        document.getElementById('signEmail').dispatchEvent(eventInput);        
        document.getElementById('signEmail').dispatchEvent(eventChange);
    }
    if (document.getElementById('signFIO')) {
        document.getElementById('signFIO').innerHTML = fullName;
        document.getElementById('signFIO').value = fullName;
        
        document.getElementById('signFIO').dispatchEvent(eventInput);        
        document.getElementById('signFIO').dispatchEvent(eventChange);
    }
}

function fillOrgData(data) {
    var subjectAttrs = data.subjectDn.split(',');
    var bin = findSubjectAttr(subjectAttrs, 'OU');
    var organizationName = findSubjectAttr(subjectAttrs, 'O');
    var eventInput = new Event('input');
    var eventChange = new Event('change');

    if (bin) {
        if (bin.length > 3) {
            bin = bin.substr(3);
        }

        if (document.getElementById('signBIN')) {
            document.getElementById('signBIN').innerHTML = bin;
            document.getElementById('signBIN').value = bin;
            
            document.getElementById('signBIN').dispatchEvent(eventInput);        
            document.getElementById('signBIN').dispatchEvent(eventChange);
        }
        if (document.getElementById('signCompanyName')) {
            document.getElementById('signCompanyName').innerHTML = organizationName.split('\\\"').join('\"');
            document.getElementById('signCompanyName').value = organizationName.split('\\\"').join('\"');
            
            document.getElementById('signCompanyName').dispatchEvent(eventInput);        
            document.getElementById('signCompanyName').dispatchEvent(eventChange);
        }
    }
}


function createCMSSignatureFromFileCall() {
    var selectedStorage = $('#storageSelect').val();
    var flag = $("#flagForCMSWithTS").is(':checked');
    var filePath = $("#filePathWithTS").val();
    if (filePath !== null && filePath !== "") {
		blockScreen();
        createCMSSignatureFromFile(selectedStorage, "SIGNATURE", filePath, flag, "createCMSSignatureFromFileBack");
    } else {
        alert("Не выбран файл для подписи!");
    }
}

function createCMSSignatureFromFileBack(result) {
	unblockScreen();
    if (result['code'] === "500") {
        alert(result['message']);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        $("#createdCMSWithTS").val(res);
    }
}

function createCMSEsedoSignatureCall(base64ToSign, fileNames, afterSignFn, errorSignFn) {
    _afterSignFn = afterSignFn;
    _errorSignFn = errorSignFn;
    var selectedStorage = _selectedStorage;
    if (base64ToSign !== null && base64ToSign !== "") {
        createCMSSignatureEsedo(base64ToSign, fileNames, "createCMSEsedoSignatureBack");
    } else {
        alert("Нет данных для подписи!");
    }
}

function createCMSEsedoSignatureBack(result) {
    if (result['code'] === "500") {
        // alert(result['message']);
        console.warn(result['message']);
        if (_errorSignFn)
            _errorSignFn(result);
    } else if (result['code'] === "200") {
        var res = result['responseObject'];
        if (_afterSignFn)
            _afterSignFn(res);
    }
}
