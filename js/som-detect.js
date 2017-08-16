// Copyright (c) 2011 Big Nerd Software, LLC
// ALL RIGHTS RESERVED
//
// For more details read corresponding txt file

var _somWinJavaInstallUrl = 'http://download.oracle.com/otn-pub/java/jdk/7u5-b06/jre-7u5-windows-i586-iftw.exe';
var _somWinJavaCabInstallUrl = 'http://java.sun.com/update/1.7.0/jinstall-7u5-windows-i586.cab';
var _somDetectOptions;

var _som_detect_mac_lion_html = '<html><body><applet name="DetectApplet" width="200" height="75" archive="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar" code="DetectApplet.class" MAYSCRIPT></applet><script type="text/javascript">function test(){try{document.DetectApplet.isActive();parent._somDetectReady();}catch(e) {parent._somDetectLionNeedsInstall();}}setTimeout(test,500);</script></body></html>';
var _som_detect_win_chrome_html = '<html><body><div id="embedContainer"></div><script type="text/javascript">function _somDetectReady() {parent._somDetectReady();}document.getElementById("embedContainer").innerHTML =\'<embed archive="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar" code="DetectApplet.class" width="200" height="75" type="application/x-java-applet" mayscript="true" doSetup="_somDetectReady"/>\';</script></body></html>';
var _som_detect_win_firefox_html = '<html><body><div id="embedContainer"></div><script type="text/javascript">function _somDetectReady() {parent._somDetectReady();}document.getElementById("embedContainer").innerHTML =\'<embed archive="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar" code="DetectApplet.class" width="200" height="75" type="application/x-java-applet" pluginspage="'+_somWinJavaInstallUrl+'" mayscript="true" doSetup="_somDetectReady"/>\';</script></body></html>';
var _som_detect_win_ie_html = '<html><body><div id="objectContainer"><object style="border: 1px solid black;" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="200" height="75" codebase="'+_somWinJavaCabInstallUrl+'"> <param name="archive" value="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar"> <param name="code" value="DetectApplet.class"> <param name="mayscript" value="true"> <param name="doSetup" value="_somDetectReady"> </object></div><script type="text/javascript">function _somDetectReady(ignored, javaversion){if (_checkJavaVersion(javaversion)) {parent._somDetectReady();}else {document.getElementById("objectContainer").innerHTML =\'<object style="border: 1px solid black;" classid="clsid:CAFEEFAC-0016-0000-0027-ABCDEFFEDCBA" width="200" height="75" codebase="http://java.sun.com/update/1.6.0/jinstall-6u27-windows-i586.cab#Version=1,6,0,27"><param name="archive" value="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar"><param name="code" value="DetectApplet.class"><param name="type" value="application/x-java-applet;jpi-version=1.6.0_27"><param name="mayscript" value="true"><param name="doSetup" value="_somDetectReady"></object>\';}}function _checkJavaVersion(javaversion) {if (!parent._somDetectOptions.minJavaVersion)return true;var wantVersion = parent._somDetectOptions.minJavaVersion;var gotVersion = javaversion + "";var wantParts = wantVersion.split(".");var gotParts = gotVersion.split(".");var wantMajor = parseInt(wantParts[0]);var wantMinor = parseInt(wantParts[1]);var wantSubVersion = parseInt(wantParts[2].split("_")[0]);var wantBuild = parseInt(wantParts[2].split("_")[1]);var gotMajor = parseInt(gotParts[0]);var gotMinor = parseInt(gotParts[1]);var gotSubVersion = parseInt(gotParts[2].split("_")[0]);var gotBuild = parseInt(gotParts[2].split("_")[1]);if (gotMajor != wantMajor)return gotMajor > wantMajor;if (gotMinor != wantMinor)return gotMinor > wantMinor;if (gotSubVersion != wantSubVersion)return gotSubVersion > wantSubVersion;return gotBuild >= wantBuild;}</script></body></html>';
var _som_detect_mac_lion_install_html = '<html><body><applet name="DetectApplet" width="150" height="30" archive="{JARHOSTPATH}/ScreencastOMaticDetect-2.5.jar" code="DetectApplet.class" MAYSCRIPT></applet></body></html>';

