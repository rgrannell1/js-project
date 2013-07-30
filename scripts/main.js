
(function(window) {
"use strict";
	
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

// DOM shothand methods
Object.prototype.getAttr = function(ref) {
	return this.getAttribute(ref.toString());
};

Object.prototype.getDecendents = function(ref) {
	var eles = this.getElementsByTagName(ref.toString());

	if(eles.length === 1) {
		return eles[0];
	} else {
		return eles;
	}
};


Object.prototype.styling = function(prop, val) {
	this.style[prop.toString()] = val.toString();
	return this;
};

// sets styles on object
Object.prototype.setStyle = function(style) {
	var output = "";
	var theme = themes[style.toString()];
	var styleType;

	if(this.tagName === 'DIV') {
		styleType = 'canvasStyle';
	} else {
		styleType = 'imageStyle';
	} 

	for(var prop in theme[styleType]) {
		if(theme[styleType].hasOwnProperty(prop)) {
			this.style[prop] += theme[styleType][prop];
		}
	}
};

Object.prototype.setHeight = function(h) {
	this.style.height = h;
}

Object.prototype.setWidth = function(w) {
	this.style.width = w;
}

// theme objects that can be refrenced by the user
// the idea is that these themes are easily editable to users so simple themes can be easily created
	var themes = {
		aqua : {
			name : "aqua",
			canvasStyle : {
				padding : "4px",
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
				padding : "4px",
				border : '3px solid rgba(80, 80, 95, 1)'
			},

			imageStyle : {
				padding: '2px 2px'
			},

			imageEvents : {
				onclick : function(evt) {
					var img = evt.currentTarget;

					getOriginalImageSize(evt.currentTarget.src, function(w, h) {

						var lightBox = new LightBox(img, {widthO : w, heightO : h});
						lightBox.create();
					});
					
				},

				onmouseover : function(evt) {
					evt.currentTarget.style.transition = "1s ease";
					evt.currentTarget.style.webkitTransition = "1s ease";

					evt.currentTarget.style.transform = "scale(1.01)";
					evt.currentTarget.style.webkitTransform = "scale(1.01)";
				},

				onmouseout : function(evt) {
					evt.currentTarget.style.transform = "scale(1)";
					evt.currentTarget.style.webkitTransform = "scale(1)";
				}
			}
		}
	};
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
	})();

	//util function to get original width and height of an image
	var getOriginalImageSize = function(src, callback) {
		var image = new Image();
		
		image.onload = function() {
			callback( image.width, image.height );
			image.onload = image.onerror = null;
		};

		image.onerror = function(){
			console.log("failed");
		};

		image.src = src;
		console.log(image);
	};

	// create sepeate image for lightbox with new styles
	function LightBox(target, dims) {
		// work in progress!!!
		this.image = target;
		this.caption = target.getAttribute("plaid-caption") || null;

		this.width = dims.widthO;
		this.height = dims.heightO;

		this.create = function() {
			var body;

			var windowHeight = window.innerHeight,
				windowWidth = window.innerWidth;

			var imgHeight,
				imgWidth;
				
			this.domNode = document.createElement("div");

			this.domNode
				.styling("border", "5px solid #ccc")
				.styling("background-color", "#222")
				.styling("position", "absolute")
				.styling("width", windowWidth - (windowWidth*.10))
				.styling("height", windowHeight - (windowHeight*.10))
				.styling("top", 0)
				.styling("left", 0)
			
			body = document.getDecendents('body');

			this.domNode.appendChild(this.image);
			body.appendChild(this.domNode);
		}
	}

	// for better storage of image properties
	function PlaidImage(src, w, h) {
		this.source = src;
		this.width = w,
		this.height = h;
	}

	// get images suppled by the user
	var storeImages = function(id) {
		// get elements within element supplied by the client
		var imgs = id.getElementsByTagName('img'),
			images = [];

		for(var i = 0; i< imgs.length; i++) {
			var src = imgs[i],
				w = imgs[i].width,
				h = imgs[i].height;

			images.push(new PlaidImage(src, w, h));
		}

		return images;
	};

	var render = function(self) {
		var theme,
			selectedTheme,
			inheritId,
			inheritedBgColor,
			images;

		// dom variables
		var collageEle,
			imagesObj;

		// get collage element by id 
		collageEle = _imageCollage(self.id)

		// get array of Image objects
		imagesObj = storeImages(collageEle);

		console.log(imagesObj);

		// get ref to image object from img element for lightbox effects
		var _imageRef = function(ref) {
			// TODO:
		};

		collageEle.setWidth(self.width);
		collageEle.setHeight(self.height);

		selectedTheme = collageEle.getAttr("plaid-theme")
		inheritId = collageEle.getAttr("plaid-inherit-backgroundColor");

		if(inheritId !== null) {
			var inheritedBgColorElement = document.getElementById(inheritId);
			inheritedBgColorElement !== null? inheritedBgColor = inheritedBgColorElement.style.backgroundColor : inheritedBgColor = null;
		}

		if(selectedTheme !== null) {
			
			for(var data in themes) {
				if(themes[data].name === selectedTheme) {
					theme = themes[data];
					break;
				}
			}

			if(theme !== undefined) {
				// apply styles to the collage and images
				var self = this;
				collageEle.setStyle('skylight');
				
				for(var i = 0; i < imagesObj.length ; i++) {
					//_imageRef(images[0]);
					console.log(imagesObj[i].source);

					var img = imagesObj[i].source;

					img.setStyle('skylight');
					
					for(var evt in theme.imageEvents) {
						imagesObj[i].source[evt.toString()] = theme.imageEvents[evt.toString()];
					}
					
				}
			}
		}

		console.log(collageEle);
	};

	var theBackend = function(config, callback) {
		callback([{},{},{}]);
	};

	// gets canvas element return and sets it to the canvas attribute
	var _imageCollage = function(e) {
		var ele = document.getElementById(e);
		return ele;
	};

	function Plaid(ele, dim) {
		this.id = ele;
		this.width = dim.width || 1000;
		this.height = dim.height || 1000;

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
						render(self);
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

	var pl = function(id, dimensions) {
		return new Plaid(id, dimensions)
	}

	// return object to window
	window.plaid = pl;

})(window);