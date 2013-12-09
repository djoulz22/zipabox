//Author JULIEN CHENAVAS

"use strict";

var colors = require('colors');
var request = require('request');
var jar = request.jar();

function writelog(line,addnewline){
	
	if (zipabox.showlog){
		
		if (typeof(addnewline) == "undefined")
			addnewline = true;
			
		process.stdout.clearLine();  // clear current text
		process.stdout.cursorTo(0);
		
		var logvalue = "";
		
		if (zipabox.show_datetime_in_log)
			logvalue += new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + " - ";
		
		process.stdout.write(logvalue + "[zipabox] : " + line + ((addnewline) ? "\r\n" : ""));	
	}
}

function GetDatas(QUERY,ONSUCCESS_FN, ONERROR_FN,ON_AFTERGETDATAS) {	
	request(QUERY, function ( err, res, body){ 
                if (err || !(res.statusCode >= 200 && res.statusCode < 400)) {
                 	ONERROR_FN(err, res, body);
                           
			if(ON_AFTERGETDATAS)
				ON_AFTERGETDATAS();   	 
                }
		else {
			ONSUCCESS_FN(err, res, body);
			
			if(ON_AFTERGETDATAS)
				ON_AFTERGETDATAS();
		}
        });
}

function PostDatas(QUERY,ONSUCCESS_FN, ONERROR_FN,ON_AFTERPOSTDATAS) {	
	request.post(QUERY, function ( err, res, body){    
                if (err || !(res.statusCode >= 200 && res.statusCode < 400)) {
                 	ONERROR_FN(err, res, body);      
			if(ON_AFTERPOSTDATAS)
				ON_AFTERPOSTDATAS();	 
                }
		else {
			ONSUCCESS_FN(err, res, body);
			if(ON_AFTERPOSTDATAS)
				ON_AFTERPOSTDATAS();
		}
        });
}

function ReplaceURL_FN(datas){
	if ((datas.url) && (datas.params))
	{
		var url = datas.url;
	
		for(var param in datas.params){
			datas.url = datas.url.replace("[" + param + "]",datas.params[param]);
		}
		
		return datas.url;	
	}
	else {
		return null;
	}	
}

function CommonRunScene_FN(req,ONSUCCESS_FN,ONERROR_FN,ON_AFTERRUNSCENE){
	GetDatas(req,
		function( err, res, body){
			try{
				var result = JSON.parse(body);	
			} catch (catchederr) {
				if(ONERROR_FN)
					ONERROR_FN("[RunScene] ERROR : " + catchederr + "\r\n" + body);	
					
					if(ON_AFTERRUNSCENE)
						ON_AFTERRUNSCENE(null);							
				return;	
			}
			
			if (ONSUCCESS_FN) ONSUCCESS_FN("ok ".green);
			if(ON_AFTERRUNSCENE) ON_AFTERRUNSCENE(result);		
		},
		function( err, res, body){
			if (ONERROR_FN) ONERROR_FN("error ".red + err.red);
			if(ON_AFTERRUNSCENE) ON_AFTERRUNSCENE(null);	
		});	
}

function RunScene_FN(ONSUCCESS_FN,ONERROR_FN,ON_AFTERRUNSCENE){
	if(zipabox.events.OnBeforeRunScene)
		zipabox.events.OnBeforeRunScene();
		
	var req = {
		'url': zipabox.baseURL+this.uri_run,  
                'jar': jar, 
                'Content-type' : 'application/json'
	};
	
	writelog("Run Scene : \r\n" + JSON.stringify(req,null,4));
	
	CommonRunScene_FN(req,ONSUCCESS_FN,ONERROR_FN,function(result){
		if(zipabox.events.OnAfterRunScene) zipabox.events.OnAfterRunScene(result);
		if(ON_AFTERRUNSCENE) ON_AFTERRUNSCENE(result);				
	});
}

