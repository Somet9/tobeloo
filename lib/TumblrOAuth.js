/*
 * Copyright 2013 rikuta0209
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Request = require("sdk/request").Request;

var { Class } = require('sdk/core/heritage');
var { Unknown } = require('sdk/platform/xpcom');
var { Cc, Ci } = require('chrome')

var util = { 
	"urldecode_rfc3986":function(str){
		return decodeURIComponent(str.replace(/%2A/g, "*").replace(/%21|%27|%28|%29/g, unescape));
	}
	
	"parse_parameters":function(input){
		var out = new Object();
		
		if(typeof input === "undefined" || typeof input !== "string"){
			return new Array();
		}
		
		var spl_amp = input.split("&");
		
		for(var i = 0; i < spl_amp.length; i++){
			var spl_eq = spl_amp[i].split("=");
			
			out[spl_eq[0]] = spl_eq[1];
		}
		
		return out;
	}
}

function myCreate(obj){
	return obj === null ? null : Object.create(obj);
}

function OAuthException(message){
	this.message = message;
}

OAuthException.prototype.what = function(){
	return this.message;
}

function OAuthConsumer(key, secret){
	if(typeof key === "undefined"){
		throw new OAuthException("Consumer Key is undefined.");
	}
	
	if(typeof secret === "undefined"){
		throw new OAuthException("Consumer Secret is undefined.");
	}
	
	this.key = key;
	this.secret = secret;
}

function OAuthToken(key, secret){
	if(typeof key === "undefined"){
		throw new OAuthException("OAuth Token is undefined.");
	}
	
	if(typeof secret === "undefined"){
		throw new OAuthException("OAuth Token Secret is undefined.");
	}
	
	this.key = key;
	this.secret = secret;
}

function TumblrOAuth(cousumer_key, consumer_secret, oauth_token, oauth_token_secret){
	this.consumer = new OAuthConsumer(consumer_key, consumer_secret);
	
	if(typeof oauth_token !== "undefined" && typeof oauth_token_secret !== "undefined"){
		this.token = new OAuthToken(oauth_token, oauth_token_secret);
	} else {
		this.token = null;
	}
}

TumblrOAuth.prototype.host = "http://api.tumblr.com/v2/";

TumblrOAuth.prototype.http = function(target_url, method, headers, parameters){
	/*
	this.last_responceオブジェクトにレスポンスの結果が返る
	*/
	
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	if(target_url.match(/^(https?:\/\//) === null){
		target_url = this.host + target_url;
	}
	
	
	var req = Request({
		"url" : target_url,
		"headers" : headers,
		"content" : parameters,
		"onComplete" : function(responce){
			this.last_responce = new Object();
			
			this.last_responce.text = responce.text;
			
			if(responce.json === null){
				this.last_responce.json = null;
			} else {
				this.last_responce.json = Object.create(responce.json);
			}
			
			this.last_responce.status = responce.status;
			this.last_responce.statusText = responce.statusText;
			this.last_responce.headers = Object.create(responce.headers);
		}.bind(this),
	});
	
	switch(method.toLowerCase()){
		case "get" :
			req.get();
			break;
		case "post" :
			req.post();
			break;
		case "put" :
			req.put();
			break;
		default :
			throw new OAuthException("Undefined HTTP Method.");
			break;
	}
}

TumblrOAuth.prototype.getXAuthToken = function(mail, pass){
	var message = {
		"method" : "POST",
		"action" : "https://www.tumblr.com/oauth/access_token",
		"parameters" : {
			"x_auth_username" : mail,
			"x_auth_password" : pass,
			"x_auth_mode" : "client_auth",
			"oauth_consumer_key" : this.consumer.key,
			"oauth_signature_method" : "HMAC-SHA1",
			"oauth_version" : "1.0"
		}
	};
	
	var accessor = {
		"consumerSecret" : this.consumer.secret,
		"tokenSecret" : ""
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	
	this.http(message.action, message.method, {
		"Authorization" : OAuth.getAuthorizationHeader("", message.parameters)
	});
	
	var tk = util.parse_parameters(this.last_responce.text);
	
	this.token = new OAuthToken(kt["oauth_token"], tk["oauth_token_secret"]);
}

TumblrOAuth.prototype.OAuthRequest = function(action, method, parameters){
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	var accessor = {
		"consumerKey" : this.consumer.key,
		"consumerSecret" : this.consumer.secret,
		"token" : this.token.key,
		"tokenSecret" : this.token.secret
	};
	
	var message = {
		"method" : method,
		"action" : action,
		"parameters" : parameters
	};
	
	switch(method.toLowerCase()){
		case "get" :
			var url = OAuth.addToURL(message.action, message.parameters);
			OAuth.completeRequest(message, accessor);
			this.http(url, message.method, {
				"Authorization" : OAuth.getAuthorizationHeader("", message.parameters)
			});
			break;
		case "post" :
			var requestBody = OAuth.formEncode(message.parameters);
			OAuth.completeRequest(message, accessor);
			this.http(message.action, message.method, {
				"Authorization" : OAuth.getAuthorizationHeader("", message.parameters)
			}, requestBody);
			break;
		default :
			throw new OAuthException("Undefined HTTP Method.");
			break;
	}
	
	return {
		"text" : this.last_responce.text,
		"json" : myCreate(this.last_responce.json),
		"status" : this.last_responce.status,
		"statusText" : this.last_responce.statusText,
		"headers" : Object.create(this.last_responce.headers)
	};
}

TumblrOAuth.prototype.KeyRequest = function(action, method, parameters){
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	parameters.api_key = this.consumer.key;
	
	this.http(action, method, {}, parameters);
	
	return {
		"text" : this.last_responce.text,
		"json" : myCreate(this.last_responce.json),
		"status" : this.last_responce.status,
		"statusText" : this.last_responce.statusText,
		"headers" : Object.create(this.last_responce.headers)
	};
}

TumblrOAuth.prototype.NoAuthRequest = function(action, method, parameters){
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	this.http(action, method, parameters);
	
	return {
		"text" : this.last_responce.text,
		"json" : myCreate(this.last_responce.json),
		"status" : this.last_responce.status,
		"statusText" : this.last_responce.statusText,
		"headers" : Object.create(this.last_responce.headers)
	};
}

TumblrOAuth.prototype.get = function(action, parameters, auth){
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	if(typeof auth === "undefined"){
		auth = "oauth";
	}
	
	var method = "GET";
	
	switch(auth.toLowerCase()){
		case "oauth" : 
			return this.OAuthRequest(action, method, parameters);
			break;
		case "key" : 
			return this.KeyRequest(action, method, parameters);
			break;
		case "none" : 
			return this.NoAuthRequest(action, method, parameters);
	}
}

TumblrOAuth.prototype.postTumblrOAuth.prototype.get = function(action, parameters, auth){
	if(typeof parameters === "undefined"){
		parameters = {};
	}
	
	if(typeof auth === "undefined"){
		auth = "oauth";
	}
	
	var method = "POST";
	
	switch(auth.toLowerCase()){
		case "oauth" : 
			return this.OAuthRequest(action, method, parameters);
			break;
		case "key" : 
			return this.KeyRequest(action, method, parameters);
			break;
		case "none" : 
			return this.NoAuthRequest(action, method, parameters);
	}
}