var Request     = require('sdk/request').Request;
var OAuth       = require('./oauth').OAuth;
var querystring = require('sdk/querystring');
var tabs        = require('sdk/tabs');
var parseUri    = require('./parseuri').parseUri;
var ss          = require('sdk/simple-storage');
var self        = require("sdk/self");

function getConsumer(){
	/* TODO: 取得方法を実装。返り値はconsumer_key、consumer_secretを含んだオブジェクト */
	
	return JSON.parse(self.data.load("consumer.json"));
}

exports.exec = function(){
	//simple-storageを一時記憶として利用
	ss.storage.tumblr_oauth_temp = getConsumer();
	
	//リクエストトークンの取得
	var message = {
		"method": "GET",
		"action": "http://www.tumblr.com/oauth/request_token",
		"parameters": {
			"oauth_consumer_key": ss.storage.tumblr_oauth_temp.consumer_key,
			"oauth_signature_method": "HMAC-SHA1"
		}
	};
	
	var accessor = {
		"consumerSecret": ss.storage.tumblr_oauth_temp.consumer_secret
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	
	Request({
		"url": OAuth.addToURL(message.action, message.parameters),
		"onComplete": function(responce){
			var params = querystring.parse(responce.text);
			var token = params.oauth_token;
			var secret = params.oauth_token_secret;
			
			//取得したリクエストトークンを記憶
			ss.storage.tumblr_oauth_temp.request_token = token;
			ss.storage.tumblr_oauth_temp.request_token_secret = secret;
			
			//認証URLの生成
			var next_message = {
				"method": "GET",
				"action": "http://www.tumblr.com/oauth/authorize",
				"parameters": {
					"oauth_consumer_key": ss.storage.tumblr_oauth_temp.consumer_key,
					"oauth_signature_method": "HMAC-SHA1",
					"oauth_token": token
				}
			};
			
			var next_accessor = {
				"consumerSecret": ss.storage.tumblr_oauth_temp.consumer_secret,
				"oauth_token_secret": secret
			};
			
			OAuth.setTimestampAndNonce(next_message);
			OAuth.SignatureMethod.sign(next_message, next_accessor);
			
			//認証URLを開く
			tabs.open({
				"url": OAuth.addToURL(next_message.action, next_message.parameters),
				"onReady": function(tab){
					var url_info = parseUri(tab.url); //URLに含まれるクエリを取得
					
					if(url_info.host == "www16.atpages.jp" && url_info.path == "/rikuta0209/tobeloo/auth.php"){
						var final_message = {
							"method": "GET",
							"action": "http://www.tumblr.com/oauth/access_token",
							"parameters":{
								"oauth_consumer_key": ss.storage.tumblr_oauth_temp.consumer_key,
								"oauth_signature_method": "HMAC-SHA1",
								"oauth_token": ss.storage.tumblr_oauth_temp.request_token,
								"oauth_verifier": uri_info.queryKey.oauth_verifier
							}
						};
						
						var final_accessor = {
							"consumerSecret": ss.storage.tumblr_oauth_temp.consumer_secret,
							"tokenSecret": ss.storage.tumblr_oauth_temp.request_token_secret
						};
						
						OAuth.setTimestampAndNonce(final_message);
						OAuth.SignatureMethod.sign(final_message, final_accessor);
						
						var accToken = Request({
							"url": OAuth.addToURL(final_message.action, final_message.parameters),
							"onComplete": function(responce){
								var params = querystring.parse(responce.text);
								
								//取得したOAuthのデータをsimple-storageに保存
								ss.storage.accounts.tumblr.consumer_key        = ss.storage.tumblr_oauth_temp.consumer_key;
								ss.storage.accounts.tumblr.consumer_secret     = ss.storage.tumblr_oauth_temp.consumer_secret;
								ss.storage.accounts.tumblr.access_token        = params.oauth_token;
								ss.storage.accounts.tumblr.access_token_secret = params.oauth_token_secret;
								
								delete ss.storage.tumblr_oauth_temp; //一時記憶として利用したsimple-storageの値を削除
							}
						}).get();
					}
				}
			});
		}
	}).get();
}