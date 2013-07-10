(function() {
	"use strict"

	var size = {},
	canvas = "",
	theme = "default";

	// main Object
	window.Col = {};

	var setCanvas = function(ele, obj) {
		if(document.getElementById(ele) !== undefined) {
			canvas = document.getElementById(ele);
			size.width = obj.width;
			size.height = obj.height;
		} else {
			throw new Error();
		}
	};

	Col.canvas = function(canvasId, dimensions) {
		setCanvas(canvasId, dimensions);
	};

	Col.data = function(json) {
		// parse json
	};

	Col.theme = function(theme) {
		// set theme on layout
		this.theme = theme;
	};

	Col.start = function() {
		// call algorithm
		// render pretty
	};
	
	console.log(Col);
	return Col;
})();

