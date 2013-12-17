# Zipabox (http://www.zipato.com) 

This is a module to connect, load and use zipabox.

## License

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 0.1, December 2013

 Copyright (C) 2013 Zipabox Interface <jchenavas@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

```
 This program is free software. It comes without any warranty, to
 the extent permitted by applicable law. You can redistribute it
 and/or modify it under the terms of the Do What The Fuck You Want
 To Public License, See http://www.wtfpl.net/ for more details.
```


## Description

Control the zipabox

## NodeJS installation

```
npm install zipabox
```

## For Developers

Simple Usage of module:
```js
var zipabox = require("zipabox");

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.Connect(function () {
    // Do something when connected
    zipabox.LoadDevices(
        function () {
            // Do something when all devices are loaded
            zipabox.Disconnect();
        },
        function (device) {
            // Do something for each device loaded
            // use device.json to access to the device (see zipabox API https://my.zipato.com/zipato-web/api/)
            console.log("" + device);
        });
});
```

Events Use:
```js
var zipabox = require("zipabox");

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.events.OnBeforeConnect = function(){
	console.log("OnBeforeConnect");
}

zipabox.events.OnAfterConnect = function(){
	console.log("OnAfterConnect");
	zipabox.LoadDevices();	
}

zipabox.events.OnBeforeLoadDevices = function(){
	console.log("OnBeforeLoadDevices");
}

zipabox.events.OnAfterLoadDevices = function(){
	console.log("OnAfterLoadDevices");
	zipabox.Disconnect();	
}

zipabox.events.OnBeforeLoadDevice = function(device){
	console.log("Loading : " + device.name);
}

zipabox.events.OnAfterLoadDevice = function(device){
	console.log(device.name + " Loaded");
	console.log(JSON.stringify(device.json,null,4));
}

zipabox.events.OnBeforeDisconnect = function(){
	console.log("OnBeforeDisconnect");
}

zipabox.events.OnAfterDisconnect = function(){
	console.log("OnAfterDisconnect");
}

zipabox.events.OnInitUserProgress = function(msg){
	console.log(JSON.stringify(msg));
}

zipabox.events.OnLoginUserProgress = function(msg){
	console.log(JSON.stringify(msg));
}

zipabox.events.OnLogoutUserProgress = function(msg){
	console.log(JSON.stringify(msg));
}

zipabox.Connect();
```

Disable Logging :
```js
zipabox.showlog = false;
```

Adding Date/Time prefix to log (if zipabox.showlog is true):
```js
zipabox.show_datetime_in_log = true;
```

## Detailed Documentation :
### Creating Object :
The Object is JSON type object
```js
var zipabox = require("[PATH TO zipabox.js]/zipabox");
```
### Object's usual properties :
#### Show Logs
```js
zipabox.showlog=true;
```
#### Define Username and Password
```js
zipabox.username="toto@titi.com";
zipabox.password="blabliblu";
```
#### Knowing if Zipabox connection is open
```js
zipabox.connected=false;
```
#### Methods :
```js
zipabox.Connect([optionnal]ON_AFTERCONNECT_FUNCTION_DEFINITION);
zipabox.Disconnect([optionnal]ON_AFTERDISCONNECT_FUNCTION_DEFINITION);

zipabox.LoadDevices([optionnal]ON_AFTERLOADDEVICES,[optionnal]FOREACH_LOADED_DEVICE);
```
##### Example :
```js
function OnAfterZipaboxDisconnect(){
    console.log("Disconnected");
}

function OnAfterZipaboxConnect(){
    console.log("Connected");
    
    zipabox.LoadDevices(OnAfterLoadDevices,ForEachLoadedDevice);
    // OR 
    zipabox.LoadDevices(OnAfterLoadDevices);
    // OR 
    zipabox.LoadDevices(null,ForEachLoadedDevice);
}

function OnAfterLoadDevices(){
    zipabox.Disconnect(OnAfterZipaboxDisconnect);
}

function ForEachLoadedDevice(device){
    console.log(""+device); //Call device.toString() whith "" before device else show JSON Object (as object)
}

zipabox.Connect(OnAfterZipaboxConnect);
```

