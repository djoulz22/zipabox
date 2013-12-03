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
		process.stdout.write(line + ((addnewline) ? "\r\n" : ""));	
	}
}

function GetDatas(QUERY,ONSUCCESS_FN, ONERROR_FN) {	
	request(QUERY, function ( err, res, body){    
                if (err || (res.statusCode != 200 && res.statusCode != 302)) {
                 	ONERROR_FN(err, res, body);      	 
                }
		else {
			ONSUCCESS_FN(err, res, body);
		}
        });
}

function PostDatas(QUERY,ONSUCCESS_FN, ONERROR_FN) {	
	request.post(QUERY, function ( err, res, body){    
                if (err || (res.statusCode != 200 && res.statusCode != 302)) {
                 	ONERROR_FN(err, res, body);      	 
                }
		else {
			ONSUCCESS_FN(err, res, body);
		}
        });
}

function SetDatas(value,ONSUCCESS_FN,ONERROR_FN){
	var req = {
		'url': zipabox.baseURL+this.uri_set,  
                'jar': jar, 
                'Content-type' : 'application/json',
		'body': ""+value
	};
	
	writelog("SetDatas : " + JSON.stringify(req,null,4));
	
	PostDatas(req,function( err, res, body){		
		writelog("GetDatas RESULT :");
		writelog(JSON.parse(body));
		writelog("GetDatas END RESULT");
		
		if (ONSUCCESS_FN)
			ONSUCCESS_FN(err, res, body);
	}, function( err, res, body){
		writelog("GetDatas ERROR :");
		writelog(body);
		writelog("GetDatas END ERROR");
		
		if (ONERROR_FN)
			ONERROR_FN(err, res, body);
	});
}

function GetDeviceByName_FN(devicename){
	writelog("GetDeviceByName : " + devicename.yellow.bold,false);
	
	for(var iddevice in zipabox.devices){	
		var device = zipabox.devices[iddevice];	
		if (device.name == devicename)
		{
			writelog("GetDeviceByName_FN : " + devicename.yellow.bold + " -> " + "[FOUND]".green.bold);
			return device;
		}
	}
	
	writelog("GetDeviceByName_FN : " + devicename.yellow.bold + " -> " + "[NOT FOUND]".red.bold);
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
	var retval = "";
	
	switch(this.name){
		case "scenes" :
			for (var uuid in this.json) {
				var devicejson = this.json[uuid];
				retval += uuid.green + "(" + devicejson.name.bold + ")";
			}
			break;
		case "thermostats" :
			retval += JSON.stringify(this.json, null, 4);
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

		                    retval += (uuid.green + "(" + devicejson.name.bold + ")" + " - " + attrname + "(" + attr.bold + ")" + " = " + attribute.value.bold + "\r\n");
		                }
		            }
		        }				
	}	
	
	return retval;
}

function InternalForeachDevice(device){
	if (device.name == "lights") {
		for (var uuid in device.json){
			var devicejson = device.json[uuid];			
			
			for (var attr in devicejson.attributes) {				;
				devicejson.attributes[attr].uri_set = "lights/" + uuid +"/attributes/" + attr + "/value";
				devicejson.attributes[attr].setdatas = SetDatas;				
				//console.log(devicejson);
		        }			
		}		
	}		
}

var zipabox = {
	showlog: true,
	baseURL: "https://my.zipato.com:443/zipato-web/rest/",
	initURL: "user/init",  
	loginURL: "user/login?username=[username]&token=[token]",
	logoutURL: "user/logout",	
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
	InitUser: InitUser_FN,
	LoginUser: LoginUser_FN,
	Connect: Connect_FN,
	Disconnect: Disconnect_FN,
	LoadDevices: LoadDevices_FN,
	OnConnectionSuccess: null,
	GetDeviceByName: GetDeviceByName_FN
};

function InitUser_FN(CALLBACK_FN){
	
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
				writelog("Initialisation " + "[OK]".bold);
			 
				if(CALLBACK_FN){
					CALLBACK_FN(); 
				} 	
			}
			else
				writelog("Initialisation Error : " + zipabox.InitUser_Return.error.red);
			
			
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err)
				writelog("Initialisation error : " + err.red);
			else
				writelog("Initialisation error status code : " + res.statusCode.red);
		}
	);	
}

function GenerateTokenizedURI(){
	var crypto      = require('crypto');
        var sh_login    = zipabox.nonce + crypto.createHash('sha1').update(zipabox.password).digest('hex');
       	var api_token   = crypto.createHash('sha1').update(sh_login).digest('hex');
	
	return zipabox.loginURL.replace('[username]',zipabox.username).replace('[token]',api_token);
}

function LoginUser_FN(CALLBACK_FN) {
	writelog("Login " + "[processing...]".bold,false); 
	
	if (zipabox.nonce == "" || zipabox.username == "" || zipabox.password == "")
	{
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
				writelog("Login " + "[OK]".bold);
				
				if (zipabox.OnConnectionSuccess)
				{
					zipabox.OnConnectionSuccess();
				}
				
				if(CALLBACK_FN){
					CALLBACK_FN(); 
				} 		
			}
			else
			{
				writelog("Login " + "[ERROR]".red.bold);	
			}
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err)
				writelog("Login error : " + err.red);
			else
				writelog("Login error status code : " + res.statusCode.red);
		}
	);	
}

function LogoutUser_FN(ON_AFTERDISCONNECT){
	
	writelog("Logout " + "[processing...]".bold,false); 
	
	if (!zipabox.connected)
	{
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
				writelog("Logout " + "[OK]".bold);
				
				if(ON_AFTERDISCONNECT){
					ON_AFTERDISCONNECT(); 
				}	
			}	
			else
				writelog("Logout " + "[ERROR]".red.bold);			
			 
		},
		/*ONERROR_FN*/ function(err, res, body){
			if(err)
				writelog("Disconnection error : " + err.red);
			else
				writelog("Disconnection error status code : " + res.statusCode.red);
		}
	);	
}

function LoadDevices_FN(CALLBACK_FN,FOREACH_DEVICE_FN) {
	var LoadDevice = function(CALLBACK_FN,deviceid_int) {
		var device = zipabox.devices[deviceid_int];
		
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
	
	writelog("LoadDevices " + "[processing...]".bold);
	
	var subsequenty = require('sequenty');
	var DevicesSeqFunc = [];
	
	for (var deviceid in zipabox.devices)
	{
		DevicesSeqFunc.push(LoadDevice);	
	}	
	
	DevicesSeqFunc.push(function(CALLBACK_FN){
		writelog("LoadDevices " + "[OK]".bold);
		if(CALLBACK_FN)		
			CALLBACK_FN();
	});
	
	if (CALLBACK_FN)
		DevicesSeqFunc.push(CALLBACK_FN);
	
	subsequenty.run(DevicesSeqFunc);	
}

function Connect_FN(ON_AFTERCONNECT) {
	
	var sequenty = require('sequenty');
	var SeqFunc = [zipabox.InitUser,zipabox.LoginUser];
	if (ON_AFTERCONNECT)
	{			
		SeqFunc.push(function(){ if (zipabox.connected) ON_AFTERCONNECT(); });			
	}
	sequenty.run(SeqFunc);		
}

function Disconnect_FN(ON_AFTERDISCONNECT){
	LogoutUser_FN(ON_AFTERDISCONNECT);
}

module.exports = zipabox;