function RunUnLoadedScene_FN(uuid,ONSUCCESS_FN,ONERROR_FN,ON_AFTERRUNSCENE){
	if(zipabox.events.OnBeforeRunUnLoadedScene)
		zipabox.events.OnBeforeRunUnLoadedScene();
	
	var UrlRepl = zipabox.ReplaceURL({
		url: zipabox.runsceneURL,
		"params":{
			"uuid": uuid
		}	
	});	
	
	var req = {
                'url': zipabox.baseURL+UrlRepl,
                'jar': jar,
                'Content-type' : 'application/json'
        };
	
	writelog("Run UnLoaded Scene : \r\n" + JSON.stringify(req,null,4));
	
	CommonRunScene_FN(req,ONSUCCESS_FN,ONERROR_FN,function(result){
		if(zipabox.events.OnAfterRunUnLoadedScene) zipabox.events.OnAfterRunUnLoadedScene(result);
		if(ON_AFTERRUNSCENE) ON_AFTERRUNSCENE(result);				
	});
			
}

function SetDatas_FN(value,ONSUCCESS_FN,ONERROR_FN,ON_AFTERSETDATAS){
	var req = {
		'url': zipabox.baseURL+this.uri_set,  
                'jar': jar, 
                'Content-type' : 'application/json',
		'body': ""+value
	};
	
	writelog("SetDatas : \r\n" + JSON.stringify(req,null,4));
	
	PostDatas(req,function( err, res, body){		
		writelog("SetDatas RESULT :\r\n" + body + "\r\nSetDatas END RESULT");
		
		if (ONSUCCESS_FN)
			ONSUCCESS_FN(err, res, body);
		
		if(ON_AFTERSETDATAS)
			ON_AFTERSETDATAS();
			
	}, function( err, res, body){
		writelog("SetDatas ERROR :\r\n" + body + "\r\nSetDatas END ERROR");
		
		if (ONERROR_FN)
			ONERROR_FN(err, res, body);
			
		if(ON_AFTERSETDATAS)
			ON_AFTERSETDATAS();
	});
}

function SetUnLoadedDeviceValue_FN(uuid,attribute_id,value,ONSUCCESS_FN,ONERROR_FN,ON_AFTERSETUNLOADEDDEVICEVALUE) {
	
	if(zipabox.events.OnBeforeSetUnLoadedDeviceValue)
		zipabox.events.OnBeforeSetUnLoadedDeviceValue();		
	
	var UrlRepl = zipabox.ReplaceURL({
		url: zipabox.setvalueURL,
		"params":{
			"uuid": uuid,
			"attribute": attribute_id
		}	
	});
	
	var req = {
                'url': zipabox.baseURL+UrlRepl,
                'jar': jar,
                'Content-type' : 'application/json',
                'body': ""+value
        };

	writelog("SetUnLoadedDeviceValue : \r\n" + JSON.stringify(req,null,4));
	
	GetDatas(req,
		function( err, res, body){
			PostDatas(req,function( err, res, body){		
				writelog("SetUnLoadedDeviceValue RESULT :\r\n" + body + "\r\SetUnLoadedDeviceValue END RESULT");
				
				if (ONSUCCESS_FN)
					ONSUCCESS_FN(err, res, body);
					
				try{
					var result = JSON.parse(body);	
				} catch (catchederr) {
					if(ONERROR_FN)
						ONERROR_FN("[SetUnLoadedDeviceValue] ERROR : " + catchederr + "\r\n" + body);	
						
						if(zipabox.events.OnAfterSetUnLoadedDeviceValue)
							zipabox.events.OnAfterSetUnLoadedDeviceValue(null);
						
						if(ON_AFTERSETUNLOADEDDEVICEVALUE)
							ON_AFTERSETUNLOADEDDEVICEVALUE(null);							
					return;	
				}
					
				if(zipabox.events.OnAfterSetUnLoadedDeviceValue)
					zipabox.events.OnAfterSetUnLoadedDeviceValue(result);
				
				if(ON_AFTERSETUNLOADEDDEVICEVALUE)
					ON_AFTERSETUNLOADEDDEVICEVALUE(result);
					
			}, function( err, res, body){
				writelog("SetUnLoadedDeviceValue ERROR :\r\n" + body + "\r\nSetUnLoadedDeviceValue END ERROR");
				
				if (ONERROR_FN)
					ONERROR_FN(err, res, body);
					
				if(zipabox.events.OnAfterSetUnLoadedDeviceValue)
					zipabox.events.OnAfterSetUnLoadedDeviceValue(null);
					
				if(ON_AFTERSETUNLOADEDDEVICEVALUE)
					ON_AFTERSETUNLOADEDDEVICEVALUE(null);
			});	
		},
		function( err, res, body){
			if (ONERROR_FN)
				ONERROR_FN(err, res, body);
				
			if(zipabox.events.OnAfterSetUnLoadedDeviceValue)
				zipabox.events.OnAfterSetUnLoadedDeviceValue(body);
				
			if(ON_AFTERSETUNLOADEDDEVICEVALUE)
				ON_AFTERSETUNLOADEDDEVICEVALUE(body);	
		});	
}

