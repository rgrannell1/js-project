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
var imageCollage,

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
	function _imageCollage(e) {
		var element = document.getElementById(e);

		if(element !== null && element.tagName === 'DIV') {
			imageCollage = element;
		}
		else {
			// TODO: fix
			var ele = document.createElement('div');
			ele.setAttribute('id', e.toString());
			document.body.appendChild(ele);
			imageCollage = document.getElementById(e.toString());
		}
	}

	// set canvas theme
	function _collageTheme(t) {
		var arr = [];

		(function() {
			var swift = new Animation('swift', { color: "" }),
				vanilla = new Animation('vanilla', { color : "transparent"});
			
			arr.push(swift);
			arr.push(vanilla);	
		})();

		var t = imageCollage.getAttribute("CPjs-theme");
		
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
		var imgs = imageCollage.getElementsByTagName('img');

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
	var render = (function() {
		// set background color of collage div to the same as its parent
		// if CPjs-canvas-transparent is set to true	
		var _backgroundColor = function() {
			var isTransparent = imageCollage.getAttribute("CPjs-canvas-transparent");
			if(isTransparent !== null && isTransparent === "true") {
				imageCollage.style['backgroundColor'] = imageCollage.parentNode.style['backgroundColor'];
			}
		};

		return {
			isTransparent : _backgroundColor
		};
	})();

	// div id to be used as the collage element
	CPjs.id = function(elementId) {
		_imageCollage(elementId);
		storeImages();

		return this;
	};

	// collage dimensions to be used by algorithm
	CPjs.dimensions = function(w, h) {
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

		// set the theme on the collage
		_collageTheme();

		/*******************
		*
		* TEST Object
		*
		********************/
		var obj = {
			theme : theme,
			width : width,
			height : height,
			imageCollage : imageCollage,
			images : images
		};
		console.log(obj);

		// render the collage visually after alogrithm
		render.isTransparent();
	}
	
	window.CPjs = CPjs;

})(window);