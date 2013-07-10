(function(window) {
	"use strict"

	var size = {},

		canvas = "",

		theme = "default",

		// override global object if it already exists
		_CPjs = window.CPjs,

		CPjs = {},

		setCanvas = function(ele, obj) {
			if(document.getElementById(ele) !== undefined) {
				canvas = document.getElementById(ele);
				size.width = obj.width;
				size.height = obj.height;
			} else {
				throw new Error();
			}
		};

	CPjs.canvas = function(canvasId, dimensions) {
		setCanvas(canvasId, dimensions);
	};

	CPjs.data = function(json) {
		// parse json
	};

	CPjs.theme = function(theme) {
		// set theme on layout
		this.theme = theme;
	};

	CPjs.start = function() {
		// call algorithm
		// render pretty
	};
	
	window.CPjs = CPjs;
})(window);