function SetDeviceValue_FN(uuid,attribute_id,value,ONSUCCESS_FN,ONERROR_FN,ON_AFTERSETDEVICEVALUE){
	if(zipabox.events.OnBeforeSetDeviceValue)
		zipabox.events.OnBeforeSetDeviceValue();
	
	var device = GetDeviceByUUID_FN(uuid);
	
	if (device){
		if (device.attributes){
			if (device.attributes[attribute_id]){
				var attr = device.attributes[attribute_id];
				
				attr.setdatas(
					value,
					function(err, res, body){
						
						try{
							var result = JSON.parse(body);	
						} catch (catchederr) {
							if(ONERROR_FN)
								ONERROR_FN("[SetDeviceValue] ERROR : " + catchederr + "\r\n" + body);	
								
								if(zipabox.events.OnAfterSetDeviceValue)
									zipabox.events.OnAfterSetDeviceValue(null);
								
								if(ON_AFTERSETDEVICEVALUE)
									ON_AFTERSETDEVICEVALUE(null);							
							return;	
						}						
						
						if (result.success){
							if (ONSUCCESS_FN)
								ONSUCCESS_FN("Value OK");
								
							if(zipabox.events.OnAfterSetDeviceValue)
								zipabox.events.OnAfterSetDeviceValue(result);
								
							if(ON_AFTERSETDEVICEVALUE)
								ON_AFTERSETDEVICEVALUE(result);	
						}
						else{
							if(ONERROR_FN)
								ONERROR_FN("[SetDeviceValue] ERROR");	
							
							if(zipabox.events.OnAfterSetDeviceValue)
								zipabox.events.OnAfterSetDeviceValue(result);
							
							if(ON_AFTERSETDEVICEVALUE)
								ON_AFTERSETDEVICEVALUE(result);
						}
					},
					function(err, res, body){
						if(ONERROR_FN)
							ONERROR_FN(err);
							
						if(zipabox.events.OnAfterSetDeviceValue)
							zipabox.events.OnAfterSetDeviceValue(null);
							
						if(ON_AFTERSETDEVICEVALUE)
							ON_AFTERSETDEVICEVALUE(null);
					});				
			}
			else {
				if (ONERROR_FN) ONERROR_FN("device has no attribute ".red + attribute_id.red);	
				if(zipabox.events.OnAfterSetDeviceValue) zipabox.events.OnAfterSetDeviceValue(null);
				if(ON_AFTERSETDEVICEVALUE) ON_AFTERSETDEVICEVALUE(null);
			}				
		}	
		else {
			if (ONERROR_FN) ONERROR_FN("device has no attributes!".red);
			if(zipabox.events.OnAfterSetDeviceValue) zipabox.events.OnAfterSetDeviceValue(null);
			if(ON_AFTERSETDEVICEVALUE) ON_AFTERSETDEVICEVALUE(null);
		}
			
	}
	else{
		if (ONERROR_FN) ONERROR_FN("unknow uuid ".red + uuid.red);
		if(zipabox.events.OnAfterSetDeviceValue) zipabox.events.OnAfterSetDeviceValue(null);
		if(ON_AFTERSETDEVICEVALUE) ON_AFTERSETDEVICEVALUE(null);
	}	
}

