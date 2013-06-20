/* 引数はTumblrOAuth */

var TumblrOAuth = require("./TumblrOAuth").TumblrOAuth;

function TumblrAPIException(message){
	this.message = message;
}

TumblrAPIException.prototype.what = function(){
	return this.message;
}

function TumblrAPI(to){ 
	if(to instanceof TumblrOAuth){
		return {
			user: function(){
				return {
					info: function(){
						return to.OAuthRequest("user/info", "GET").json;
					},
					dashboard: function(parameters){
						return to.OAuthRequest("user/dashboard", "GET", parameters).json;
					},
				};
			},
			blog: function(base_host_name){
			}
		};
	
	} else {
		throw new TumblrAPIException("It is not an instance of TumblrOAuth.")
	}
}