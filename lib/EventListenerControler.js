var tabs = require("sdk/tabs");

function checkState(val){
	return (typeof val === "undefined") ? false : ((val === true) ? true : false);
}
/*
イベントリスナーデータ
*/
function EventListenerData(name, func){
	this.name = name;
	this.func = func;
}

EventListenerData.prototype.exec = function(tab){
	this.func(exec);
}

/*
イベントリスナーリスト
*/
function EventListenerList(){
	this.list = {};
}

EventListenerList.prototype.add = function(name, func){
	if(this.list[name] instanceof EventListenerData){
		return false;
	} else {
		this.list[name] = new EventListenerData(name, func);
		return true;
	}
}

EventListenerList.prototype.del = function(name){
	if(this.list[name] instanceof EventListenerData){
		delete this.list[name];
		return true;
	} else {
		return false;
	}
}

EventListenerList.prototype.set = function(name, func){
	if(this.del(name)){
		return this.add(name, func);
	} else {
		return false;
	}
}

EventListenerList.prototype.exec = function(tab){
	for(var listener in this.list){
		listener.exec(tab);
	}
}

function TabEvents(type, tab, state){
	var proto = {};
	/* TODO EXEC */
	this.func_state = state;
	this.type = type;
	
	proto.tab = tab;
	
	if(checkState(state.close)){
		proto.onClose = function(){
			return TabEvents("close", this.tab, {"close":false , "ready":false , "activate":false , "deactivate":false });
		}.bind(proto);
	}
	
	if(checkState(state.ready)){
		proto.onReady = function(){
			return TabEvents("ready", this.tab, {"close":true , "ready":false , "activate":true , "deactivate":true });
		}.bind(proto);
	}
	
	if(checkState(state.activate)){
		proto.onActivate = function(){
			return TabEvents("activate", this.tab, {"close":true , "ready":true , "activate":false , "deactivate":true });
		}.bind(proto);
	}
	
	if(checkState(state.deactivate)){
		proto.onDeactivate = function(){
			return TabEvents("deactivate", this.tab, {"close":true , "ready":true , "activate":true , "deactivate":false });
		}.bind(proto);
	}
	
	proto.list = new EventListenerList();
	
	proto.add = function(name, func){
		return this.list.add(name, func);
	}.bind(proto);
	
	proto.del = function(name){
		return this.list.del(name);
	}.bind(proto);
	
	proto.set = function(name, func){
		return this.list.set(name, func);
	}.bind(proto);
	
	return Object.create(proto);
}