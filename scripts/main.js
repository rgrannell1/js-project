if(!Array.prototype.indexOf) {
	// implement indexOf for browser support
	console.log('making indexOf');

	Array.prototype.indexOf = function(val) {
		for(var i = 0; i < this.length; i++) {
			if(val === this[i]) {
				return i;
			} else {
				continue;
			}
		}
		return -1;
	}
}

(function(window) {
"use strict"

// private variables
var canvas,

	width,

	height,

	imagePaths = [],

	options = {},

	_CPjs = window.CPjs,

	CPjs = function() {},

	is = {
		toType: function (val) {
			return ({}).toString.call(val).
			match(/\s([a-zA-Z]+)/)[1].toLowerCase()
		},
		function: function (val) {
			return toType(val) === "function";
		},
		array: function (val) {
			return toType(val) === 'array';
		},
		object: function (val) {
			toType(val) === 'object'
		},
		numeric: function (val) {

			return !isNaN(parseFloat(val)) && isFinite(val);
		}
	};

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
					throw new Error("browser does not support XMLHttpRequest");
				}
			}
		}

		return ajaxObject;
	}

	// gets canvas element return and sets it to the canvas attribute
	function setCanvasPropery(ele) {
		if(document.getElementById(ele) !== null) {
			var element = document.getElementById(ele);
			
			if(element.tagName !== 'DIV') {
				throw new Error("element " + ele + " is not a div");
			}
		}
	}

	// set animation for collage
	function animationSupported(prop) {
		var animations = ["swift", "top", "bottom", "left", "right"];

		if(animations.indexOf(prop) !== -1) {
			return true;

		} else {
			return false;
		}
	}

	// sets style options supplied by the user
	function setCanvasOptions(additionalProps) {

		options.greyscale = additionalProps.greyscale || false;
		options.background = additionalProps.background || 'transparent';

		animationSupported(additionalProps.animation) ? options.animateType = additionalProps.animation : options.animateType = null;
		
	}

	// parse and store the paths to collage image files
	function storeImagePaths(data) {
		if(data.paths) {
			for(var d in data.paths) {
				imagePaths.push(data.paths[d].url);
			}
		}
	}

	// takes in a div id
	CPjs.prototype.id = function(elementId) {
		setCanvasPropery(elementId);
		return this;
	};

	// parse json property with path
	CPjs.prototype.images =	function(json) {
		// create new XMLHttp object to handle request
		// Note: must be relative to html filepath [currently breaks in ie10 and Chrome during local work.... a problem]
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
	CPjs.prototype.dimensions = function(w, h)	{
		// check arguments supplied are Integers
		if(is.numeric(w) && is.numeric(h)) {
			width = Math.floor(w);
			height = Math.floor(h);

		} else {
			throw new Error("width and height must both be numbers");
		}

		return this;
	}
	// takes width and height parameters & optional additonal styling object
	CPjs.prototype.attributes = function(props) {
		setCanvasOptions(props);
		return this;
	};

	CPjs.prototype.start = function() {
		// build object to be used by algorithm
		function buildObject() {
			return {
				width : width,
				height : height,
				options : options,
				images : imagePaths
			};
		}

		console.log(buildObject());
		//call algorithm
	}
	
	window.CPjs = new CPjs();

})(window);

