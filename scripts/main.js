
// TODO: 
// 1. fix issue in firefox where lightbox background-color is never set
// 2. make it so only one lightbox can be oopen at a time
(function () {
	"use strict";
})()

(function(window) {
	var support = (function() {
		return {
			indexOf : function(val) {
				for(var i = 0; i < this.length; i++) {
					if(val === this[i]) {
						return i;
					} else {
						continue;
					}
				}
				return -1;
			}
		};
	})();

	var domUtil = (function() {
		var _style = function(node, props) {
			for(var prop in props) {
				node.style[prop.toString()] = props[prop.toString()];
			}
		};

		return {
			create : function(ele, id, props) {
				var ele = document.createElement(ele);
				ele.id = id;
				ele.style = _style(ele, props);

				return ele;
			},

			byId : function(ele) {
				return document.getElementById(ele);
			},

			attr : function(node, ref) {
				return node.getAttribute(ref.toString());
			},

			decendents : function(node, ref) {
				var eles = node.getElementsByTagName(ref.toString());

				if(eles.length === 1) {
					return eles[0];
				} else {
					return eles;
				}
			},

			style : function(node, props) {
				_style(node, props);
			},

			remove : function(node) {
				var elem = document.getElementById(node);
				elem.parentNode.removeChild(elem);
			},

			_height : function(node, h) {
				node.style.height = h;
			},

			_width : function(node, w) {
				node.style.width = w;
			},

			_child : function(parent, child) {
				parent.appendChild(child);
			},
		};
	})();

	var is = (function () {
	// tests for certain types of values (functions, objects)
	
		return {
			toType: function (val) {
				// found online, better than typeof at determining
				// the class of an object

				return ({}).toString.call(val).
					match(/\s([a-zA-Z]+)/)[1].toLowerCase()
			},
			closure: function (val) {
				return this.toType(val) === "function";
			},
			array: function (val) {
				return this.toType(val) === 'array';
			},
			object: function (val) {
				return this.toType(val) === 'object';
			},
			undefn: function (val) {
				return this.toType(val) === 'undefined';
			},
			string: function (val) {
				return this.toType(val) === 'string';
			},
			number: function (val) {
				return this.toType(val) === 'number';
			},
			logical: function (val) {
				return this.toType(val) === 'boolean';
			},
			numeric: function (val) {
				return !isNaN(parseFloat(val)) && isFinite(val);
			},
			nan: function (val) {
				return val !== val;
			}
		};
	})();

	// theme objects that can be refrenced by the user
	// the idea is that these themes are easily editable to users so simple themes can be easily created
	var themes = (function() {
		//util function to get original width and height of an image
		var getOriginalImage = function(img, callback) {
			var image = new Image();
			
			image.onload = function() {
				callback(image);
				image.onload = image.onerror = null;
			};

			image.onerror = function(){
				console.error("failed to retreive image");
			};

			image.src = img.src;
			image.setAttribute("caption", img.getAttribute("plaidcaption"));	
		};

		return{

			aqua : {
				name : "aqua",
				canvasStyle : {
				
				},
				imageStyle : {
					padding : 'padding: 2px 2px;'
				},

				imageEvents : {
					onclick : function(evt) {
						getOriginalImage(evt.currentTarget, function(imageO) {
							Box(imageO);
						});
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
					
				},
				imageStyle : {
					padding: "padding: 2px 2px;"
				},
				
				imageEvents : {
					onclick : function(evt) {
						var img = evt.currentTarget;

						getOriginalImage(img, function(imageO) {
							Box(imageO);
						});
						
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
					
				},

				imageStyle : {
					padding : 'padding: 2px 2px;'
				},

				imageEvents : {
					onclick : function(evt) {
						var img = evt.currentTarget;

						getOriginalImage(img, function(imageO) {
							Box(imageO);
						});
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
					
				},

				imageStyle : {
					padding: '2px 2px'
				},

				imageEvents : {
					onclick : function(evt) {
						var img = evt.currentTarget;

						getOriginalImage(img, function(imageO) {
							Box(imageO);
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
	})();

	// create sepeate image for lightbox with new styles
	var Box = (function() {
		// hold the next unique id to be used
		var lightBox_id = 0;
		
		// gets windows width and height dimensions
		var windowDims = (function() {
			var dims = {};

			if(typeof( window.innerWidth ) == 'number') {
				dims.width = window.innerWidth;
				dims.height = window.innerHeight;
			} else {
				dims.width = document.documentElement.clientWidth;
				dims.height = document.documentElement.clientHeight;
			}

			return dims;
		})();

		// check if a caption had been supplied with the image
		var caption = function(lb) {
			return domUtil.attr(lb, "caption") || null;
		};

		return function(target) {
			var body;
			var domNode;
			var capt;
			var s;

			capt = caption(target);
			
			/* to finish */
			s = {
				"border" : "2px solid #ccc",
				"position" : "absolute",
				"width" : Math.floor(target.width),
				"height" : Math.floor(target.height),
				"top" : (windowDims.height/2) - target.height,
				"left" : (windowDims.width/2) - target.width
			};
			domNode = domUtil.create("div", "plaid_lb_" + (++lightBox_id), s);
			body = domUtil.decendents(document, 'body');

			// add click event to remove the node when clicked
			domNode.onclick = function(evt) {
				domUtil.remove(evt.currentTarget.id);
			};

			domUtil._child(domNode, target);
			domUtil._child(body, domNode);
		};
	})();

	var theBackend = function(config, callback) {
		callback([{},{},{}]);
	};
	
	// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
	// 							plaid....
	// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
	var Plaid = (function() {
		var images = [];

		// handles the creation and storage of all images objects
		var imgs = (function() {
			// for better storage of image properties
			var plImage = function(src, w, h) {
				return {
					source : src,
					width : w,
					height : h
				};
			};

			return function(id) {
				// get elements within element supplied by the client
				var items = id.getElementsByTagName('img');
				var imageArr = [];

				for(var i = 0; i< items.length; i++) {
					var src = items[i],
						w = items[i].width,
						h = items[i].height;

					imageArr.push(plImage(src, w, h));
				}

				images = imageArr;
				return imageArr;
			};
		})();

		return function(ele, dims) {
			var id = document.getElementById(ele);
			var width = dims.width;
			var height = dims.height;

			// = # = # = # = # = # = # = # = # 
			// 			render....
			// = # = # = # = # = # = # = # = #
			var render = function() {
				var theme;
				var selectedTheme;

				var setStyle = function(node, style) {
					var styleType;

					styleType = (node.tagName == 'DIV'? "canvasStyle" : "imageStyle");
					
					for(var prop in style[styleType]) {
						if(style[styleType].hasOwnProperty(prop)) {
							node.style[prop] += style[styleType][prop];
						}
					}
				};

				// set width and height for the collage
				domUtil._width(id, width);
				domUtil._height(id, height);
				
				// find the theme
				selectedTheme = domUtil.attr(id, "plaid-theme");

				if(themes !== null) {
					for(var t in themes) {
						if(themes[t].name === selectedTheme) {
							theme = themes[t];
							break;
						}
					}

					if(theme !== undefined) {
						// apply styles to the collage and images
						setStyle(id, theme);
						
						for(var i = 0; i < images.length ; i++) {
							var img = images[i].source;
							setStyle(img, theme);
							
							// add event listeners to the images
							for(var evt in theme.imageEvents) {
								images[i].source[evt.toString()] = theme.imageEvents[evt.toString()];
							}
							
						}
					}
				}
			};

			return {
				create : function() {
					try {
						if(ele !== null || ele.tagName === 'DIV') {
							var config = {
								width: width,
								height : width,
								images : imgs(id)
							};

							// call backend algorithm
							theBackend(config, function(val) {
								render();
							});

						} else {
							throw new TypeError("element used for collage must be a DIV");
						}
					} catch (e) {
						console.error(e);
					}
				}
			};
		};
	})();

	var _plaid = window.plaid,
		_Pl = window.pl;

	var pl = function(id, dimensions) {
		return Plaid(id, dimensions)
	};

	window.P = pl;
	window.plaid = pl;

})(window);

// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = Lambda and Is = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
var is = ( function () {
	// tests for certain types of values (functions, objects)
	
	return {
		toType: function (val) {
			// found online, better than typeof at determining
			// the class of an object

			return ({}).toString.call(val).
				match(/\s([a-zA-Z]+)/)[1].toLowerCase()
		},
		closure: function (val) {
			return this.toType(val) === "function";
		},
		array: function (val) {
			return this.toType(val) === 'array';
		},
		object: function (val) {
			return this.toType(val) === 'object';
		},
		undefn: function (val) {
			return this.toType(val) === 'undefined';
		},
		string: function (val) {
			return this.toType(val) === 'string';
		},
		number: function (val) {
			return this.toType(val) === 'number';
		},
		logical: function (val) {
			return this.toType(val) === 'boolean';
		},
		numeric: function (val) {
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		nan: function (val) {
			return val !== val;
		}
	}
} )();

var lambda = ( function (is) {
	// this object contains higher order functions for the
	// terse manipulation of arrays
	
	return {
		indMap: function (func, iter) {
			// (integer -> a -> b) -> [a] -> [b]
			// apply a binary function to each element of 
			// an array or object, with the left argument being
			// the value iter[ith] and the right argument being the index ith

			var call = "indMap";
			if (!is.closure(func)) {
				throw new TypeError(call + ": func must be a function");
			}
			if (!func.length === 2) {
				throw new TypeError(call + ": func must be a binary function");
			}
			if (!is.array(iter)) {
				throw new TypeError(call + ": iter must be an array");
			}

			var result = [];

			for (var ith = 0; ith < iter.length; ith++) {
				result[ith] = func(iter[ith], parseInt(ith, 10));
			}
			return result;
		},
		fold: function (func, first, iter) {
			// (b -> b -> a) -> [b] -> a
			// inject an infix binary function func
			// into the sequence first funct iter[0] func iter[2] func .... iter[n],
			// returning a single value.
			
			var call = "fold";
			if (!is.closure(func)) {
				throw new TypeError(call + ": func must be a function");
			}
			if (!is.array(iter)) {
				throw new TypeError(call + ": iter must be an array");
			}

			if (iter.length === 0) {
				return first
			} else {
				var call = "fold";
				if (!is.closure(func)) {
					throw new TypeError(call + ": func must be a function");
				}
				if (!func.length === 2) {
					throw new TypeError(call + ": func must be a binary function");
				}
				if (!is.array(iter) && !is.object (iter)) {
					throw new TypeError(call + ": iter must be an array or object");
				}
				for (var ith = 0; ith < iter.length; ith++) {
					first = func(first, iter[ith]);
				}
				return first;
			}
		},
		concatMap: function (func, iter) {
			/* (a -> b) -> a -> [b]
			   map a function over iter, and concatenate the 
			   results so that length iter is not necessarily the same length
			   at the return value */ 

			var call = "concatMap";
			if (!is.closure(func)) {
				throw new TypeError(call + ": func must be a function");
			}
			if (!is.array(iter)) {
				throw new TypeError(call + ": iter must be an array");
			}

			if (iter.length === 0) {
				return []
			} else {
				var call = "concatMap";
				if (!is.closure(func)) {
					throw new TypeError(call + ":" + "func must be a function");
				}
				if (!func.length === 1) {
					throw new TypeError(call + ":" + "func must be a unary function");
				}
				if (!is.array(iter) && !is.object (iter)) {
					throw new TypeError(call + ":" + "iter must be an array or object");
				}

				var result = [];
				for (var ith = 0 ; ith < iter.length; ith++) {
					if (!iter.hasOwnProperty(ith)) {
						continue;
					}
					var val = iter[ith];
					result = result.concat(func(val, ith));
				}
				return result;				
			}

		},
		select: function (func, iter) {
			/* (a -> boolean) -> a -> [a]
			   takes a function and an array, and returns 
			   an array containing only elements for which the function returns true
			   upon application */

			var call = "select";
			if (!is.closure(func)) {
				throw new TypeError(call + ": func must be a function");
			}
			if (!func.length === 1) {
				throw new TypeError(call + ": func must be a unary function");
			}
			if (!is.array(iter) && !is.object (iter)) {
				throw new TypeError(call + ": iter must be an array or object");
			}

			var result = [];
			for (ith in iter) {
				if (!iter.hasOwnProperty(ith)) {
					continue;
				}
				var val = iter[ith];
				if (func(val)) {
					result = result.concat(val);
				}
			}
			return result;		
		},
		pickOne: function (iter) {
			// [a] -> a
			// return a single value from iter

			var call = "pickOne";
			if (!is.array(iter) && !is.object (iter)) {
				throw new TypeError(call + ": iter must be an array or object");
			}

			return iter[Math.floor(Math.random() * iter.length)];
		},
		sequence: function (from, to) {
			/* integer -> integer -> [integer]
			   return the sequence from...to */

			var result = [];
			for (var ith = from; ith <= to; ith++) {
				result = result.concat(ith);
			}
			return result;
		},
		timer: function (seconds) {
			// integer -> ( -> boolean)
			// returns a function that returns true for
			// seconds, em, seconds after its creation.
			
			var unixTime = function () {
				return Math.round(new Date().getTime() / 1000.0);
			}
			var genesis = unixTime();
			
			return function () {
				// has seconds seconds elapsed since creation?
				var timeSinceCreation = unixTime() - genesis;
				return timeSinceCreation < seconds;
			}
		}
	}
} )(is);

// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = Prototypes = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

if (!is.closure(Object.beget)) {
	// a Crockfordian method for object instantiation.

	Object.beget = function (obj) {
		var F = function () {};
		F.prototype = obj;
		return new F();
	}
}

// Matrix Prototype
// only implemented functions for 2 x 2 matrices, since all 
// functions will be applied to xy points.

var Matrix = ( function (is) {
	return function (xs, ys) {

		var that = {};
		that.xs = xs;
		that.ys = ys;
		
		that.rows = function () {
			that.xs.length;
		}
		that.cols = function () {
			that.ys.length;
		}
		that.map = function (func) {
			// (a - > b) -> Matrix a -> Matrix b
			// element-wise mapping over matrix.

			var call = "matrix.map";
			if (!is.closure(func)) {
				throw new TypeError(call + ": func must be a function");
			}
			var mapped = Matrix(
				[func( that.xs[0] ), func( that.xs[1] )],
				[func( that.ys[0] ), func( that.ys[1] )] );

			return mapped;
		}
		that.by = function (number) {
			// (integer) -> Matrix integer
			// scalar multiplication; linearly scale a 2 x 2 matrix

			return that.map( function (x) {
				return x * number;
			} );
		}
		that.add = function (number) {
			// (integer) -> Matrix integer
			// scalar addition; translate a 2 x 2 matrix

			return that.map( function (x) {
				return x + number;
			} );	
		}
		that.multiply = function (matrix) {
			/* Matrix a -> Matrix -> a
			 non-scalar multiplication.
			 implemented directly for efficiency 
			 (canvas needs redraw on every resize). */

			var product = Matrix(
				[
					( (that.xs[0] * matrix.xs[0]) + (that.xs[1] * matrix.ys[0]) ),
					( (that.xs[0] * matrix.xs[1]) + (that.xs[1] * matrix.ys[1]) )],
				[
						( (that.ys[0] * matrix.xs[0]) + (that.ys[1] * matrix.ys[0]) ),
						( (that.ys[0] * matrix.xs[1]) + (that.ys[1] * matrix.ys[1]) )]);

			return product;
		}
		that.asRectangle = function () {
			/* for two-way conversion from Rectange <-> Matrix */

			var converted = Rectangle(
				xMinus = that.xs[0], xPlus = that.xs[1],
				yMinus = that.ys[0], yPlus = that.ys[1]);

			return converted;
		}
		return that;
	}
} )(is)

//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

var Rectangle = ( function () {
	return function (xMinus, xPlus, yMinus, yPlus) {

		var call = "Rectangle";
		var args = Array.prototype.slice.call(arguments);

		console.log( args );

		lambda.indMap(
			function (val, ith) {
				if (!is.number(val)) {
					throw new TypeError(call + ": all values supplied to " + 
						" the rectangle constructor must be numbers");
				}

				if (is.nan(val) || !isFinite(val)) {
					throw new Error(call + ": all values supplied to " + 
						" the rectangle constructor must be non-NaN");
				}
			},
			args
		);

		var that = {};
		that.xMinus = xMinus;
		that.xPlus = xPlus;
		that.yMinus = yMinus;
		that.yPlus = yPlus;
		that.value = undefined;
		
		that._value = function (value) {
			that.value = value;
		};
		that.width = function () {
			return Math.abs(that.xPlus - that.xMinus)
		},
		that.height = function () {
			return Math.abs(that.yPlus - that.yMinus)
		},
		that.asMatrix = function () {
			// converts rectangle to a matrix,
			// with each row giving a component x, y
			// and each column giving a coordinate

			var converted = Matrix(
				[that.xMinus, that.xPlus],
				[that.yMinus, that.yPlus]);

			return converted;
		}
		return that;
	};
} )()



//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

// Grammar Prototype. Only used once, 
// but seperated for modularity and testabilities sake.

var Grammar = ( function (is, lambda) {
	return function (rules) {
		/*  an object for holding grammar rules, returning 
			terminals and non-terminals, and generating a string
			in the language from an initial symbol and a ruleset */
		
		var call = "Grammar";
		var that = {};
		that.rules = rules;

		if (!is.array(rules)) {
			throw new TypeError(call + ": rules must be an array")
		}

		lambda.indMap(
			function (rulePair, ith) {
	
				if ( !is.closure(rulePair.pattern) ) {
					throw new TypeError(call + ": every rule must be an object " +
						" containing a function bound to .pattern and a function bound " +
						" to .production ");
				}
				if ( !is.closure(rulePair.production) ) {
					throw new TypeError(call + ": every rule must be an object " + 
						"containing a function bound to .pattern and a function bound" +
						"to .production");
				}
			},
			that.rules
		)

		that.nonTerminals = function (xs) {
			/* [a] -> [a]
				takes a collection xs and an array rules of 
				pattern : production object pairs.
				returns the xs matching some pattern in rules.
				return the non-terminal values in the grammar rules. */

			var call = "nonTerminals";
			if (!is.array(xs)) {
				throw new TypeError(call + ": xs must be an array");
			}

			return lambda.select(
				function (x) {
					// does x match at least one pattern in rules? 

					for (ith in that.rules) {
						if (!that.rules.hasOwnProperty(ith)) {
							continue
						}
						var rule = that.rules[ith];
						if (rule.pattern(x)) {
							return true;
						}
					}
					return false;
				},
				xs
			);
		}
		that.terminals = function (xs) {
			/* [a] -> [a] 
			   get the terminal symbols in xs
			*/

			var call = "nonTerminals"
			if (!is.array(xs)) {
				throw new TypeError(call + ": xs must be an array");
			}

			return lambda.select(
				function (x) {

					for (ith in that.rules) {
						if (!that.rules.hasOwnProperty(ith)) {
							continue
						}
						var rule = that.rules[ith];
						if (rule.pattern(x)) {
							return false;
						}
					}
					return true;
				},
				xs);
		}
		that.generateOne = function (x) {
			/*  x -> [x] 
				takes a single terminal or non-terminal symbol,
				and apply a production rule to it, if it exists.
				otherwise, return the value */ 

			for (ith in that.rules) {
				if (!that.rules.hasOwnProperty(ith)) {
					continue
				}
				var rule = that.rules[ith];
				if (rule.pattern(x)) {
					return rule.production(x);
				}
			}
			//return x
		}
		that.generate = function (start) {
			/*  x -> [{pattern: function, production: function}] -> [x]
				take a starting symbol and apply a production rule repeatedly
				until only terminal symbols are left. */

			var stacks = {
				nonTerminal: [start],
				terminal: []
			};

			while (stacks.nonTerminal.length > 0) {
				/* [{ nonTerminal: [a], terminal: [a] }] ->
				   [{ nonTerminal: [a], terminal: [a] }] */
					
					var producable = stacks.nonTerminal[0];

					// shorten the non-terminal stack by one element
					stacks.nonTerminal = stacks.nonTerminal.splice(
						1, stacks.nonTerminal.length);

					// generate some more tiles from the 'producable'
					var products = that.generateOne(producable);

					stacks.nonTerminal = stacks.nonTerminal.concat(
						that.nonTerminals(products));

					stacks.terminal = stacks.terminal.concat(
						that.terminals(products));
			}
			return stacks
		}
		return that;
	}
} )(is, lambda);

// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = Core Algorithm = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 

var splitGrammar = ( function (lambda) {
		/* context-free grammar for deciding
		how to divide the rectangles. Allows fine grained control
		over rectangle subdivision.

		There must always exist a composition f_i o f_j ... f_k of 
		productions in the grammar of length n, otherwise 
		no guarantees of tiling plane
		
		Start: 
			(n x n)
		Nonterminals: 
			a x b, such that a, b > 1 and (a + b) > 3

		Terminals: 
			(1 x 1) |
			(1 x 2) |
			(2 x 1)

		Production Rules: 
			(1 x n) -> [ (1 x (n-a)), (1 x a) ]
			(n x m) -> [
				( (n - ) x (m - ) ), 
				( (n - ) x (m - ) ),
				( (n - ) x (m - ) )
				( (n - ) x (m - ) )
			]

		*/

	// utility functions to close over
	var xor = function (a, b) {
		return (a || b) && !(a && b)
	}
	var isDivisible = function (tile) {
		/* Rectangle -> boolean */

		return tile.width() > 1 && tile.height() > 1 && 
			(tile.width() + tile.height()) > 3
	}

	return Grammar([
		{
			pattern: function (tile) {
				// match 1 x n tiles only

				return isDivisible(tile) && 
					xor(tile.width() === 1, tile.height() === 1);
			},
			production: function (tile) {
				// split an 1 x n tile into [ (1 x n-m), (1 x m) ],
				// where m is a random number in 2...(n-1)

				if (tile.width() === 1) {
					// divide a vertical rectangle into two
					// rectangles

					var boundary = {
						yMiddle: lambda.pickOne(
							lambda.sequence(
								from = tile.yMinus + 1,
								to = tile.yPlus - 1
						))
					}

					var product = [
						Rectangle(
							tile.xMinus, tile.xPlus,
							boundary.yMiddle, tile.yPlus),
						Rectangle(
							tile.xMinus, tile.xPlus,
							tile.yMinus, boundary.yMiddle)];

				} else {
					// divide a horizontal rectangle into two
					// rectangles

					var boundary = {
						xMiddle: lambda.pickOne(
							lambda.sequence(
								from = tile.xMinus + 1,
								to = tile.xPlus - 1
						))
					}
					var product = [
						Rectangle(
							boundary.xMiddle, tile.xPlus,
							boundary.yMiddle, tile.yPlus),
						Rectangle(
							tile.xMinus, boundary.xMiddle,
							tile.yMinus, boundary.yMiddle)];
				}

				return product;
			}
		},
		{
			pattern: function (tile) {
				// matches a x b tiles
				
				return isDivisible(tile);
			},
			production: function (tile) {
				// splits an a x b tile into four tiles,
				// 
				// where a, b > 2

				var boundary = {
					xMiddle: lambda.pickOne(
						lambda.sequence(
							from = tile.xMinus + 1,
							to = tile.xPlus - 1
					)),
					yMiddle: lambda.pickOne(
						lambda.sequence(
							from = tile.yMinus + 1,
							to = tile.yPlus - 1
					))
				};

				var product = [
					// top-left tile
					Rectangle(
						tile.xMinus, boundary.xMiddle,
						boundary.yMiddle, tile.yPlus),
					// top-right tile
					Rectangle(
						boundary.xMiddle, tile.xPlus,
						boundary.yMiddle, tile.yPlus),
					// bottom-left tile
					Rectangle(
						tile.xMinus, boundary.xMiddle,
						tile.yMinus, boundary.yMiddle),
					// bottom-right tile
					Rectangle(
						boundary.xMiddle, tile.xPlus,
						tile.yMinus, boundary.yMiddle)
				];

				return product;
			}
		}
	]);

} )(lambda);

var tilePlane = ( function (is, lambda) {	
	return function (n, dimensions) {
		/* integer -> {integer} -> [Rectangle]
		 
		   takes an integer n and an object
		   whose .width and .height fields are positive integers.
		   returns an array of Rectangles of length n. This array of rectangles
		   will tile a plane of size dimensions.width x dimensions.height. */

		var call = "tilePlane";
		if (!is.number(n)) {
			throw new TypeError(call + ": n must be an number");
		}
		if (Math.round(n) !== n || n < 0) {
			throw new Error(call + ": n must be a positive integer");
		}

		var units = ( function (n, width, height) {
			/* magic numbers, for the moment.
			   later, units will be dynamically adjusted.
			   important, determines how many columns/rows of tiles to have */

			return {x: 6, y: 6}; 

		} )(n, dimensions.width, dimensions.height);

		// the initial rectangle to subdivide
		var pictureArea = Rectangle(0, units.x, 0, units.y);

		// tile -> [tile]
		var tiles = splitGrammar.generate(pictureArea);
		var scaleMatrix = Matrix(
			[dimensions.width / units.x, 0],
			[0, dimensions.height/ units.y]);

		return lambda.indMap(
			function (tile, ith) {
				/* tile -> tile
				modify a tile by applying matrix transformations */

				return tile.
					asMatrix().
					multiply(scaleMatrix).
					asRectangle();
			},
			tiles.terminal
		);
	}

} )(is, lambda)

tilePlane(10, {width: 1000, height: 1000})
