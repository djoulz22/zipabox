# Zipabox module's Properties

## Properties list
	showlog: 		Define on "true" if you want to see logs (default: true),
	show_datetime_in_log: 	Define on "true" if you want to see datetimed logs (default: true),
	checkforupdate_auto: 	Define on "true" if you want module check for update (default: true),
	baseURL: 		The baseURL for your zipabox (default: "https://my.zipato.com:443/zipato-web/rest/") [don't change if you are not sure],
	initURL: 		The User initialisation's URI (default: "user/init") [don't change if you are not sure],
	loginURL: 		The Login URI (default: "user/login?username=[username]&token=[token]") [don't change if you are not sure],
	logoutURL: 		The Logout URI (default: "user/logout") [don't change if you are not sure],	
	logs_UUID_ATTR_URL: 	The Logs URI (default: "/log/attribute/[uuid]/[attribute]/") [don't change if you are not sure],
	setvalueURL: 		The Set Lights Value URI (default: "lights/[uuid]/attributes/[attribute]/value" [don't change if you are not sure],
	runsceneURL: 		The Run Scene URI (default: "scenes/[uuid]/run" [don't change if you are not sure],
	username: 		Your Zipato's User Name (email),
	password: 		Your Zipato's Password,
	nonce: 			[private NEVER USE IT],
	connected: 		Knowing if you are connected,
	devices: 		Devices Array (zipabox, meters, lights, sensors, ...), description : Array of object : {name: "lights", uri:"lights/", json:[all device's modules]} 
	
## zipabox.devices Property :
After loading devices [see Events.md], an object was added (json) access to device with method zipabox.GetModuleByDevice([devicename]) [see Methods.md]
	
## Accessing properties example :
```js
var zipabox = require("zipabox");

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.showlog = false;
zipabox.checkforupdate_auto = true;
```
	