# Zipabox (http://www.zipato.com) 

This is a module to connect, load and use zipabox.

## License

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2012 S.A.R.A.H. <sarah.project@encausse.net>

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
 To Public License, Version 2, as published by S.A.R.A.H. See
 http://www.wtfpl.net/ for more details.
```


## Description

Control the zipabox

## For Developers

Simple Usage of module:
```js
var zipabox = require("[PATH TO zipabox.js]/zipabox");

zipabox.username = "[ZIPABOX LOGIN]";
zipabox.password = "[ZIPABOX PASSWORD]";

zipabox.Connect(function(){
  // Do something when connected
  zipabox.LoadDevices(
    function(){
      // Do something when all devices are loaded
      zipabox.Disconnect();
    },
    function(device){
      // Do something for each device loaded
      // use device.json to access to the device (see zipabox API https://my.zipato.com/zipato-web/api/)
      for (var uuid in device.json){				
        	var devicejson = device.json[uuid];
        			
        	for (var attr in devicejson.attributes){				
        		var attribute = devicejson.attributes[attr];
        		if (typeof(attribute.value) != "undefined"){
        			var attrname = attribute.name;                                        
        			if (typeof(attribute.definition) != "undefined")
                			attrname = attribute.definition.name;
                                
        			console.log(uuid.green + "(" + devicejson.name.bold + ")" + " - " + attrname + "(" + attr.bold + ")" + " = " + attribute.value.bold);
                        }	
        	}
        }      
    });
});
```
