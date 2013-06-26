function urldecode_rfc3986(str){
	return decodeURIComponent(str.replace(/%2A/g, "*").replace(/%21|%27|%28|%29/g, unescape));
}

function urlencode_rfc3986(str){
	return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

exports.querystring = {
	stringify: function(obj, sep, ass){
		sep = (typeof sep !== "string") ? "&" : sep;
		ass = (typeof ass !== "string") ? "=" : ass;
		
		var qstr = "";
		
		var cnt = 0;
		for(key in obj){
			if(cnt++ > 0){
				qstr += sep;
			}
			qstr += key + ass + urlencode_rfc3986(obj[key]);
		}
		
		return qstr;
	},
	
	parse: function(qstr, sep, ass){
		sep = (typeof sep !== "string") ? "&" : sep;
		ass = (typeof ass !== "string") ? "=" : ass;
		
		var obj = {};
		
		var mapstr = qstr.split(sep);
		
		for(var i = 0; i < mapstr.length; i++){
			var map = mapstr.split(ass);
			obj[map[0]] = urldecode_rfc3986(map[1]);
		}
		
		return obj;
	}
}