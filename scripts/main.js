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

	// for better type checking
	var is = (function() {
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
	themes = {
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
	
	// for better storage of image properties
	function Image(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
	}

	// gets canvas element return and sets it to the canvas attribute
	function _imageCollage(e) {
		return document.getElementById(e);
	}

	// get images suppled by the user
	function storeImages(id) {
		// get elements within element supplied by the client
		var imgs = id.getElementsByTagName('img'),
			images = [];

		for(var i = 0; i< imgs.length; i++) {
			var src = imgs[i].getAttribute('src'),
				w = imgs[i].width,
				h = imgs[i].height;

			images.push(new Image(src, w, h));
		}

		return images;
	};

	function Render() {

		this.theme = function() {
			var id = this.id;

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

			t = id.getAttribute("plaid-theme")
			inheritId = id.getAttribute("plaid-inherit-backgroundColor"),
			inheritedBgColor,
			images = id.getElementsByTagName("img");

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
					id.setAttribute("style", setStyles('canvasStyle'));
					
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

	var theBackend = function(config, callback) {
				console.log(config);
				callback([{},{},{}]);
	};

		
	function Plaid() {
		this.id;
		this.width;
		this.height;
		this.images;
	}

	Plaid.prototype.id = function(idEle) {
		this.id = _imageCollage(idEle);

		return this;
	};

	Plaid.prototype.dimensions = function(w, h) {
		this.width = w;
		this.height = h;

		return this;
	};

	Plaid.prototype.start = function() {
		var self = this;
		var render = new Render();

		try {
			if(this.id !== null || this.id.tagName === 'DIV') {
				this.images = storeImages(this.id);

				var config = {
					width: this.width,
					height : this.height,
					images : this.images
				};

				theBackend(config, function(val) {
					//test
					console.log(config);

					render.theme.call(self);
				});

			} else {
				throw new TypeError("element used for collage must be a div");
			}
		} catch (e) {
			console.error(e);
		}
	};

	var _plaid = window.plaid;

	// return object to window
	window.plaid =  new Plaid();

})(window);