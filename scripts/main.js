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
					var lightBox = new LightBox(evt.currentTarget);
					lightBox.create();
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

	// create sepeate image for lightbox with new styles
	function LightBox(target) {
		this.image = target;
		this.caption = target.getAttribute("plaid-caption") || null;

		this.create = function() {
			var body;

			var imgHeight = this.image.height,
				imgWidth = this.image.width;

			var windowHeight = window.innerHeight,
				windowWidth = window.innerWidth;

			var lb = document.createElement("div");

			var fixToLightbox = function() {
				// fit image onto lightbox by computing aspect ratio
			};

			lb.setAttribute("style", "" +
				"border: 1px solid #222;" +
				"background-color: #111;" +
				"position: absolute;" +
				"width:" + imgWidth + ";" +
				"height:" + imgHeight + ";" +
				"top:" + (windowHeight/2) + "; left:" + (windowWidth/2)  + ";");
			

			body = document.getElementsByTagName('body')[0];
			lb.appendChild(this.image);
			body.appendChild(lb);
		}
	}

	// for better storage of image properties
	function Image(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
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

	function Render(colId) {
		this.element = colId;
		
		this.start = function() {
			var theme,
				t,
				inheritId,
				inheritedBgColor,
				images;
			var collageEle,
				imagesObj;

			// get collage element by id 
			collageEle = _imageCollage(this.element)
			// get array of Image objects
			imagesObj = storeImages(collageEle);

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

			// get ref to image object from img element for lightbox effects
			var _imageRef = function(ref) {
				// TODO:
				console.log(imagesObj);
			};


			t = collageEle.getAttribute("plaid-theme")
			inheritId = collageEle.getAttribute("plaid-inherit-backgroundColor"),
			inheritedBgColor,
			images = collageEle.getElementsByTagName("img");

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
					var self = this;
					collageEle.setAttribute("style", setStyles('canvasStyle'));
					
					for(var i = 0; i < images.length ; i++) {
						_imageRef(images[0]);
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

	// gets canvas element return and sets it to the canvas attribute
	var _imageCollage = function(e) {
		var ele = document.getElementById(e);

		ele.style.display = 'none';

		return ele;
	};

	function Plaid(ele) {
		this.id = ele;

		this.dimensions = function(w, h) {
			this.width = w;
			this.height = h;
			return this;
		};

		this.start = function() {
			var self = this;
			try {
				if(this.id !== null || this.id.tagName === 'DIV') {
					var config = {
						width: this.width,
						height : this.height,
						images : this.images
					};

					theBackend(config, function(val) {
						//test
						var render = new Render(self.id);
						render.start();
					});

				} else {
					throw new TypeError("element used for collage must be a DIV");
				}
			} catch (e) {
				console.error(e);
			}
		};
	}

	var _plaid = window.plaid;

	var pl = function(id) {
		return new Plaid(id)
	}

	// return object to window
	window.plaid = pl;

})(window);