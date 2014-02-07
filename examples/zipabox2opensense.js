function writelog(line){
	console.log(line);	
}

var colors = require('colors');
var zipabox = require("zipabox");

zipabox.showlog = true;
zipabox.username = "[LOGIN UTILISATEUR ZIPABOX]";
zipabox.password = "[MOT DE PASSE ZIPABOX]";

var opensense = require("open.sen.se"); 
opensense.sense_key = "[API Key open.sen.se]";
opensense.showlog = false;

zipabox.events.OnAfterConnect = function(){
	writelog("OnAfterConnect");
	zipabox.LoadDevices();	
}

zipabox.events.OnAfterLoadDevice = function(device){
	function CollectValuesForFeeds(uuid,attr,value){
		if (zipabox_device_link_feed[uuid]){
	                if (zipabox_device_link_feed[uuid].attributes[attr]){           
				writelog("Collecting device value for feeding...".yellow);  
	 
				if (!isNaN(parseFloat(value)))
				     value = parseFloat(value).toFixed(2);
				     
	                        opensense.feeds[zipabox_device_link_feed[uuid].attributes[attr].feed_id] = {"value": value};
	                }
	        }	
	}
	
	writelog("" + device);
	for (var uuid in device.json){				
		var devicejson = device.json[uuid];
				
		for (var attr in devicejson.attributes){				
			var attribute = devicejson.attributes[attr];                               	
			CollectValuesForFeeds(uuid,attr,attribute.value);
		}
	}	
}

zipabox.events.OnAfterLoadDevices = function(){
	writelog("OnAfterLoadDevices!!!");
	opensense.sendfeeds();
}

opensense.events.OnBeforeSendFeed = function(feed){
	writelog("Sending Feed : " + (""+feed.json.feed_id).yellow.bold + " value : " + feed.json.value.bold);	
}

opensense.events.OnAfterSendFeed = function(feed){
	writelog("Feed sended : " + (""+feed.json.feed_id).yellow.bold + " value : " + feed.json.value.bold);	
}

opensense.events.OnAfterSendFeeds = function(){
	zipabox.Disconnect();
}

var zipabox_device_link_feed = {        
	"[UUID MODULE ZIPABOX]" : {
                attributes: {
                        [ID ATTRIBUT MODULE ZIPABOX]: { feed_id: [FEED_ID] }
                }
        }
};

zipabox.Connect();