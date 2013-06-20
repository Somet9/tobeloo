//TumblrOAuthTokenGetter
var Request = require("sdk/request").Request;
var OAuth = require("./oauth").OAuth;
var qstring = require('sdk/querystring');
var tabs = require("sdk/tabs");
var data = require("sdk/self").data

function TumblrOAuthTokenGetter(consumer_key, consumer_secret){
	this.consumer_key = consumer_key;
	this.consumer_secret = consumer_secret;
}

TumblrOAuthTokenGetter.prototype.GetRequestToken(){
	var mine = this;
	var message = {
		"method": "GET",
		"action": "http://www.tumblr.com/oauth/request_token",
		"parameters": {
			"oauth_consumer_key": mine.consumer_key,
			"oauth_signature_method": "HMAC-SHA1",
			"oauth_callback": data.url("index.html")
		}
	};
	
	var accessor = {
		"consumerSecret": mine.consumer_secret
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	
	var reqToken = Request({
		"url": OAuth.addToURL(message.action, message.parameters),
		"onComplete": function(responce){
			var params = qstring.parse(responce.text);
			var token = params.oauth_token;
			var secret = params.oauth_token_secret;
			var mine = this;
			
			mine.request_token = token;
			mine.request_token_secret = secret;
			
			var next_message = {
				"method": "GET",
				"action": "http://www.tumblr.com/oauth/authorize",
				"parameters": {
					"oauth_consumer_key": mine.consumer_key,
					"oauth_signature_method": "HMAC-SHA1",
					"oauth_token": token
				}
			};
			
			var next_accessor = {
				"consumerSecret": mine.consumer_secret,
				"oauth_token_secret": secret
			};
			
			OAuth.setTimestampAndNonce(next_message);
			OAuth.SignatureMethod.sign(next_message, next_accessor);
			
			tabs.open({
				"url": OAuth.addToURL(next_message.action, next_message.parameters),
			});
		}.bind(mine)
	});
}