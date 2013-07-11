(function(window) {
	"use strict"

	var properties = {},

		canvas = "",

		theme = "default",

		themes = [],

		// override global object if it already exists
		_CPjs = window.CPjs,

		CPjs = {},

		setCanvas = function(ele, obj) {
			canvas = document.getElementById(ele);
		};

	CPjs.canvas = function(canvasId) {
		setCanvas(canvasId);
	};

	CPjs.data = function(json) {
		// parse json property with path
	};

	CPjs.style = function(props) {
		if(options.width && options.height) {
			properties.width = props.width;
			properties.height = props.height;

			// now parse options 
		} else {
			throw "width and height must be supplied";
		}
	};

	CPjs.start = function() {
		// call algorithm
		// render pretty
	};
	
	console.log(CPjs);
	window.CPjs = CPjs;
})(window);

