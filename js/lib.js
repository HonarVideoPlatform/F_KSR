// overrider defined _somRunJar in som.js
_somRunJar = 'SOM_JAR_RUN';

// make sure calls to console.log will not fail
if (!window.console){console={log:function(){}}};

kalturaScreenRecord = {
    // replacable options
    recorderOptionSkin0: 'SOM_RECORDER_OPTIONS_SKIN0',
    recorderOptionsMaxCaptureSec: SOM_RECORDER_OPTIONS_MAXCAPTURESEC,

    // members for API
    modifyJarsCallback: false,
    modifyKalturaOptionsCallback: false,
    kalturaCompleteCallback: false,

    loadOptions: null,
    errorMessages: {},
	
	initiated : false,
	detectIfJavaEnabledFlag : false,
	
	/**
	 * init KSR
	 */
	initKsr: function(partnerId, Ks)
	{
		this.loadOptions = {
               partner: {
                    id: 'SOM_PARTNER_ID',
                    site: 'SOM_PARTNER_SITE',
                    key: 'SOM_PARTNER_KEY'
                },
		macLauncherZip: 'screenrecorder-mac-app-1.0.zip',

                sidePanelOnly: SOM_SIDE_PANEL_ONLY,
		jarHostPath: "JAR_HOST_PATH",

                captureId: 'SOM_CAPTURE_ID',

                macName: 'SOM_MAC_NAME',

                jars: [SOM_JARS],

                recorderOptions: kalturaScreenRecord.buildRecorderOptions(),

                sidePanelProperties: {
                    'kaltura.uploadCompleteCallBackFunc': 'kalturaScreenRecorderUploadCallback',
                    'kaltura.server': 'KALTURA_SERVER',
                    'kaltura.partnerId': partnerId,
                    'kaltura.session': Ks,
                    'kaltura.videoBitRate': KALTURA_VIDEOBITRATE,
                    'kaltura.category': 'KALTURA_CATEGORY',
                    'kaltura.conversionProfileId': 'KALTURA_CONVERSIONPROFILEID',
                    'kaltura.submit.title.value': 'KALTURA_SUBMIT_TITLE_VALUE',
                    'kaltura.submit.description.value': 'KALTURA_SUBMIT_DESCRIPTION_VALUE',
                    'kaltura.submit.tags.value': 'KALTURA_SUBMIT_TAGS_VALUE',
                    'kaltura.submit.title.enabled': 'KALTURA_SUBMIT_TITLE_ENABLED',
                    'kaltura.submit.description.enabled': 'KALTURA_SUBMIT_DESCRIPTION_ENABLED',
                    'kaltura.submit.tags.enabled': 'KALTURA_SUBMIT_TAGS_ENABLED'
                },

                // Required callback to get result of loading the app
                callback: this.startCallBack,

                // Optional callbacks if you need to listen for activity from the recorder
                captureCallBack: this.logCaptureCallBack,
                onExitCallBack: this.onExitCallBack,
                // Optional callback with progress while downloading jar files
                onDownloadCallBack: this.downloadCallBack
            };

            for(em in this.errorMessages)
            {
                this.loadOptions.sidePanelProperties[em] = this.errorMessages[em];
            }
            
            if(this.modifyJarsCallback)
            {
                var funcName = this.modifyJarsCallback;
                if(typeof funcName === 'function') {
                   this.loadOptions.jars = funcName(this.loadOptions.jars);
                }
                else
                {
                    console.log(this.modifyJarsCallback + ' is not a function');
                }
            }

            if(this.modifyKalturaOptionsCallback)
            {
                var funcName = this.modifyKalturaOptionsCallback;
                if(typeof funcName === 'function') {
                    this.loadOptions.sidePanelProperties = funcName(this.loadOptions.sidePanelProperties);
                }
                else
                {
                    console.log(this.modifyKalturaOptionsCallback + ' is not a function');
                }
            }
			
			this.initiated = true; 
	},
	
    /**
     * main load method - called by page
     */
    startKsr: function(partnerId, Ks, detect)
    {
        
		if (!this.initiated) {
			this.initKsr(partnerId, Ks); 
		}
		
		if(detect)
		{
			// this is asyncronous call. need to wait for callback.
			this.detectAndRun();
		}
		else
		{
			somStartRecorder(this.loadOptions);
		}
    },

    /**
     * helper method to build recorder options
     */
    buildRecorderOptions: function()
    {
        var options = {};
        if(this.recorderOptionsMaxCaptureSec)
        {
            options['maxCaptureSec'] = this.recorderOptionsMaxCaptureSec;
        }
        if(this.recorderOptionSkin0)
        {
            options['skin0'] = this.recorderOptionSkin0;
        }
        return options;
    },


    // default detection error texts.
    detectTexts: {
        javaDisabled: 'Java is disabled in this browser.  Please enable it then <a href="javascript:detect()">retry</a>',
        macLionNeedsInstall: 'Please click the "Missing Plug-in" or "Inactive Plug-in" link: <div id="macLionInstall" style="border: 1px solid black;  margin:18px 0; width:190px; height:40px;"></div> After clicking it restart your browser.',
        javaNotDetected: "No java detected and can't auto install on this browser."
    },
    // additional parameters that can be used to customize the detection process result
    detectResultError: {
        macLionNeedsInstallDomId: 'macLionInstall',
        errorMessageDomId: '',
        customCallback: ''
    },

    /**
     * method to start the detect applet
     */
    detectAndRun: function()
    {
        // First we'll run the detect logic to try and make sure that java is installed and working in the browser.
        // If we get a successful detection then a cookie is set and it won't run again for a month.  (The month
        // timeout is in case this is Mac 10.6 or later which will disable java applets after a month if you
        // don't use them)
        somDetect({
            // ToDo: You MUST set this to the correct path on the server where the detect html pages are stored
            // (if they aren't located in the "detect" directory in the same dir as this file.)
            path: 'JAR_HOST_PATH/detect/',

            callback: this.detectAndRunCallback
        });
    },
	
	/**
     * callback for detect applet
     */
    detectAndRunCallback: function(result)
    {
		// if not one of the following errors - java available, return true
		if(result == 'success')
		{
			console.log('seems fine, returning true ['+result+']');
			// this.loadOptions is only set if going through detect which needs to wait for callback
			somStartRecorder(kalturaScreenRecord.loadOptions);
		}
		else
		{
			// something is wrong, pass result to custom callback function defined by integrator
			if(kalturaScreenRecord.detectResultError.customCallback)
			{
				console.log('calling custom callback');
				kalturaScreenRecord.detectResultError.customCallback(result);
			}
			// something is wrong but no custom calback function defined - print text to defined DOM element innerHTML
			else if(kalturaScreenRecord.detectResultError.errorMessageDomId)
			{
				console.log('printing error to DOM');
				document.getElementById(kalturaScreenRecord.detectResultError.errorMessageDomId).innerHTML = kalturaScreenRecord.detectTexts[result];
				// if detected mac that needs install and defined DOM element to display iframe within - show it.
				if (result=='macLionNeedsInstall' && kalturaScreenRecord.detectResultError.macLionNeedsInstallDomId)
				{
					somDetectShowMacLionInstall(kalturaScreenRecord.detectResultError.macLionNeedsInstallDomId);
				}
			}
			else // no custom DOM element or callback defined - lets just write to console
			{
				console.log("java not available with result: "+result);
			}
		}
    },
	
	/**
     * callback for detect applet
     */
    detectIfJavaEnabledCallback: function(result)
    {
		if (kalturaScreenRecord.detectIfJavaEnabledFlag){
			return; 
		}
		
		kalturaScreenRecord.detectIfJavaEnabledFlag = true;
		var funcName = kalturaScreenRecord.saDetect;
			
		// if not one of the following errors - java available, return true
		if(result == 'success')
		{
			console.log('seems fine, returning true ['+result+']');
			if(typeof funcName === 'function') {
				funcName(true);
			}
			else {
				console.log(this.saDetect + ' is not a function, could not return true');
			}
		}
		else
		{
			// something is wrong, pass result to custom callback function defined by integrator
			if(kalturaScreenRecord.detectResultError.customCallback)
			{
				console.log('calling custom callback');
				kalturaScreenRecord.detectResultError.customCallback(result);
			}
			// something is wrong but no custom calback function defined - print text to defined DOM element innerHTML
			else if(kalturaScreenRecord.detectResultError.errorMessageDomId)
			{
				console.log('printing error to DOM');
				document.getElementById(kalturaScreenRecord.detectResultError.errorMessageDomId).innerHTML = kalturaScreenRecord.detectTexts[result];
				// if detected mac that needs install and defined DOM element to display iframe within - show it.
				if (result=='macLionNeedsInstall' && kalturaScreenRecord.detectResultError.macLionNeedsInstallDomId)
				{
					somDetectShowMacLionInstall(kalturaScreenRecord.detectResultError.macLionNeedsInstallDomId);
				}
			}
			else // no custom DOM element or callback defined - lets just write to console
			{
				console.log("java not available with result: "+result);
			}
			
			if(typeof funcName === 'function') {
				funcName(false);
			}
			else
			{
				console.log(this.saDetect + ' is not a function');
			}
		}		
	},
	
    /**
     * method to detect if java enabled
     */
    detectIfJavaEnabled: function(callback)
    {
        // First we'll run the detect logic to try and make sure that java is installed and working in the browser.
        // If we get a successful detection then a cookie is set and it won't run again for a month.  (The month
        // timeout is in case this is Mac 10.6 or later which will disable java applets after a month if you
        // don't use them)
		kalturaScreenRecord.saDetect = callback;
		
        somDetect({
            // ToDo: You MUST set this to the correct path on the server where the detect html pages are stored
            // (if they aren't located in the "detect" directory in the same dir as this file.)
            path: 'JAR_HOST_PATH/detect/',

            callback: this.detectIfJavaEnabledCallback
        });
		
		var _this = this;
		setTimeout(function(){
			_this.detectIfJavaEnabledCallback("No Java Detected. Please install or enable Java plugin.")
		}, 30000);
    }	
}

// Override the error message from the server
KALTURA_ERROR_MESSAGES

/**
 * "internal" upload-complete callback - initiates the object method
 */
function kalturaScreenRecorderUploadCallback(entryId)
{
    kalturaScreenRecord.UploadCompleteCallBack(entryId);
}
