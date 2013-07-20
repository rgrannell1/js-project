(function() {
"use strict"
})();

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
// private variables
var imageCanvas,

	width,

	height,

	images = [],

	theme = null,

	_CPjs = window.CPjs,

	CPjs = {},

	// for better storage of api properties
	Image = function(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
	},

	Animation = function(name, options) {
		this.name = name;
		this.backgroundColor = options.backgroundColor;
		this.border = options.imageBorder;
		this.transition = options.imageTransition;
		this.spawn = options.spawn;

		// etc.....
	},

	// for better type checking
	is = (function() {
		return {
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
	})();

	// gets canvas element return and sets it to the canvas attribute
	function _imageCanvas(e) {
		var element = document.getElementById(e);

		if(element !== null && element.tagName === 'DIV') {
			imageCanvas = element;
		}
		else {
			// TODO: fix
			var ele = document.createElement('div');
			ele.setAttribute('id', e.toString());
			document.body.appendChild(ele);
			imageCanvas = document.getElementById(e.toString());
		}
	}

	// set canvas theme
	function _canvasTheme(t) {
		var arr = [];

		(function() {
			var swift = new Animation('swift', { color : "#ccc" }),
				vanilla = new Animation('vanilla', { color : "transparent"});
			
			arr.push(swift);
			arr.push(vanilla);	
		})();

		var t = imageCanvas.getAttribute("CPjsTheme");
		
		if(t !== null) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].name == t.toString()) {
					theme = arr[i];
					break;
				}
			}
		}
	}

	// get images suppled by the user
	function storeImages() {
		// get elements within element supplied by the client
		var imgs = imageCanvas.getElementsByTagName('img');

		for(var i = 0; i< imgs.length; i++) {
			var src = imgs[i].getAttribute('src'),
				w = imgs[i].width,
				h = imgs[i].height;

			images.push(new Image(src, w, h));
		}
	};


	/**************************
	*
	* Bulk of the front end work
	* function will layout the images on the collage all nice and pretty
	*
	***************************/
	function render() {

	}

	// takes in a div id
	CPjs.id = function(elementId) {
		_imageCanvas(elementId);
		storeImages();

		return this;
	};

	// take in canvas dimensions to be used by algorithm
	CPjs.dimensions = function(w, h)	{
		// check arguments supplied are Integers
		if(is.numeric(w) && is.numeric(h)) {
			width = Math.floor(w);
			height = Math.floor(h);

		} else {
			throw new Error("width and height must both be numbers");
		}

		return this;
	}
	
	CPjs.start = function() {

		_canvasTheme();
		// call algorithm() back end
		var obj = {
			theme : theme,
			width : width,
			height : height,
			imageCanvas : imageCanvas,
			images : images
		};
		console.log(obj);

		// render the collage visually after alogrithm
		render();
	}
	
	window.CPjs = CPjs;

})(window);