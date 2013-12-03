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

## For Developers

Simple Usage of module:
```js
var zipabox = require("[PATH TO zipabox.js]/zipabox");

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

            if (typeof (device.json["123456"]) != "undefined") {
                device.json["123456"].attributes["11"].setdatas(true);
            }
        });
});
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
zipabox.SetDeviceValue([uuid],[attribute],[value],[optionnal]ON_SUCCESS,[optionnal]ON_ERROR);
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
	    function(msg){
	    	console.log("Yes! ;-)");
	    	zipabox.Disconnect(OnAfterZipaboxDisconnect);	
	    },function(err){
	    	console.log("Oh no! It's a bad day! :'-(");
	    	zipabox.Disconnect(OnAfterZipaboxDisconnect);		
	    });
}

function ForEachLoadedDevice(device){
    console.log(""+device); //Call device.toString() whith "" before device else show JSON Object (as object)
}

zipabox.Connect(OnAfterZipaboxConnect);
```