function GetDevicesLogs_FN(params,ON_AFTERGETDEVICESLOGS, FOREACH_DEVICELOGS){
	var retval = [];	
	var GetDeviceLogs = function(CALLBACK_FN,paramid){
		var param = params[paramid];
		writelog("\tGetting device logs --> " + param.uuid.magenta.bold + " [processing...]".bold,false);
		
		GetDeviceLogs_FN(param.uuid,param.attribute,
				function(device,datas){
					retval.push({
						"name": device.name,
						"uuid": param.uuid,
						"err": null,
						"datas": datas
					});
					writelog("\tGetting device logs --> " + param.uuid.magenta.bold + " [OK]".green.bold);
				},
				function(err){
					retval.push({
						"uuid": param.uuid,
						"err": err,
						"datas": null	
					});
					writelog("\tGetting device logs --> " + param.uuid.magenta.bold + " [ERROR]".red.bold);
				},
				function(){					
					if(FOREACH_DEVICELOGS)
						FOREACH_DEVICELOGS(retval[retval.length-1]);
						
					CALLBACK_FN();
				});		
	}
	
	var subsequenty = require('sequenty');
	var DevicesSeqFunc = [];
	
	for (var param in params)
	{
		DevicesSeqFunc.push(GetDeviceLogs);	
	}	
	
	DevicesSeqFunc.push(function(CALLBACK_FN){
		writelog("GetDevicesLogs " + "[OK]".bold);
		if(CALLBACK_FN)		
			CALLBACK_FN();
	});
	
	if (ON_AFTERGETDEVICESLOGS){
		DevicesSeqFunc.push(function(CALLBACK_FN){
			ON_AFTERGETDEVICESLOGS(retval);
			
			if(CALLBACK_FN)
				CALLBACK_FN();
		});
	}
	
	subsequenty.run(DevicesSeqFunc);	
}

function GetDeviceLogs_FN(uuid,attribute_id,ONSUCCESS_FN,ONERROR_FN,ON_AFTERGETDEVICELOGS){
	var device = GetDeviceByUUID_FN(uuid);
	
	if (device){
		if (device.attributes){
			if (device.attributes[attribute_id]){
				
				var UrlRepl = {
					"url":zipabox.baseURL+zipabox.logs_UUID_ATTR_URL,
					"params":{
						"uuid": uuid,
						"attribute": attribute_id
					} 
				}
				
				var UrlReq = zipabox.ReplaceURL(UrlRepl);
				
				if (UrlReq){
					var req = {
						url:UrlReq,
						'jar': jar, 
                				'Content-type' : 'application/json' 	
					};
					
					GetDatas(req,
						function(err, res, body){
							try{
								var result = JSON.parse(body);	
								
								if (ONSUCCESS_FN)
									ONSUCCESS_FN(device,result);							
								
								if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();
								
							} catch (catchederr) {
								if(ONERROR_FN)
									ONERROR_FN("[GetDeviceLogs] ERROR : " + catchederr + "\r\n" + body);	
									
									if(ON_AFTERGETDEVICELOGS)
										ON_AFTERGETDEVICELOGS();							
								return;	
							}
						},
						function(err, res, body){
							if(ONERROR_FN)
								ONERROR_FN(err);
							
							if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();
						});
				}
				else{
					if (ONERROR_FN) ONERROR_FN("url replace error".red);	
					if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();	
				}
			}
			else {
				if (ONERROR_FN) ONERROR_FN("device has no attribute ".red + attribute_id.red);	
				if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();	
			}
		}
		else{
			if (ONERROR_FN) ONERROR_FN("device has no attributes!".red);
			if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();	
		}
	}
	else{
		if (ONERROR_FN) ONERROR_FN("unknow uuid ".red + uuid.red);
		if(ON_AFTERGETDEVICELOGS) ON_AFTERGETDEVICELOGS();	
	}	
}

function GetDeviceByName_FN(devicename){
	writelog("GetDeviceByName : " + devicename.yellow.bold,false);
	
	for(var iddevice in zipabox.devices){	
		var device = zipabox.devices[iddevice];	
		if (device.name == devicename)
		{
			writelog("GetDeviceByName : " + devicename.yellow.bold + " -> " + "[FOUND]".green.bold);
			return device;
		}
	}
	
	writelog("GetDeviceByName : " + devicename.yellow.bold + " -> " + "[NOT FOUND]".red.bold);
	return null;
}

function GetDeviceByUUID_FN(uuid){
	writelog("GetDeviceByUUID : " + (""+uuid).yellow.bold,false);
	
	for(var iddevice in zipabox.devices){
		var devicejson = zipabox.devices[iddevice].json;
		
		if (typeof(devicejson[uuid]) != "undefined")
		{
			writelog("GetDeviceByUUID : " + (""+uuid).yellow.bold + " -> " + "[FOUND]".green.bold);
			return devicejson[uuid];	
		}				
	}
	
	writelog("GetDeviceByUUID : " + (""+uuid).yellow.bold + " -> " + "[NOT FOUND]".red.bold);
	return null;
}

