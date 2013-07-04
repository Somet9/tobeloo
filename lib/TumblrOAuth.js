/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 rikuta0209
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Request = require("sdk/request").Request;
OAuth = require("./oauth").OAuth;

function myCreate(obj){
	return obj === null ? null : Object.create(obj);
}

function OAuthException(message){
	this.message = message;
}

OAuthException.prototype.what = function(){
	return this.message;
}

function TumblrHttp(request_object){
	/*
		request_object.url : URL
		request_object.method : Method
		request_object.headers : Headers
		request_object.parameters : Parameters
		request_object.onComplete : function 
	*/
	
	var host = "http://api.tumblr.com/v2/";
	
	if(typeof request_object.parameters === "undefined"){
		request_object.parameters = {};
	}
	
	if(request_object.url.match(/^(https?:\/\//) === null){
		request_object.url = host + request_object.url;
	}
	
	var req = Request({
		"url" : request_object.url,
		"headers" : request_object.headers,
		"content" : request_object.parameters,
		"onComplete" : request_object.onComplete
	});
	
	switch(request_object.method.toLowerCase()){
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

function TumblrOAuth(tumblr_account){
	
	var tobj = {};
	
	tobj.oauth.get = function(request_object){
		/*
			request_object.url : URL
			request_object.parameters : Parameters
			request_object.onComplete : function 
		*/
		
		
	}
	
	return tobj;
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
		default:
		case "oauth" : 
			return this.OAuthRequest(action, method, parameters);
			break;
		case "key" : 
			return this.KeyRequest(action, method, parameters);
			break;
		case "none" : 
			return this.NoAuthRequest(action, method, parameters);
			break;
	}
}

exports.TumblrOAuth = TumblrOAuth;
exports.OAuthException = OAuthException;