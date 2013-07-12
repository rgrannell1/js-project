// TODO: find a better way to return the object
(function(window) {
"use strict"

// private variables
var canvas = "",

	width,

	height,

	options = {},

	// override global object if it already exists and create fresh namespace object
	_CPjs = window.CPjs,

	CPjs = {};

	// gets canvas element return and sets it to the canvas attribute
	function setCanvasPropery(ele) {
		if(document.getElementById(ele) !== null) {
			var element = document.getElementById(ele);
			
			if(element.tagName === 'CANVAS') {
				console.log("success");
			}
		}
	};

	// sets style options supplied by the user
	function setCanvasOptions(additionalProps) {
		options.greyscale = additionalProps.greyscale || false;
		options.crop = additionalProps.crop || false;
		options.background = additionalProps.canvasTransparent || false;
	};

	// takes in a canvas id
	CPjs.canvas =	function(canvasId) {
		setCanvasPropery(canvasId);

		return this;
	};

	// parse json property with path
	CPjs.data =	function(json) {
		return this;
	};

	// take in canvas dimensions to be used by algorithm
	CPjs.dimensions	=	function(w, h)	{
		// check arguments supplied are Integers
		if(typeof h === "number" && typeof w === "number" 
			&&	h%1 == 0 && w%1 == 0) {
			width = w;
			height = h;
		}else {
			console.error("Integers must be supplied");
		}

		return this;
	}
	// takes width and height parameters & optional additonal styling object
	CPjs.attributes =	function(props) {
		setCanvasOptions(props);

		return this;
	};

	// begin algorithm and render onto canvas
	CPjs.start =	function() {
		console.log(this);
	}
	
	window.CPjs = CPjs;

})(window);

