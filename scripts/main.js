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

	_plaid = window.Plaid,

	plaid = {},

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

	// theme objects that can be refrenced by the user
	// the idea is that these themes are easily editable to users so simple themes can be easily created
	themes = (function() {
		return {
				aqua : {
					name : "aqua",
					canvasStyle : {
						padding : "padding : 4px;",
						border : 'border : 2px solid rgba(150,150,240,1);',
						boxShadow : 'box-shadow : 2px 2px 8px rgba(20, 80, 200, 0.5);'
					},
					imageStyle : {
						padding : 'padding: 2px 2px;'
					},

					imageEvents : {
						onclick : function(evt) {
							// open a dialog
						},

						onmouseover : function(evt) {

							evt.currentTarget.style.transition = "yellow";
						},

						onmouseout : function(evt) {
							evt.currentTarget.style.backgroundColor = "white";
						}
					}
				},

				ember : {
					name : "ember",
					canvasStyle : {
						padding : "padding : 4px;",
						border : 'border : 2px solid rgba(240,150,150, 1);',
						boxShadow : 'box-shadow : 2px 2px 6px rgba(200, 20, 20, 0.5);'
					},
					imageStyle : {
						padding: "padding: 2px 2px;"
					},
					
					imageEvents : {
						onclick : function(evt) {
							// open a dialog
							
						},

						onmouseover : function(evt) {
							//evt.currentTarget.style.backgroundColor = "yellow";
						},

						onmouseout : function(evt) {
							//evt.currentTarget.style.backgroundColor = "white";
						}
					}
				},

				vanilla : {
					name : "vanilla",
					canvasStyle : {
						padding : "padding : 4px;",
						border : 'border : 1px solid rgba(180,180,180, 1);'
					},

					imageStyle : {
						padding : 'padding: 2px 2px;'
					},

					imageEvents : {
						onclick : function(evt) {
							// open a dialog
							
						},

						onmouseover : function(evt) {
							evt.currentTarget.style.backgroundColor = "yellow";
						},

						onmouseout : function(evt) {
							evt.currentTarget.style.backgroundColor = "white";
						}
					}
				},

				skylight : {
					name : "skylight",
					canvasStyle : {
						padding : "padding : 4px;",
						border : 'border : 3px solid rgba(80, 80, 95, 1);'
					},

					imageStyle : {
						padding: 'padding: 2px 2px;'
					},

					imageEvents : {
						onclick : function(evt) {
							dialog.create();
							dialog.render();
						},

						onmouseover : function(evt) {
							evt.currentTarget.style.transition = "1s ease";
							evt.currentTarget.style.webkitTransition = "1s ease";

							evt.currentTarget.style.transform = "scale(1.02)";
							evt.currentTarget.style.webkitTransform = "scale(1.02)";
						},

						onmouseout : function(evt) {
							evt.currentTarget.style.transform = "scale(1)";
							evt.currentTarget.style.webkitTransform = "scale(1)";
						}
					}
				}
			};
	})();
	
	// error handling 
	function UsefulError(description) {
		this.description = description;
	}

	// for better storage of image properties
	function Image(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
	}

	// gets canvas element return and sets it to the canvas attribute
	function _imageCollage(e) {
		var element = document.getElementById(e);

		if(element !== null && element.tagName === 'DIV') {
				imageCollage = element;
		} else {
			throw new UsefulError("Collage container must be a DIV");
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


	var render = (function() {
		// set background color of collage div to the same as its parent
		// if CPjs-canvas-transparent is set to true
		var collageHeight,
			collageWidth;

		return {
			
				_dimensions : function(w, h) {
					collageWidth = w;
					collageHeight = h;
				},

				_theme : function() {
					var theme,
						t,
						inheritId,
						inheritedBgColor,
						images;

					var setStyles = function(style) {
						var output = "";
						
						if(style === 'canvasStyle' && inheritedBgColor !== null) {
							output += "background-color : " + inheritedBgColor + ";";
						}

						for(var prop in theme[style]) {
							if(theme[style].hasOwnProperty(prop)) {
								output += theme[style][prop];
							}
						}

						// add oveflow on images (probably not needed in the future)
						output += "overflow: hidden;";

						return output;
					}

					t = imageCollage.getAttribute("plaid-theme")
					inheritId = imageCollage.getAttribute("plaid-inherit-backgroundColor"),
					inheritedBgColor,
					images = imageCollage.getElementsByTagName("img");

					if(inheritId !== null) {
						var inheritedBgColorElement = document.getElementById(inheritId);
						inheritedBgColorElement !== null? inheritedBgColor = inheritedBgColorElement.style.backgroundColor : inheritedBgColor = null;
					}

					if(t !== null) {
						
						for(var data in themes) {
							if(themes[data].name === t) {
								theme = themes[data];
								break;
							}
						}

						if(theme !== undefined) {
							// apply styles to the collage and images
							imageCollage.setAttribute("style", setStyles('canvasStyle'));
							
							for(var i = 0; i < images.length ; i++) {
								images[i].setAttribute("style", setStyles('imageStyle'));
								
								for(var evt in theme.imageEvents) {
									images[i][evt.toString()] = theme.imageEvents[evt.toString()];
								}
								
							}
						}
					}
					
				}
			};	
	})();

	function API(colId) {
		this.id = colId;
		this.width;
		this.height;

		// tale in collage width and height
		this.dimensions = function(w, h) {
			if(is.numeric(w) && is.numeric(h)) {
				var width = Math.floor(w);
				var height = Math.floor(h);

				render._dimensions(width, height)

			} else {
					throw new UsefulError("width and height must both be numbers");
			}

			return this;
		};

		// call algorithm and render
		this.start = function() {
			var theBackend = function(config, callback) {
				console.log(config);
				callback({});
			};

			try {
				_imageCollage(this.id);
				storeImages();

				var config = {
					images : images
				};

				theBackend(config, function(val) {
					render._theme(val);
				});

			} catch (e) {
				console.error(e.description);
			}
		};

	}

	// return object to window
	var plaid = function(colId) {
		return new API(colId);
	};

	window.plaid = plaid;

})(window);