function GetDeviceByEndpointUUID_FN(endpoint_uuid){
	writelog("GetDeviceByEndpointUUID : " + (""+endpoint_uuid).yellow.bold,false);
	for(var iddevice in zipabox.devices){			
		var devicejson = zipabox.devices[iddevice].json;
		
		for (var uuid in devicejson)
		{
			if (devicejson[uuid].endpoint == endpoint_uuid)
			{
				writelog("GetDeviceByEndpointUUID : " + (""+endpoint_uuid).yellow.bold + " -> " + "[FOUND]".green.bold);
				return devicejson[uuid];	
			}	
		}					
	}
	
	writelog("GetDeviceByEndpointUUID : " + (""+endpoint_uuid).yellow.bold + " -> " + "[NOT FOUND]".red.bold);
	return null;
}

function ZipaboxToString() {
        var retval = "";
	
	var jszipabox = zipabox.devices[0].json; 
        //writelog("######### ".blue + "ZIPABOX Informations".bold + " #########".blue);
	retval += "######### ".blue + "ZIPABOX Informations".bold + " #########".blue + "\r\n";
        for (var key in jszipabox)
        {
                var value = "" + jszipabox[key];
                
                if (key == "online"){                        
                        if (jszipabox[key])
                                retval += "\t" + key + ": " + value.green.bold + "\r\n"; //writelog("\t" + key + ": " + value.green.bold);
                        else
                                retval += "\t" + key + ": " + value.red.bold + "\r\n"; //writelog("\t" + key + ": " + value.red.bold); 
                }
                else    
                        retval += "\t" + key + ": " + value.yellow.bold + "\r\n"; //writelog("\t" + key + ": " + value.yellow.bold);
        } 
        //writelog("########################################".blue);
	retval += "########################################".blue;
	
	return retval;
}

function DeviceToString() {
	var retval = this.name.yellow.bold;
	
	switch(this.name){
		case "scenes" :		
		case "thermostats" :
			for (var uuid in this.json) {
				var devicejson = this.json[uuid];
				retval += "\r\n\t" + uuid.green + "(" + devicejson.name.bold + ")";
				
				if (this.name == "thermostats")
				{
					for(var endpoint in devicejson.endpoints)
					{
						var device_endpoint = devicejson.endpoints[endpoint]; 
						retval += "\r\n\t\t" + endpoint.yellow.bold + " : " + device_endpoint.uuid.green + "(" + device_endpoint.name.bold + ")";
					}	
				}				
			}
			break;
		default :
			for (var uuid in this.json) {
		            var devicejson = this.json[uuid];

		            for (var attr in devicejson.attributes) {
		                var attribute = devicejson.attributes[attr];
		                if (typeof (attribute.value) != "undefined") {
		                    var attrname = attribute.name;
		                    if (typeof (attribute.definition) != "undefined")
		                        attrname = attribute.definition.name;
					
				    var attrval = ""+attribute.value;
				    if (attrval == "true"){
				    	attrval = attrval.green;	
				    }
				    else{
				    	if (attrval == "false"){
						attrval = attrval.red;
					}
				    }
		                    retval += "\r\n\t" + (uuid.green + "(" + devicejson.name.bold + ")" + " - " + attrname + "(" + attr.bold + ")" + " = " + attrval.bold);
		                }
		            }
		        }				
	}	
	
	return retval;
}

function InternalForeachDevice(device){
	switch(device.name){
		case "lights" :
			for (var uuid in device.json){
				var devicejson = device.json[uuid];			
				
				for (var attr in devicejson.attributes) {				;
					devicejson.attributes[attr].uri_set = "lights/" + uuid +"/attributes/" + attr + "/value";
					devicejson.attributes[attr].setdatas = SetDatas_FN;				
			        }			
			}
			break;
		case "scenes" :
			for (var uuid in device.json){
				var devicejson = device.json[uuid];					;
				devicejson.uri_run = "scenes/" + uuid +"/run";
				devicejson.run = RunScene_FN;	
			}
			break;
		default:
			break;
	}			
}