### Set Device Value
#### Methods :
```js
zipabox.SetDeviceValue([uuid],[attribute],[value],[optionnal]ON_SUCCESS,[optionnal]ON_ERROR,[optionnal]ON_AFTERSETDEVICEVALUE);
```
##### Example :
```js
function OnAfterZipaboxDisconnect(){
    console.log("Disconnected");
}

function OnAfterZipaboxConnect(){
    console.log("Connected");  
    console.log("Loading devices : ");  
    zipabox.LoadDevices(OnAfterLoadDevices,ForEachLoadedDevice);
}

function OnAfterLoadDevices(){
		
    zipabox.SetDeviceValue("12324654",11,true,
	    function(msg){ //ON_SUCCESS
	    	console.log("Yes! ;-)");	
	    },function(err){ //ON_ERROR
	    	console.log("Oh no! It's a bad day! :'-(");		
	    },function(){ //ON_AFTERSETDEVICEVALUE
	    	zipabox.Disconnect(OnAfterZipaboxDisconnect);		
	    });
}

function ForEachLoadedDevice(device){
    console.log(""+device); //Call device.toString() whith "" before device else show JSON Object (as object)
}

zipabox.Connect(OnAfterZipaboxConnect);
```

### Set Device Value on Unloaded Device
#### Methods :
```js
 zipabox.SetUnLoadedDeviceValue([uuid],[attribute],[value],[optionnal]ON_SUCCESS,[optionnal]ON_ERROR,[optionnal]ON_AFTERSETDEVICEVALUE);
```

### Run Scene on Unloaded Device
#### Methods :
```js
zipabox.RunUnLoadedScene([uuid])
```

### Advanced Example
```js
var zipabox = require("zipabox");
var argv = require("optimist").argv;

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.showlog = (argv.l) ? argv.l : false;
zipabox.show_datetime_in_log = true;

zipabox.checkforupdate_auto = false;

zipabox.events.OnBeforeConnect = function(){
	console.log("OnBeforeConnect");
}

zipabox.events.OnAfterConnect = function(){
	console.log("OnAfterConnect");	
	zipabox.LoadDevicesFromFile('./devices.json');
}

zipabox.events.OnBeforeDisconnect = function(){
	console.log("OnBeforeDisconnect");
}

zipabox.events.OnAfterDisconnect = function(){
	console.log("OnAfterDisconnect");
}

zipabox.events.OnBeforeLoadDevices = function(){
	console.log("OnBeforeLoadDevices");
}

zipabox.events.OnAfterLoadDevices = function(){
	console.log("OnAfterLoadDevices");
	zipabox.SaveDevicesToFile('./devices.json');
}

var ModuleToHTML = function(theuuid,themodule){
	var retval = "<div id='" + theuuid + "' class='" + themodule.uiType + "'>\n";
	retval += "<div class='name'>" + themodule.name + "</div>\n";
	retval += "<div class='attributes'>\n";
	for(var attributeid in themodule.attributes){
		var attribute = themodule.attributes[attributeid];
		var attrname = (attribute.definition) ? attribute.definition.name : attribute.name;
		
		retval += "<div class='attribute'>\n";
		retval += "<div class='id'>" + attributeid + "</div>\n";
		retval += "<div class='attributename'>" + attrname + "</div>\n";
		retval += "<div class='value'>" + attribute.value + "</div>\n";
		retval += "</div>\n";
	}
	retval += "</div>\n";	
			
	return retval + "</div>\n";	
};

zipabox.events.OnAfterLoadDevicesFromFile = function(result){
	console.log("zipabox.events.OnAfterLoadDevicesFromFile");	
	
	if (!(result)){
	
		console.log("<div id='meters' class='device'>\n");
		console.log("<div id='device' class='title'>meters</div>\n");
		zipabox.ForEachModuleInDevice("meters",function(module_uuid,module){
			
			module.toString = function(){ return ModuleToHTML(module_uuid,module); };
			
			console.log(""+module);
		});		
		console.log("</div>\n");
		
		console.log("<div id='lights' class='device'>\n");
		console.log("<div id='device' class='title'>lights</div>\n");
		zipabox.ForEachModuleInDevice("lights",function(module_uuid,module){
			
			module.toString = function(){ return ModuleToHTML(module_uuid,module); };
			
			console.log(""+module);
		});
		console.log("</div>\n");
		zipabox.Disconnect();	
	}		
	else
		zipabox.LoadDevices();
}

zipabox.Connect();

```