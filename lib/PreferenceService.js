function preferenceService(addon_name){
	this.addon_name = addon_name;
	this.pref = require("sdk/preferences/service");
}

preferenceService.prototype.getPrefRoot = function(){
	return "extension." + this.addon_name;
}

preferenceService.prototype.getPrefName = function(name){
	return this.getPrefRoot() + "." + name;
}

preferenceService.prototype.set = function(name, val){
	this.pref.set(this.getPrefName(name), val);
}

preferenceService.prototype.get = function(name, defaultVal){
	return this.pref.get(this.getPrefName(name), defaultVal);
}

preferenceService.prototype.has = function(name){
	return this.pref.has(this.getPrefName(name));
}

preferenceService.prototype.keys = function(){
	return this.pref.keys(this.getPrefRoot());
}

preferenceService.prototype.isSet = function(name){
	return this.pref.isSet(this.getPrefName(name));
}

preferenceService.prototype.reset = function(name){
	return this.pref.reset(this.getPrefName(name));
}

preferenceService.prototype.getLocalized = function(name, defaultVal){
	return this.pref.getLocalized(name, defaultVal);
}

preferenceService.prototype.setLocalized = function(name, val){
	this.pref.setLocalized(name, val);
}