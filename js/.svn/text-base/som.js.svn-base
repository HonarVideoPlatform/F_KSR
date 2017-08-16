// Copyright (c) 2012 Big Nerd Software, LLC
// ALL RIGHTS RESERVED
//
// For more details read corresponding txt file

function somStartRecorder(options) {
    if (options.jarHostPath.charAt(options.jarHostPath.length-1)!='/') {
        options.jarHostPath += '/';
    }

    var params = new Array(
        options.partner.id,
        "tmps=TMPDIR,REALTMPDIR",
        "som.*.runapplet.lockname=RUN_LOADED_LOCK_NAME",
        "som.*.applet.partnerId="+options.partner.id,
        "som.*.applet.partnerSite="+options.partner.site,
        "som.*.applet.partnerKey="+options.partner.key,
        "som.*.applet.uploadPostEncoderUrl="+options.jarHostPath+"som-mp4-OS-encoder-2.zip",
        "som.*.applet.exportFileEncoderUrl="+options.jarHostPath+"som-mp4-OS-encoder-2.zip",
        "som.*.applet.mp4FastStartUrl="+options.jarHostPath+"som-mp4-OS-faststart.zip"
    );

    if (options.partner.expires)
        params.push("som.*.applet.partnerExpires="+options.partner.expires);

    if (options.captureId)
        params.push("som.*.recorderbody.captureId="+options.captureId);

    if (options.uploadOptionsUrl)
        params.push("som.*.upload.requestParamsUrl="+options.uploadOptionsUrl);

    for (var i in options.uploadOptions) {
        params.push("som.*.applet."+i+"="+options.uploadOptions[i]);
    }

    for (var k in options.recorderOptions) {
        params.push("som.*.applet."+k+"="+options.recorderOptions[k]);
    }

    for (var j in options.sidePanelProperties) {
        if(options.sidePanelProperties[j] !== "")
        {
            params.push(j+"="+options.sidePanelProperties[j]);
        }
    }

    if (options.showManager)
        params.push("showManager=true");

    if (options.defaultLocation)
        params.push("som.*.editor.defaultLocation="+options.defaultLocation);

    _somCallBackMap = new Array();
    _somCallBackMap['doCapture'] = options.captureCallBack;
    _somCallBackMap['doUpload'] = options.uploadCallBack;
    _somCallBackMap['onExit'] = options.onExitCallBack;

    var className = 'ScreenRecorder';
    if (options.sidePanelOnly)
        className = 'RecorderWithSidePanel';

    _somStart(className, options, params, 'doRun', function(result) {
        if (result=='true') result='success';
        if (result=='false') result='error';
        if (result=='locked') result='already';
        options.callback(result);
    });
}

function somUploadLogs(options) {
    if (options.jarHostPath.charAt(options.jarHostPath.length-1)!='/') {
        options.jarHostPath += '/';
    }

    var params = new Array(
        options.partner.id,
        "som.*.applet.partnerId="+options.partner.id,
        "som.*.applet.partnerSite="+options.partner.site,
        "som.*.applet.partnerKey="+options.partner.key
    );

    if (options.partner.expires)
        params.push("som.*.applet.partnerExpires="+options.partner.expires);

    if (options.captureId)
        params.push("som.*.recorderbody.captureId="+options.captureId);

    if (options.uploadOptionsUrl)
        params.push("som.*.upload.requestParamsUrl="+options.uploadOptionsUrl);

    for (var i in options.uploadOptions) {
        params.push("som.*.applet."+i+"="+options.uploadOptions[i]);
    }

    _somStart('ScreenRecorder', options, params, 'doUploadLog', function(result) {
        if (result=='done') result='success';
        options.callback(result);
    });
}

//
// Internal stuff...
//

var _somRunJar = 'ScreencastOMaticRun-1.0.32.jar';
var _somAppletWarningTimeoutMS = 60000;
var _somAppletWarningTimeoutId;
var _somUserCallBack;
var _somInCallBack;
var _somOnLoadCallBack;
var _somOnDownloadCallBack;
var _somCallBackMap;

