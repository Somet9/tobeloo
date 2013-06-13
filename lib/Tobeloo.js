var TumblrOAuth = require("./TumblrOAuth").TumblrOAuth;

var self = require("sdk/self");
var data = self.data;

var consumer = JSON.parse(data.load("consumer.json"));

var to; //for TumblrOAuth

function TobelooException(message){
	this.message = message;
}

TobelooException.prototype.what = function(){
	return this.message;
}

function AuthencateStatus(){
	if(typeof to === "undefined"){
		return false;
	} else if(to instanceof TumblrOAuth){
		if(to.token !== null){
			var resp = to.OAuthRequest("user/info", "GET");
			if(resp.json.meta.status == 200){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		throw new TobelooException("It is not an instance of TumblrOAuth.");
	}
}

function setToken(token, token_secret){
	if(typeof id === "undefined" || isNaN(id)){
		id = 0;
	}
	
	to = new TumblrOAuth(consumer.key, consumer.secret, token, token_secret);
}