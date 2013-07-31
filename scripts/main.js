
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

	function Plaid() {

		this.on = function(ele) {
			this.id = ele;
			return this;
		};

		this.dim = function(w, h) {
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

	// DOM shothand methods
	Plaid.prototype.getAttr = function(node, ref) {
		return node.getAttribute(ref.toString());
	};

	Plaid.prototype.getDecendents = function(node, ref) {
		var eles = node.getElementsByTagName(ref.toString());

		if(eles.length === 1) {
			return eles[0];
		} else {
			return eles;
		}
	};


	Plaid.prototype.styling = function(node, prop, val) {
		node.style[prop.toString()] = val.toString();
		return this;
	};

	// sets styles on object
	Plaid.prototype.setStyle = function(node, style) {
		var styleType;

		if(node.tagName === 'DIV') {
			styleType = 'canvasStyle';
		} else {
			styleType = 'imageStyle';
		} 

		for(var prop in style[styleType]) {
			if(style[styleType].hasOwnProperty(prop)) {
				node.style[prop] += style[styleType][prop];
			}
		}
	};

	Plaid.prototype.setHeight = function(node, h) {
		node.style.height = h;
	}

	Plaid.prototype.setWidth = function(node, w) {
		node.style.width = w;
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

					getOriginalImage(img, function(imageO) {
						var lightBox = new LightBox(imageO);
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
	var getOriginalImage = function(img, callback) {
		var image = new Image();
		
		image.onload = function() {
			callback(image);
			image.onload = image.onerror = null;
		};

		image.onerror = function(){
			console.log("failed");
		};

		image.src = img.src;
		image.setAttribute("caption", img.getAttribute("plaidcaption"));	
	};

	// create sepeate image for lightbox with new styles
	function LightBox(target) {
		// work in progress!!!
		this.image = target;
		this.caption = target.getAttribute("caption") || null;

		console.log(this.caption);
	}

	LightBox.prototype.create = function() {
		var body;

		var windowHeight = window.innerHeight,
			windowWidth = window.innerWidth;
			
		this.domNode = document.createElement("div");

		plaid.styling(this.domNode, "border", "5px solid #ccc")
			.styling(this.domNode, "background-color", "#222")
			.styling(this.domNode, "position", "absolute")
			.styling(this.domNode, "width", (function() {
				return Math.floor(target.width + (target.width*.05));
			})())
			.styling(this.domNode, "height", (function() {
				return Math.floor(target.height + (target.height*.05));
			})())
			.styling(this.domNode, "top", (function() {
				return (windowHeight/2) - target.height;
			})())
			.styling(this.domNode, "left", (function() {
				return (windowWidth/2) - target.width;
			})())
		
		body = plaid.getDecendents(document, 'body');

		this.domNode.appendChild(this.image);
		body.appendChild(this.domNode);
	};

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
		collageEle = _imageCollage(self.id);

		plaid.setWidth(collageEle, self.width);
		plaid.setHeight(collageEle, self.height);

		// get array of Image objects
		imagesObj = storeImages(collageEle);

		selectedTheme = plaid.getAttr(collageEle, "plaidtheme")
		inheritId = plaid.getAttr(collageEle, "plaidinheritbackgroundColor");

		if(inheritId !== null) {
			var inheritedBgColorElement = document.getElementById(inheritId);
			inheritedBgColorElement !== null? inheritedBgColor = inheritedBgColorElement.style.backgroundColor : inheritedBgColor = null;
		}

		if(selectedTheme !== null) {
			
			for(var t in themes) {
				if(themes[t].name === selectedTheme) {
					theme = themes[t];
					break;
				}
			}

			if(theme !== undefined) {
				// apply styles to the collage and images
				var self = this;
				plaid.setStyle(collageEle, theme);
				
				for(var i = 0; i < imagesObj.length ; i++) {
					//_imageRef(images[0]);
					var img = imagesObj[i].source;

					plaid.setStyle(img, theme);
					
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

	// return object to window
	var _plaid = window.plaid;

	/*var plaid = function(id, dimensions) {
		return new Plaid(id, dimensions)
	};*/

	var plaid = new Plaid();
	console.log(plaid);
	window.plaid = plaid;

})(window);