function _somStart(className, options, params, doName, callback) {
    var extra =
        '<param name="runClass" value="'+className+'"/>\n'+
        '<param name="callBackListener" value="_somCallBackListener"/>\n'+
        '<param name="'+doName+'" value="_somCallBack"/>\n';

    var i;

    for (i in options.jars) {
        extra += '<param name="runJar'+i+'" value="'+options.jarHostPath+options.jars[i]+'"/>\n';
    }

    for (i in params) {
        extra += '<param name="runParam'+i+'" value="'+params[i]+'"/>\n';
    }

    if (options.onLoadCallBack) {
        _somOnLoadCallBack = options.onLoadCallBack;
        extra += '<param name="doSetup" value="_somOnSetupCallBack"/>\n';
    }

    if (options.onDownloadCallBack) {
        _somOnDownloadCallBack = options.onDownloadCallBack;
        extra += '<param name="downloadingCallback" value="_somDownloadCallBack"/>\n';
    }

    if (options.uploadLogUrl) {
        extra += '<param name="uploadLogUrl" value="'+options.uploadLogUrl+'"/>\n';
    }

    if (options.macLauncherZip) {
        extra += '<param name="macLauncherUrl" value="'+options.jarHostPath+options.macLauncherZip+'"/>\n';
        extra += '<param name="macLauncherAppName" value="ScreenRecorder"/>\n';
    }

    _somAppletWarningTimeoutId = setTimeout("_somAppletWarningTimeout()", _somAppletWarningTimeoutMS);

    _somAddHiddenApplet(
        function(result) {
            // If we get any callback then we can clear the timeout
            if (_somAppletWarningTimeoutId) {
                clearTimeout(_somAppletWarningTimeoutId);
                _somAppletWarningTimeoutId = undefined;
            }

            callback(result);
        },
        options,
        extra
    );
}

function _somAddHiddenApplet(callBack, options, extraParams) {
    try {
        var div = document.getElementById('somAppletContainer');
        if (!div) {
            div = document.createElement('div');
            div.id = 'somAppletContainer';
            document.body.appendChild(div);
        }

        _somUserCallBack = callBack;


        var appletTag = _somBuildApplet(options, extraParams);

        if (_somInCallBack) {
            setTimeout(function(){div.innerHTML = appletTag},100);
        }
        else {
            div.innerHTML = appletTag;
        }
    }
    catch (ex) {
        _somUserCallBack=undefined;
        setTimeout(function(){callBack('error')}, 100);
    }
}

function _somClearHiddenApplet() {
    var div = document.getElementById('somAppletContainer');
    if (_somInCallBack) {
        setTimeout(function(){div.innerHTML = ''},100);
    }
    else {
        div.innerHTML = '';
    }
}

function _somBuildApplet(options, extraParams) {
    return '<applet archive="'+ options.jarHostPath+_somRunJar +'" code="RunApplet.class" width="1" height="1" MAYSCRIPT>\n' +
           "    <param name=\"java_arguments\" value=\"-Xmx256m\">\n" +
           "    <param name=\"partnerId\" value=\""+options.partner.id+"\"/>\n" +
           "    <param name=\"partnerSite\" value=\""+options.partner.site+"\"/>\n" +
           "    <param name=\"partnerKey\" value=\""+options.partner.key+"\"/>\n" +
           "    <param name=\"doIfCertDenied\" value=\"_somAppletCertDenied\"/>\n" +
           ((options.macName==undefined || options.macName=="") ? "" : "<param name=\"macName\" value=\"" + options.macName + "\"/>\n") +
           ((options.partner.expires==undefined || options.partner.expires=="") ? "" : "<param name=\"partnerExpires\" value=\"" + options.partner.expires + "\"/>\n") +
           ((extraParams) ? extraParams : "") +
           "</applet>";
}

function _somAppletWarningTimeout() {
    if (_somUserCallBack) _somUserCallBack('timeout');
}

function _somAppletCertDenied() {
    if (_somUserCallBack) _somUserCallBack('certdenied');
}

function _somCallBack(a1,a2,a3,a4,a5) {
    _somInCallBack=true;
    if (_somUserCallBack)
        _somUserCallBack(a1,a2,a3,a4,a5);
    _somInCallBack=false;
}

function _somCallBackListener(func,a1,a2,a3,a4,a5) {
    _somInCallBack=true;
    if (_somCallBackMap[func]) {
        _somCallBackMap[func](a1,a2,a3,a4,a5);
    }
    else {
        var windowFunc = window[func];
        if (windowFunc)
            windowFunc(a1,a2,a3,a4,a5)
    }
    _somInCallBack=false;
}

function _somOnSetupCallBack(java_vendor, java_version) {
   _somOnLoadCallBack(java_vendor,java_version);
}


function _somDownloadCallBack(percent) {
    _somOnDownloadCallBack(percent);
}