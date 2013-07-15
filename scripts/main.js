// TODO: find a better way to return the object
(function(window) {
"use strict"

// private variables
var canvas,

	width,

	height,

	imagePaths = [],

	options = {},

	_CPjs = window.CPjs,

	CPjs = {};

	// create new Ajax Object (provide cross browser support)
	function _getXmlHttp() {
		var ajaxObject;

		try {
			ajaxObject = new XMLHttpRequest();
		} catch(e) {
			try {
				ajaxObject = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				try {
					ajaxObject = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(ex) {
					throw "browser does not support XMLHttpRequest";
				}
			}
		}

		return ajaxObject;
	}

	// gets canvas element return and sets it to the canvas attribute
	function setCanvasPropery(ele) {
		if(document.getElementById(ele) !== null) {
			var element = document.getElementById(ele);
			
			if(element.tagName !== 'CANVAS') {
				console.error("element is not a canvas");
			}
		}
	}

	// sets style options supplied by the user
	function setCanvasOptions(additionalProps) {
		options.greyscale = additionalProps.greyscale || false;
		options.crop = additionalProps.crop || false;
		options.background = additionalProps.canvasTransparent || false;
	}

	// parse and store the paths to collage image files
	function storeImagePaths(data) {
		if(data.paths) {
			for(var d in data.paths) {
				imagePaths.push(data.paths[d].url);
			}
		}
	}

	// takes in a canvas id
	CPjs.canvas =	function(canvasId) {
		setCanvasPropery(canvasId);
		return this;
	};

	// parse json property with path
	CPjs.data =	function(json) {
		// create new XMLHttp object to handle request
		// Note: must be relative to html filepath
		var request = _getXmlHttp();
		request.open('GET', json.toString(), false);
		request.send();
		
		if(request) {
			var response = JSON.parse(request.responseText)

			if(response) {
				storeImagePaths(response);
			}
		}

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
	CPjs.attributes = function(props) {
		setCanvasOptions(props);

		return this;
	};

	// begin algorithm and render onto canvas
	CPjs.start = function() {
		console.log(this);
	}
	
	// return globally scoped CPjs object
	window.CPjs = CPjs;

})(window);

