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
var imageCollage,

	collageWidth,

	collageHeight,

	images = [],

	_CPjs = window.CPjs,

	CPjs = {},

	// for better storage of api properties
	Image = function(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
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
	})(),

	// theme objects
	themes = (function() {
		return {
				aqua : {
					name : "aqua",
					canvasStyle : {
						border : 'border : 2px solid rgba(150,150,240,1);',
						boxShadow : 'box-shadow : 2px 2px 8px rgba(20, 80, 200, 0.5);'
					},
					imageStyle : {
						margin : 'margin: 2px 2px;'
					}
				},

				ember : {
					name : "ember",
					canvasStyle : {
						border : 'border : 2px solid rgba(240,150,150, 1);',
						boxShadow : 'box-shadow : 2px 2px 6px rgba(200, 20, 20, 0.5);'
					},
					imageStyle : {
						margin: "margin: 2px 2px;"
					}
				},

				vanilla : {
					name : "vanilla",
					canvasStyle : {
						border : 'border : 1px solid rgba(180,180,180, 1);'
					},
					imageStyle : {
						margin : 'margin: 2px 2px;'
					}
				},

				skylight : {
					name : "skylight",
					canvasStyle : {
						border : 'border : 3px solid rgba(80, 80, 95, 1);'
					},
					imageStyle : {
						margin: 'margin: 2px 2px;'
					}
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
			throw new Error("Collage container must be a DIV");
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
		return {
			_dimensions : function(w, h) {
				imageCollage.style.width = w;
				imageCollage.style.height = h;
			},

			_theme : function() {
				var theme,
					t = imageCollage.getAttribute("CPjs-theme"),
					inheritId = imageCollage.getAttribute("CPjs-inherit-backgroundColor"),
					inheritedBgColor,
					images = imageCollage.getElementsByTagName("img");

					if(inheritId !== null) {
						var inheritedBgColorElement = document.getElementById(inheritId);
						inheritedBgColorElement !== null? inheritedBgColor = inheritedBgColorElement.style.backgroundColor : inheritedBgColor = null;
					}
					

				function setStyles(style) {
					var output = "";
					
					if(style === 'canvasStyle' && inheritedBgColor !== null) {
						output += "background-color : " + inheritedBgColor + ";";
					}

					for(var prop in theme[style]) {
						if(theme[style].hasOwnProperty(prop)) {
							output += theme[style][prop];
						}
					}

					return output;
				}

				if(t !== null) {
					for(var data in themes) {
						if(themes[data].name == t) {
							theme = themes[data];
							break;
						}
					}

					if(theme !== undefined) {
						// apply styles to the collage and images
						imageCollage.setAttribute("style", setStyles('canvasStyle'));

						for(var i = 0; i < images.length ; i++) {
							images[i].setAttribute("style", setStyles('imageStyle'));
						}
					}
				}
			}
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
			collageWidth = Math.floor(w);
			collageHeight = Math.floor(h);

		} else {
			throw new TypeError("width and height must both be numbers");
		}

		return this;
	}
	
	CPjs.start = function() {

		/*******************
		*
		* TEST Object
		*
		********************/
		function testObject() {
			var obj = {
			width : collageWidth,
			height : collageHeight,
			imageCollage : imageCollage,
			images : images
			};

			console.log(obj);
		}

		render._theme();
		render._dimensions(collageWidth, collageHeight);

		testObject();
	}
	
	// return object to window
	window.CPjs = CPjs;

})(window);