var zipabox = {
	showlog: true,
	show_datetime_in_log: true,
	baseURL: "https://my.zipato.com:443/zipato-web/rest/",
	initURL: "user/init",  
	loginURL: "user/login?username=[username]&token=[token]",
	logoutURL: "user/logout",	
	logs_UUID_ATTR_URL: "/log/attribute/[uuid]/[attribute]/",
	setvalueURL: "lights/[uuid]/attributes/[attribute]/value",
	runsceneURL: "scenes/[uuid]/run",
	username: "",
	password: "",
	nonce: "",
	connected: false,
	devices: [
		{
		        name:"zipabox",
			uri: "zipabox/",
                        toString: ZipaboxToString 
		},
		{
		        name:"lights", 
			uri: "lights/",
			toString: DeviceToString						                
		},
		{
		        name:"meters",
			uri: "meters/",
			toString: DeviceToString
		},
		{
		        name:"sensors",
			uri: "sensors/",
			toString: DeviceToString
		},
		{
		        name:"scenes",
			uri: "scenes/",
			toString: DeviceToString			
		},
		{
			name:"thermostats",
			uri: "thermostats/",
			toString: DeviceToString
		}
				          
	],
	events: {
		OnBeforeConnect: 	null,
		OnAfterConnect: 	null,
		
		OnBeforeDisconnect:	null,
		OnAfterDisconnect:	null,		
		
		OnBeforeLoadDevices:	null,
		OnAfterLoadDevices:	null,
		
		OnBeforeLoadDevice: 	null,
		OnAfterLoadDevice:	null,		
		
		OnBeforeGetDevicesLogs:	null,
		OnAfterGetDevicesLogs:	null,
		
		OnBeforeSetDeviceValue:	null,
		OnAfterSetDeviceValue:	null,
		
		OnBeforeSetUnLoadedDeviceValue:	null,		
		OnAfterSetUnLoadedDeviceValue:	null,
		
		OnBeforeRunScene:	null,
		OnAfterRunScene:	null,
		
		OnBeforeUnLoadedRunScene:	null,
		OnAfterUnLoadedRunScene:	null,
		
		OnInitUserProgress:	null,
		OnLoginUserProgress:	null,
		OnLogoutUserProgress:	null
	},	
	Connect: Connect_FN,
	Disconnect: Disconnect_FN,
	LoadDevices: LoadDevices_FN,
	GetDeviceByName: GetDeviceByName_FN,
	GetDeviceByUUID: GetDeviceByUUID_FN,
	GetDeviceByEndpointUUID: GetDeviceByEndpointUUID_FN,
	GetDevicesLogs: GetDevicesLogs_FN,
	
	SetDeviceValue: SetDeviceValue_FN,
	SetUnLoadedDeviceValue: SetUnLoadedDeviceValue_FN,
	
	RunScene: RunScene_FN,
	RunUnLoadedScene: RunUnLoadedScene_FN,
	
	ReplaceURL: ReplaceURL_FN
};

function InitUser_FN(CALLBACK_FN){
	
	var msg = {statusCode: 0, msg:"Initialisation [processing...]"};
	if (zipabox.events.OnInitUserProgress) zipabox.events.OnInitUserProgress(msg);
	
	writelog("Initialisation " + "[processing...]".bold,false); 
	
	zipabox.nonce = "";
	
	var req = { 
                'url': zipabox.baseURL+zipabox.initURL,
                'jar': jar, 
                'Content-type' : 'application/json'
        };
		
	GetDatas(
		req,
		/*ONSUCCESS_FN*/ function(err, res, body){ 
			zipabox.InitUser_Return = JSON.parse(body); 
			
			if (zipabox.InitUser_Return.success)
			{
				zipabox.nonce = zipabox.InitUser_Return.nonce;
				
				msg = { statusCode: 1, msg:"Initialisation [OK]"};
				if (zipabox.events.OnInitUserProgress) zipabox.events.OnInitUserProgress(msg);
				
				writelog("Initialisation " + "[OK]".bold);
			 
				if(CALLBACK_FN){
					CALLBACK_FN(); 
				} 	
			}
			else {
				msg = { statusCode: 2, msg:"Initialisation Error : " + zipabox.InitUser_Return};
				if (zipabox.events.OnInitUserProgress) zipabox.events.OnInitUserProgress(msg);
				
				writelog("Initialisation Error : " + zipabox.InitUser_Return.error.red);
			}
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err) {
				msg = { statusCode: 3, msg:"Initialisation error : " + err};
				if (zipabox.events.OnInitUserProgress) zipabox.events.OnInitUserProgress(msg);
				
				writelog("Initialisation error : " + err.red);
			}				
			else{
				msg = { statusCode: 4, msg:"Initialisation error status code : " + res.statusCode};
				if (zipabox.events.OnInitUserProgress) zipabox.events.OnInitUserProgress(msg);
				
				writelog("Initialisation error status code : " + res.statusCode.red);	
			}				
		}
	);	
}

