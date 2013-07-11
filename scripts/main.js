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

	CPjs.style = function(width, height, props) {
		properties.width = width;
		properties.height = height;

		properties.options.greyscale = props.greyscale || false;
		properties.options.curved = props.curved || false;
		properties.options.background = props.background || null;

		// continue....

	};

	CPjs.start = function() {
		// call algorithm
		// render pretty
	};
	
	window.CPjs = CPjs;
})(window);

