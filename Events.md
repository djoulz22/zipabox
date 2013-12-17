# Zipabox module's Events

## Events list
### OnBeforeConnect:
```
Event fired when you call zipabox.Connect() method BEFORE the zipabox connection
```
### OnAfterConnect:
```
Event fired when you call zipabox.Connect() method AFTER success zipabox connection (zipabox.connected == true)	
```

### OnBeforeDisconnect:
```
Event fired when you call zipabox.Disconnect() method BEFORE the zipabox disconnection
```
### OnAfterDisconnect:
```
Event fired when you call zipabox.Disconnect() method AFTER success the zipabox disconnection (zipabox.connected == false)
```

### OnBeforeLoadDevices:
```
Event fired when you call zipabox.LoadDevices() method BEFORE loading devices
```
### OnAfterLoadDevices:
```
Event fired when you call zipabox.LoadDevices() method AFTER loading all devices
```

### OnBeforeLoadDevice:
```
Event fired for each loading device method BEFORE loading 1 device, 
function definition : 
```
```js
	function(device){
		if(device){ 
			console.log(device.name + " Loading...")
		} 
	};
```

### OnAfterLoadDevice:
```
Event fired for each loading device method AFTER loading 1 device, 
function definition : 
```
```js
	function(device){
		if(device){ 
			console.log(device.name + " Loaded")
		} 
	};
```
### OnBeforeGetDevicesLogs:
```
null
```
### OnAfterGetDevicesLogs:
```
null	
```

### OnBeforeSetDeviceValue:
```
null
```
### OnAfterSetDeviceValue:
```
null	
```

### OnBeforeSetUnLoadedDeviceValue:
```
null		
```
### OnAfterSetUnLoadedDeviceValue:
```
null	
```

### OnBeforeRunScene:
```
null
```
### OnAfterRunScene:
```
null	
```

### OnBeforeUnLoadedRunScene:
```
null,
```
### OnAfterUnLoadedRunScene:
```
null	
```

### OnInitUserProgress:
```
null
```
### OnLoginUserProgress:
```
null
```
### OnLogoutUserProgress:
```
null	
```

### OnBeforeSaveDevicesToFile:
```
null
```
### OnAfterSaveDevicesToFile:
```
null,
```
### OnBeforeLoadDevicesFromFile:
```
null,
```
### OnAfterLoadDevicesFromFile:
```
null	
```

## Using events example :
```js
var zipabox = require("zipabox");

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.events.OnAfterConnect = function(){
	// Do something when connected
    zipabox.LoadDevices();
}

zipabox.events.OnAfterLoadDevices = function(){
	console.log("OnAfterLoadDevices");	
	zipabox.SaveDevicesToFile('./devices.json');
	zipabox.Disconnect();
}

zipabox.events.OnAfterLoadDevice = function(device){
	console.log("OnAfterLoadDevice");	
	// Do something for each device loaded
        // use device.json to access to the device (see zipabox API https://my.zipato.com/zipato-web/api/)
        console.log("" + device);
}

zipabox.Connect();
```