function GenerateTokenizedURI(){
	var crypto      = require('crypto');
        var sh_login    = zipabox.nonce + crypto.createHash('sha1').update(zipabox.password).digest('hex');
       	var api_token   = crypto.createHash('sha1').update(sh_login).digest('hex');
	
	var UrlRepl = {
		"url": zipabox.loginURL,
		"params":{
			"username": zipabox.username,
			"token": api_token
		} 
	}

	return zipabox.ReplaceURL(UrlRepl);
}

function LoginUser_FN(CALLBACK_FN) {
	var msg = {statusCode: 0, msg:"Login [processing...]"};
	if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
	
	writelog("Login " + "[processing...]".bold,false); 
	
	if (zipabox.nonce == "" || zipabox.username == "" || zipabox.password == "")
	{
		msg = {statusCode: 1, msg:"Invalide username or password..."};
		if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
		writelog("Invalide username or password...".bold.red);
		return;
	}
	
	var req = { 
                'url': zipabox.baseURL+GenerateTokenizedURI(),  
                'jar': jar, 
                'Content-type' : 'application/json'
        };
	
	GetDatas(
		req,
		/*ONSUCCESS_FN*/ function(err, res, body){ 
			zipabox.loginUser_Return = JSON.parse(body);
			
			zipabox.connected = zipabox.loginUser_Return.success;
			
			if (zipabox.connected)
			{
				msg = {statusCode: 3, msg:"Login [OK]"};
				if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
				writelog("Login " + "[OK]".bold);
				
				if(CALLBACK_FN){
					CALLBACK_FN(); 
				} 		
			}
			else
			{
				msg = {statusCode: 4, msg:"Login [ERROR]"};
				if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
				
				writelog("Login " + "[ERROR]".red.bold);	
			}
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err){
				msg = {statusCode: 5, msg:"Login error : " + err};
				if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
				writelog("Login error : " + err.red);	
			}				
			else{
				msg = {statusCode: 6, msg:"Login error status code : " + res.statusCode};
				if (zipabox.events.OnLoginUserProgress) zipabox.events.OnLoginUserProgress(msg);
				writelog("Login error status code : " + res.statusCode.red);	
			}				
		}
	);	
}

function LogoutUser_FN(ON_AFTERDISCONNECT){
	
	var msg = {statusCode: 0, msg:"Logout [processing...]"};
	if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
	writelog("Logout " + "[processing...]".bold,false); 
	
	if (!zipabox.connected)
	{
		msg = {statusCode: 1, msg:"You are not connected"};
		if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
		writelog("You are not connected".red);	
		return;
	}
	
	var req = { 
                'url': zipabox.baseURL+zipabox.logoutURL,  
                'jar': jar, 
                'Content-type' : 'application/json'
        };
	
	GetDatas(
		req,
		/*ONSUCCESS_FN*/ function(err, res, body){ 
			zipabox.LogoutUser_Result = JSON.parse(body); 		
			
			zipabox.connected = (!(zipabox.LogoutUser_Result.success));
			
			if (!zipabox.connected)
			{
				msg = {statusCode: 2, msg:"Logout [OK]"};
				if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
				writelog("Logout " + "[OK]".bold);
				
				if(ON_AFTERDISCONNECT){
					ON_AFTERDISCONNECT(); 
				}	
			}	
			else{
				msg = {statusCode: 3, msg:"Logout [ERROR]"};
				if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
				writelog("Logout " + "[ERROR]".red.bold);			
			}
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err){
				msg = {statusCode: 4, msg:"Disconnection error : " + err};
				if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
				writelog("Disconnection error : " + err.red);
			}				
			else{
				msg = {statusCode: 5, msg:"Disconnection error status code : " + res.statusCode};
				if (zipabox.events.OnLogoutUserProgress) zipabox.events.OnLogoutUserProgress(msg);
				writelog("Disconnection error status code : " + res.statusCode.red);
			}				
		}
	);	
}

