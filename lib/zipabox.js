//Author JULIEN CHENAVAS

"use strict";

var request = require('request');
var jar = request.jar();
var sequenty = require('sequenty'); 

var zipabox = {
	baseURL: "https://my.zipato.com:443/zipato-web/rest/",
	initURL: "user/init",  
	loginURL: "user/login?username=[username]&token=[token]",
	logoutURL: "user/logout",
	username: "",
	password: "",
	nonce: "",
	connected: false,
	devices: {
		lights: {
		        uri: "lights/"               
		},
		meters: {
		        uri: "meters/"
		},
		sensors: {
		        uri: "sensors/"
		}          
	}	
};

module.exports = zipabox; //export