const widgets = require("widget");
const tabs = require("tabs");
var data = require("self").data;

var widget = widgets.Widget({
	id: "tumblr-oauth",
	label: "Tumblr Website",
	contentURL: data.url("icons/tumblr16.png"),
	onClick: function(){
		
	}
});