function LoadDevices_FN(ON_AFTERLOADDEVICES,FOREACH_DEVICE_FN) {
	var msg = {statusCode: 0, msg:"LoadDevices [processing...]"};
	
	var LoadDevice = function(CALLBACK_FN,deviceid_int) {
		var device = zipabox.devices[deviceid_int];
		
		if (zipabox.events.OnBeforeLoadDevice) zipabox.events.OnBeforeLoadDevice(device);
		
		writelog("\tLoading device --> " + device.name.magenta.bold + " [processing...]".bold,false);
		
		var req = { 
	                'url': zipabox.baseURL+device.uri,  
	                'jar': jar, 
	                'Content-type' : 'application/json'
	        };
		
		GetDatas(
			req,
			/*ONSUCCESS_FN*/ function(err, res, body){ 	
				try
				{
					device.json = JSON.parse(body);
					
					InternalForeachDevice(device);
					
					if (zipabox.events.OnAfterLoadDevice) zipabox.events.OnAfterLoadDevice(device);
										
					writelog("\tLoading device --> " + device.name.magenta.bold + " [OK]".bold);
							
					if (FOREACH_DEVICE_FN)
						FOREACH_DEVICE_FN(device);
							
					if (CALLBACK_FN)
						CALLBACK_FN();
				}
				catch(parseerr)
				{
					writelog("\tLoading device --> " + device.name.magenta.bold  + " [ERROR]".red.bold);
					writelog("\tParse Query Result Error (device : " + device.name.magenta.bold + ") : " + parseerr);
				}
			},
			/*ONERROR_FN*/ function(err, res, body){ 
				writelog("[LoadDevice ONERROR_FN]".red.bold);
			}	
		);	
	}
	
	
	if (zipabox.events.OnBeforeLoadDevices) zipabox.events.OnBeforeLoadDevices();
	writelog("LoadDevices " + "[processing...]".bold);
	
	var subsequenty = require('sequenty');
	var DevicesSeqFunc = [];
	
	for (var deviceid in zipabox.devices)
	{
		DevicesSeqFunc.push(LoadDevice);	
	}	
	
	DevicesSeqFunc.push(function(CALLBACK_FN){
		if (zipabox.events.OnAfterLoadDevices) zipabox.events.OnAfterLoadDevices();
		
		writelog("LoadDevices " + "[OK]".bold);
		if(CALLBACK_FN)		
			CALLBACK_FN();
	});
	
	if (ON_AFTERLOADDEVICES)
		DevicesSeqFunc.push(ON_AFTERLOADDEVICES);
	
	subsequenty.run(DevicesSeqFunc);	
}

function Connect_FN(ON_AFTERCONNECT) {
		
	var sequenty = require('sequenty');
	var SeqFunc = [];
	
	if (zipabox.events.OnBeforeConnect)
		SeqFunc.push(function(CALLBACK_FN){zipabox.events.OnBeforeConnect(); if(CALLBACK_FN) CALLBACK_FN(); });
		
	SeqFunc.push(InitUser_FN);
	SeqFunc.push(LoginUser_FN);	
	
	if (zipabox.events.OnAfterConnect)
		SeqFunc.push(function(CALLBACK_FN){ if (zipabox.connected) zipabox.events.OnAfterConnect(); if(CALLBACK_FN) CALLBACK_FN(); });
	
	if (ON_AFTERCONNECT)
		SeqFunc.push(function(CALLBACK_FN){ if (zipabox.connected) ON_AFTERCONNECT(); if(CALLBACK_FN) CALLBACK_FN(); });			

	sequenty.run(SeqFunc);		
}

function Disconnect_FN(ON_AFTERDISCONNECT){
	var sequenty = require('sequenty');
	var SeqFunc = [];
	
	if (zipabox.events.OnBeforeDisconnect)
		SeqFunc.push(function(CALLBACK_FN){zipabox.events.OnBeforeDisconnect(); if(CALLBACK_FN) CALLBACK_FN(); });
		
	SeqFunc.push(LogoutUser_FN);
	
	if (zipabox.events.OnAfterDisconnect)
		SeqFunc.push(function(CALLBACK_FN){ if (!zipabox.connected) zipabox.events.OnAfterDisconnect(); if(CALLBACK_FN) CALLBACK_FN(); });
	
	if (ON_AFTERDISCONNECT)
		SeqFunc.push(function(CALLBACK_FN){ if (!zipabox.connected) ON_AFTERDISCONNECT(); if(CALLBACK_FN) CALLBACK_FN(); });
	
	sequenty.run(SeqFunc);	
}

module.exports = zipabox;
