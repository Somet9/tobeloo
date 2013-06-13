//OAuthUtility.js

function urldecode_rfc3986(str){
	return decodeURIComponent(str.replace(/%2A/g, "*").replace(/%21|%27|%28|%29/g, unescape));
}

function parse_parameters(input){
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

exports.urldecode_rfc3986 = urldecode_rfc3986;
exports.parse_parameters = parse_parameters;