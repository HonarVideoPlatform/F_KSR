/** ================== LIBRARY API ================== **/

/**
 * set the text that would appear/returned if detected that java is disabled in browser
 */
kalturaScreenRecord.setDetectTextJavaDisabled = function(txt) {this.detectTexts.javaDisabled = txt;}

/**
 * set the text that would appear/returned if detected Mac Lion which requires java to be installed
 */
kalturaScreenRecord.setDetectTextmacLionNeedsInstall = function(txt) {this.detectTexts.macLionNeedsInstall = txt;}

/**
 * set the text that would appear/returned if no java was detected
 */
kalturaScreenRecord.setDetectTextjavaNotDetected = function(txt) {this.detectTexts.javaNotDetected = txt;}

/**
 * set a custom callback function name to be called if detect could not find java.
 * If defined, that function will be called and other functionality will not happen (display of error message).
 * That function should expect a single string parameter with the keyword-description of the error.
 * Available keywords: javaDisabled, macLionNeedsInstall, javaNotDetected
 */
kalturaScreenRecord.setDetectResultErrorCustomCallback = function(funcName) {this.detectResultError.customCallback = funcName;}

/**
 * set the ID of a DOM element in your page where the error message would appear if java is not detected.
 * It's innerHTML will be set to the error message.
 * The error messages can be defined using the setDetectText* functions, or simply use the default.
 * If this is not defined and callback is not defined - error will be written to console.log
 */
kalturaScreenRecord.setDetectResultErrorMessageElementId = function(id) {this.detectResultError.errorMessageDomId = id;}

/**
 * set the ID of a DOM element in your page where an iframe with Mac Lion installation instructions will appear.
 * The default DOM element is:
 * <div id="macLionInstall" style="border: 1px solid black;  margin:18px 0; width:190px; height:40px;"></div>
 *
 * if you override using setDetectTextmacLionNeedsInstall() make sure you set the DOM ID using setDetectResultErrorMacLionNeedsInstallDomId() to an existing DOM element in your page.
 */
kalturaScreenRecord.setDetectResultErrorMacLionNeedsInstallDomId = function(id) {this.detectResultError.macLionNeedsInstallDomId = id;}

/**
 * Set a callback function name/function that would change the list of jars before loading the KSR widget.
 * your function would get the list of jars (array) that are about to be loaded so you can modify them, and is expected to return an array of jars.
 */
kalturaScreenRecord.setModifyJarsCallback = function(funcName) {kalturaScreenRecord.modifyJarsCallback = funcName;}

/**
 * Set a callback function name/function that would change Kaltura options before loading the KSR widget.
 * your function would get an object, with all kaltura options, that are about to be loaded so you can modify them, and is expected to return a modified object.
 * Following are all options:
    'kaltura.uploadCompleteCallBackFunc'
    'kaltura.server'
    'kaltura.partnerId'
    'kaltura.session'
    'kaltura.videoBitRate'
    'kaltura.category'
    'kaltura.conversionProfileId'
    'kaltura.submit.title.value'
    'kaltura.submit.description.value'
    'kaltura.submit.tags.value'
    'kaltura.submit.title.enabled'
    'kaltura.submit.description.enabled'
    'kaltura.submit.tags.enabled'

 * Notice that options are wrapped with quotes, so you should access them as:
 *   yourVarName['option.name']
 * and NOT as
 *   yourVarName.option.name - THIS WILL NOT WORK
 */
kalturaScreenRecord.setModifyKalturaOptionsCallback = function(funcName) {kalturaScreenRecord.modifyKalturaOptionsCallback = funcName;}


/** ================== OVERRIDABLE METHODS: ================== **/

/**
 * each of the following methods can be overridden in your page to define different behavior on the corresponding event
 */

/**
 * default exit callback - does nothing
 */
kalturaScreenRecord.onExitCallBack = function() {}

/**
 * default download callback - writes to console
 */
kalturaScreenRecord.downloadCallBack = function(percent)
{
    console.log('Downloading new version... ('+ percent +'%)');
}

/**
 * default logCapture callback - writes to console
 */
kalturaScreenRecord.logCaptureCallBack = function(phase, arg1, arg2)
{
    console.log("Kaltura KSR captureCallBack: " + phase + " args: [" + arg1 + ", " + arg2 + "]");
}

/**
 * default start callback - writes to console
 */
kalturaScreenRecord.startCallBack = function(result)
{
    console.log("Kaltura KSR startCallback: called "+result);
    if(!result)
    {
        console.log("Kaltura KSR startCallBack: failed to load widget");
    }
}

/**
 * default upload-complete callback - writes to console.
 */
kalturaScreenRecord.UploadCompleteCallBack = function(entryId)
{
    console.log("Kaltura KSR uploadCompleteCallBack: created entry with ID ["+entryId+"]");
}