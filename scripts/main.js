
( function () {
	"use strict";
} )()

// ------------------------------- is -----------------------------------
// tests the type of js values without using typeof, which is horrible.

var is = ( function () {
	// tests for certain types of values (functions, objects)

	return {
		toType: function (val) {
			// found online, better than typeof at determining
			// the class of an object

			return ({}).toString.call(val).
				match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		},
		hasType: function (val, type) {
			return this.toType(val) === type;
		},
		closure: function (val) {
			return this.hasType(val, "function");
		},
		array: function (val) {
			return this.hasType(val, "array");
		},
		object: function (val) {
			return this.hasType(val, "object");
		},
		undefn: function (val) {
			return this.hasType(val, "undefined");
		},
		string: function (val) {
			return this.hasType(val, "string");
		},
		number: function (val) {
			return this.hasType(val, "number");
		},
		logical: function (val) {
			return this.hasType(val, "logical");
		},
		nan: function (val) {
			return val !== val;
		}
	};
} )();

// ------------------------------- lambda -----------------------------------
// higher-order functions and utility functions, usually for working with arrays.

var lambda = ( function (is) {

	return {
		indMap: function (fn, coll) {
			/*
				(a -> integer -> b) -> [a] -> [b]
				like map, but also supplies the index to fn as its left argument.
				useful when you need to access another part of an array by index
				while iterating across an array of the same length.
			*/

			var call = "Plaid.lambda.indMap";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			if (!fn.length === 2) {
				throw new TypeError(call + ": fn must be a binary function");
			}
			if (!is.array(coll)) {
				throw new TypeError(call + ": coll must be an array");
			}

			var result = [];

			for (var ith = 0; ith < coll.length; ith++) {
				result[ith] = fn(coll[ith], parseInt(ith, 10));
			}
			return result;
		},
		fold: function (fn, first, coll) {
			/* 
				fold(+, 0, [1, 2, 3]) => [0 + 1 + 2 + 3]

				swap the commas in [iter_0, iter_1, ..., iter_n] with 
				a binary function. Useful for summing an array, finding a maximum
				value in an array, 
				or reducing arrays sequentially with a binary operator to a single value.
			*/

			var call = "Plaid.lambda.fold";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			if (!is.array(coll)) {
				throw new TypeError(call + ": coll must be an array");
			}

			if (coll.length === 0) {
				return first
			} else {
				if (!is.closure(fn)) {
					throw new TypeError(call + ": fn must be a function");
				}
				if (!fn.length === 2) {
					throw new TypeError(call + ": fn must be a binary function");
				}
				if (!is.array(coll) && !is.object (coll)) {
					throw new TypeError(call + ": coll must be an array or object");
				}
				for (var ith = 0; ith < coll.length; ith++) {
					first = fn(first, coll[ith]);
				}
				return first;
			}
		},
		concatMap: function (fn, coll) {
			/* 
			    (a -> b) -> a -> [b]
			    map a function over coll, and concatenate the 
			    results at each step to the results of the previous step.
			    the resulting length coll is not necessarily the same length
			    at the return value, unlike map or indMap. More general than map.
			    Useful for accumulating some but not all of the results obtained
			    when mapping across an array.
			*/ 

			var call = "Plaid.lambda.concatMap";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			if (!is.array(coll)) {
				throw new TypeError(call + ": coll must be an array");
			}

			if (coll.length === 0) {
				return [];
			} else {
				var call = "Plaid.lambda.concatMap";

				if (!is.closure(fn)) {
					throw new TypeError(call + ":" + "fn must be a function");
				}
				if (!fn.length === 1) {
					throw new TypeError(call + ":" + "fn must be a unary function");
				}
				if (!is.array(coll) && !is.object (coll)) {
					throw new TypeError(call + ":" + "coll must be an array or object");
				}

				var result = [];
				for (var ith = 0 ; ith < coll.length; ith++) {
					if (!coll.hasOwnProperty(ith)) {
						continue;
					}
					var val = coll[ith];
					result = result.concat(fn(val, ith));
				}
				return result;				
			}

		},
		select: function (fn, coll) {
			/*
				(a -> boolean) -> a -> [a]
				takes a function that returns true/false, and a collection.
				selects the elements of the collection for which the function is true.
			*/

			var call = "Plaid.lambda.select";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			if (!fn.length === 1) {
				throw new TypeError(call + ": fn must be a unary function");
			}
			if (!is.array(coll) && !is.object (coll)) {
				throw new TypeError(call + ": coll must be an array or object");
			}

			var result = [];
			for (ith in coll) {
				if (!coll.hasOwnProperty(ith)) {
					continue;
				}
				var val = coll[ith];
				if (fn(val)) {
					result = result.concat(val);
				}
			}
			return result;		
		},
		pickOne: function (coll) {
			/*
				[a] -> a
				pick a random value from coll.
			*/

			var call = "Plaid.lambda.pickOne";
			if (!is.array(coll) && !is.object (coll)) {
				throw new TypeError(call + ": coll must be an array or object");
			}

			return coll[Math.floor(Math.random() * coll.length)];
		},
		sequence: function (from, to) {
			/* 
				integer -> integer -> [integer]
				return the sequence from, from + 1,...to.
				useful for creating indices to iterate over.
			*/

			var result = [];
			for (var ith = from; ith <= to; ith++) {
				result = result.concat(ith);
			}
			return result;
		},
		timer: function (seconds) {
			/*
				integer -> nullary boolean function.
				returns a function that returns true for
				seconds, em, seconds after its creation.
				useful for counting elapsed time.
			*/

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

// ------------------------------- prototype -----------------------------------

if (!is.closure(Object.beget)) {
	// a Crockfordian method for creating objects without `new`.
	
	Object.beget = function (obj) {
		var F = function () {};
		F.prototype = obj;
		return new F();
	}
}

var Matrix = ( function (is) {
	return function (xs, ys) {
		// create a 2 x 2 matrix, with several methods for adding and
		// multiplying. Used for scaling and translating points on screen.

		var that = {};
		that.xs = xs;
		that.ys = ys;
		
		that.rows = function () {
			that.xs.length;
		}
		that.cols = function () {
			that.ys.length;
		}
		that.map = function (fn) {
			/*
				(a - > b) -> Matrix a -> Matrix b
				apply a function to each element of a matrix.
			*/

			var call = "Plaid.lambda.matrix.map";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			var mapped = Matrix(
				[fn( that.xs[0] ), fn( that.xs[1] )],
				[fn( that.ys[0] ), fn( that.ys[1] )] );

			return mapped;
		}
		that.by = function (number) {
			/*
				(integer) -> Matrix integer
				multiply a matrix by a scalar number (scale the matrix uniformly).
			*/

			return that.map( function (x) {
				return x * number;
			} );
		}
		that.add = function (number) {
			/*
				(integer) -> Matrix integer
				add a scalar number to a matrix (translate the matrix uniformly).
			*/

			return that.map( function (x) {
				return x + number;
			} );	
		}
		that.multiply = function (matrix) {
			/* 
				Matrix a -> Matrix -> a
			 	non-scalar multiplication.
			 	implemented algebraicly, partly for efficiency.
			*/

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
			/* 
				for two-way conversion from Rectange <-> Matrix 
			*/

			var converted = Rectangle(
				xMinus = that.xs[0], xPlus = that.xs[1],
				yMinus = that.ys[0], yPlus = that.ys[1]);

			return converted;
		}
		return that;
	}
} )(is)

// ------------------------------- rectangle -----------------------------------

var Rectangle = ( function () {
	return function (xMinus, xPlus, yMinus, yPlus) {

		var call = "Plaid.lambda.Rectangle";
		var args = Array.prototype.slice.call(arguments);

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

		that.width = function () {
			return Math.abs(that.xPlus - that.xMinus);
		},
		that.height = function () {
			return Math.abs(that.yPlus - that.yMinus);
		},
		that.join = function (rect) {
			/*
				join two adjacent 1 x 1 rectangles into a single,
				larger rectangle (2 x 1) or (1 x 2).
			*/
			console.assert(
				xor(
					Math.abs(that.xMinus - rect.xPlus) === 2,
					Math.abs(that.yMinus - rect.yPlus) === 2))

			return Rectangle(
				xMinus = Math.min(that.xMinus, rect.xMinus),
				xPlus = Math.max(that.xPlus, rect.xPlus),
				yMinus = Math.min(that.yMinus, rect.yMinus),
				yPlus = Math.max(that.yPlus, rect.yPlus)
			)

		}
		that.asMatrix = function () {
			/*
				converts rectangle to a matrix,
				with row one giving the x components and 
				row two giving the y components,
				and each column giving a 2d xy coordinate.
			*/

			var converted = Matrix(
				[that.xMinus, that.xPlus],
				[that.yMinus, that.yPlus]);

			return converted;
		}
		return that;
	};
} )()

// ------------------------------- grammar -----------------------------------


// Grammar Prototype. Only used once, 
// but seperated for modularity and testabilities sake.

var Grammar = ( function (is, lambda) {
	return function (rules) {
		/*  an object for holding grammar rules, returning 
			terminals and non-terminals, and generating a string
			in the language from an initial symbol and a ruleset */

		var call = "Plaid.lambda.Grammar";
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

			var call = "Plaid.lambda.nonTerminals";
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

			var call = "Plaid.lambda.nonTerminals"
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

// ------------------------------- core algorithm -----------------------------------


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
		/* 
			integer -> {integer} -> [Rectangle]

			takes an integer n and an object
			whose .width and .height fields are positive integers.
			returns an array of Rectangles of length n. This array of rectangles
			will tile a plane of size dimensions.width x dimensions.height. 
		*/

		var call = "Plaid.lambda.tilePlane";
		if (!is.number(n)) {
			throw new TypeError(call + ": n must be an number");
		}
		if (Math.round(n) !== n || n < 0) {
			throw new Error(call + ": n must be a positive integer");
		}

		var units = ( function (n, width, height) {
			/*
				magic numbers, for the moment.
				later, units will be dynamically adjusted.
				important, determines how many columns/rows of tiles to have. 
			*/

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
