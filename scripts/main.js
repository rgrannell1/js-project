// hasOwnProperty
if(!Array.prototype.indexOf) {
	// implement indexOf for browser support
	
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
var imageCanvas,

	width,

	height,

	images = [],

	theme = "none",

	_CPjs = window.CPjs,

	CPjs = function() {},

	Image = function(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
	},

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

	// gets canvas element return and sets it to the canvas attribute
	function _imageCanvas(e) {
		var element = document.getElementById(e);

		if(element !== null && element.tagName === 'DIV') {
			imageCanvas = element;
		}
		else {
			var ele = document.createElement('div');
			ele.setAttribute('id', e.toString());

			document.body.appendChild(ele);
			imageCanvas = document.getElementById(e.toString());
		}
	}

	// callback 
	// sets style options supplied by the user ( not sure exactly what options woudl be nice?)
	function _canvasTheme(t) {
		var animations = ["swift", "vanilla", "focusing"];
		// set animation for collage
		function animationSupported(prop) {
			/*=====================================================
			* 1) swift will do quick, flashy transitions upon opening
			* 2) vanilla is just the dault animation style, nothing fancy
			* 3) focusing uses css3 transitions 
			*=======================================================*/
			if(animations.indexOf(prop) !== -1) {
				return true;

			} else {
				return false;
			}
		}

		if(animationSupported(t)) {
			theme = t
		}		
	}

	// get images suppled by the user
	function _images() {
		// get elements within element supplied by the client
		var imgs = imageCanvas.getElementsByTagName('img');

		for(var i = 0; i< imgs.length; i++) {
			var src = imgs[i].getAttribute('src'),
				w = imgs[i].width,
				h = imgs[i].height;

			images.push(new Image(src, w, h));
		}
	};

	// takes in a div id
	CPjs.prototype.id = function(elementId) {
		_imageCanvas(elementId);
		_images();

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
	CPjs.prototype.theme = function(theme) {
		_canvasTheme(theme);
		return this;
	};

	CPjs.prototype.start = function() {
		// build object to be used by algorithm
		function buildCollage() {
			return {
				canvas : imageCanvas,
				width : width,
				height : height,
				theme : theme,
				images : images
			};
		}

		console.log(buildCollage());
	}
	
	window.CPjs = new CPjs();

})(window);