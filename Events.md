# Zipabox module's Events

## Events list
### OnBeforeConnect:
```
Event fired when you call zipabox.Connect() method BEFORE the zipabox connection
```
### OnAfterConnect:
```
Event fired when you call zipabox.Connect() method AFTER success zipabox connection 
So, when zipabox.connected is true
```

### OnBeforeDisconnect:
```
Event fired when you call zipabox.Disconnect() method BEFORE the zipabox disconnection
```
### OnAfterDisconnect:
```
Event fired when you call zipabox.Disconnect() method AFTER success the zipabox disconnection
So, when zipabox.connected is false
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
Event fired when you call zipabox.Connect(). It inform you on the progress of InitUser.
function definition : 
```
```js
	zipabox.events.OnInitUserProgress = function(msg){
                // Your code with msg		
	};
```
```
        msg is an JSON Object with this format :
        
        {
                statusCode (integer from 0 to 4), 
                msg (string)
        };  
        
        msg.statusCode = 0 : start InitUser,
        msg.statusCode = 1 : InitUser is successfuly terminated,
        msg.statusCode > 1 : An error occured during InitUser, see msg.msg
```
### OnLoginUserProgress:
```
Event fired when you call zipabox.Connect(). It inform you on the progress of LoginUser.
function definition : 
```
```js
	zipabox.events.OnLoginUserProgress = function(msg){
                // Your code with msg		
	};
```
```
        msg is an JSON Object with this format :
        
        {
                statusCode (integer from 0 to 5), 
                msg (string)
        };  
        
        msg.statusCode = 0 : start LoginUser,
        msg.statusCode = 1 : LoginUser invalid username or password,
        msg.statusCode = 2 : LoginUser is successfuly terminated,
        msg.statusCode > 2 : An error occured during LoginUser, see msg.msg
```
### OnLogoutUserProgress:
```
Event fired when you call zipabox.Disconnect(). It inform you on the progress of LogoutUser.
function definition : 
```
```js
	zipabox.events.OnLogoutUserProgress = function(msg){
                // Your code with msg		
	};
```
```
        msg is an JSON Object with this format :
        
        {
                statusCode (integer from 0 to 5), 
                msg (string)
        };  
        
        msg.statusCode = 0 : start LogoutUser,
        msg.statusCode = 1 : LogoutUser you are not connected,
        msg.statusCode = 2 : LogoutUser is successfuly terminated,
        msg.statusCode > 2 : An error occured during LogoutUser, see msg.msg
```

### OnBeforeSaveDevicesToFile:
```
Event fired when you call zipabox.SaveDevicesToFile BEFORE start of saving file 
```
### OnAfterSaveDevicesToFile:
```
Event fired when you call zipabox.SaveDevicesToFile AFTER process SUCCESS
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