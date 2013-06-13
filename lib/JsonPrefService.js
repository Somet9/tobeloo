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

//JsonPrefService
function JsonPrefService(addon_name, pref_name, defaultPrefs){
	if(typeof pref_name === "undefined"){
		pref_name = "json"
	}
	
	this.prefSv = new preferenceService(addon_name);
	this.name = pref_name;
	this.defaultPrefs = {};
	
	if(typeof defaultPrefs !== "undefined"){
		var json_str = JSON.stringify(defaultPrefs);
		this.prefSv.set(this.name, json_str);
		this.defaultPrefs = JSON.parse(json_str);;
	}
}

JsonPrefService.prototype.load = function(){
	return JSON.parse(this.prefSv.get(this.name, "{}"));
}

JsonPrefService.prototype.set = function(name, val){
	var obj = this.load();
	
	obj[name] = val;
	this.prefSv.set(this.name, JSON.stringify(obj));
}

JsonPrefService.prototype.get = function(name, defaultValue){
	var obj = this.load();
	
	if(typeof defaultValue !== "undefined" && typeof obj[name] === "undefined"){
		this.set(name, defaultValue);
		return defaultValue;
	}
	
	return obj[name];
}

JsonPrefService.prototype.has = function(name){
	var obj = this.load();
	return typeof obj[name] !== "undefined";
}

JsonPrefService.prototype.getDefault = function(name){
	return this.defaultPrefs[name];
}

JsonPrefService.prototype.hasDefault = function(name){
	return typeof this.defaultPrefs[name] !== "undefined";
}

JsonPrefService.prototype.isSet = function(name){
	
	if(this.hasDefault(name) && this.has(name)){
		return this.getDefault(name) === this.get(name);
	} else {
		return false;
	}
}

//Exports
exports.JsonPrefService = JsonPrefService;