function somDetect(options) {
    _somDetectOptions = options;

    var b = navigator.userAgent.toLowerCase();
    var isWin = b.indexOf("windows")>0;
    var isMac = b.indexOf("mac")>0;
    var isMacNeedsCheck = isMac && ((b.indexOf("10_8")>0 || b.indexOf("10.8")>0) || (b.indexOf("10_7")>0 || b.indexOf("10.7")>0) || (b.indexOf("10_6")>0 || b.indexOf("10.6")>0));
    var isIE = b.indexOf("msie")>0 || !!navigator.userAgent.match(/Trident\//);
    var isFireFox = b.indexOf("firefox")>0;
    var isChrome = b.indexOf("chrome")>0;
    var isSafari = !isChrome && b.indexOf("safari")>0;

    if (!navigator.javaEnabled() && (!isFireFox || _somIsPluginDetected())) {
        setTimeout(function() {
            _somDetectOptions.callback('javaDisabled');
        },100);
        return;
    }

    if (_somIsDetectSuccessCookieSet()) {
        setTimeout(function() {
            _somDetectReady();
        },100);
        return;
    }

    if (isWin) {
        if (isFireFox) {
            iframeSrc = _som_detect_win_firefox_html;
        }
        else if (isIE) {
            iframeSrc = _som_detect_win_ie_html;
        }
        else if (isChrome) {
            iframeSrc = _som_detect_win_chrome_html;
        }
        else {
            // For any other browser we just try to detect the plugin or fail.
            setTimeout(function() {
                _somDetectOptions.callback(_somIsPluginDetected() ? 'success' : 'javaNotDetected');
            },100);
            return;
        }
    }
    else if (isMacNeedsCheck) {
        iframeSrc = _som_detect_mac_lion_html;
    }
    else {
        // Mac older than 10.6 and any other browsers besides ff/ie/chrome...
        setTimeout(function() {
            _somDetectOptions.callback(_somIsPluginDetected() ? 'success' : 'javaNotDetected');
        },100);
        return;
    }

    var div = document.getElementById('somDetectContainer');
    if (!div) {
        div = document.createElement('div');
        div.id = 'somDetectContainer';
        document.body.appendChild(div);
    }

    div.innerHTML = '<iframe name="_somdetectframe" frameborder="0" id="somdetectframe" scrolling="no" width="1" height="1"></iframe>';
    _somDetectFillFrame('somdetectframe', iframeSrc);
}

function _somDetectFillFrame(frameId, content)
{
    content = content.replace('{JARHOSTPATH}', kalturaScreenRecord.loadOptions.jarHostPath+'/detect');
    console.log('writing content to frame '+content);
    iframe = document.getElementById(frameId);
    var iframeDoc;
    if (iframe.contentDocument) {
        iframeDoc = iframe.contentDocument;
    }
    else if (iframe.contentWindow) {
        iframeDoc = iframe.contentWindow.document;
    }
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(content);
        iframeDoc.close();
    }
}

function somDetectShowMacLionInstall(id) {
    var div = document.getElementById(id);

    var iframeSrc = 'som-detect-mac-lion-install.html';
    if (_somDetectOptions.path)
        iframeSrc = _somDetectOptions.path + iframeSrc;

    iframeSrc = _som_detect_mac_lion_install_html;

    div.innerHTML = '<iframe frameborder="0" id="sominstallframe" scrolling="no" width="180" height="30" src=""></iframe>';
    _somDetectFillFrame('sominstallframe', iframeSrc);
}

function _somDetectReady() {
    _somSetDetectSuccessCookie();
    _somDetectOptions.callback('success');
}

function _somDetectLionNeedsInstall() {
    _somDetectOptions.callback('macLionNeedsInstall');
}

function _somIsPluginDetected() {
    java_installed = false;
    if (navigator.plugins && navigator.plugins.length)
    {
        for (x = 0; x <navigator.plugins.length; x++)
        {
            plugin_name = navigator.plugins[x].name;
            if (plugin_name.indexOf('Java(TM)') != -1)
            {
                java_installed = true;
                break;
            }
            else if (plugin_name.indexOf('Java ') != -1)
            {
                java_installed = true;
                break;
            }
        }
    }
    return java_installed;
}

var _somDetectCookieName = "somDetectSuccess3";

function _somSetDetectSuccessCookie() {
    var date = new Date();
    date.setTime(date.getTime()+(30*24*60*60*1000));
	var expires = date.toGMTString();
    document.cookie = _somDetectCookieName+"=true; expires="+expires+"; path=/";
}

function _somIsDetectSuccessCookieSet() {
  return document.cookie.indexOf(_somDetectCookieName+"=true")>0;
}
