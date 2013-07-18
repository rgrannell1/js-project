
( function () {
	"use strict";
} )()


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
		}
	}
} )();

// lambda
// this object contains higher order functions for the
// terse manipulation of arrays

var lambda = ( function (is) {
	
	return {
		indMap: function (func, iter) {
			// (integer -> a -> b) -> [a] -> [b]
			// apply a binary function to each element of 
			// an array or object, with the left argument being
			// the value iter[ith] and the right argument being the index ith

			var call = "indMap";
			if (!is.closure(func)) {
				throw new TypeError(call + ":" + "func must be a function");
			}
			if (!func.length === 2) {
				throw new TypeError(call + ":" + "func must be a binary function");
			}
			if (!is.array(iter)) {
				throw new TypeError(call + ":" + "iter must be an array ");
			}

			var result = [];

			for (ith in iter) {
				if (!iter.hasOwnProperty(ith)) {
					continue;
				}
				result[ith] = func(iter[ith], parseInt(ith, 10));
			}
			return result;
		},
		reduce: function (func, iter) {
			// (b -> b -> a) -> [b] -> a
			// inject an infix binary function func
			// into the sequence iter[0] func iter[2] func .... iter[n],
			// returning a single value.
			
			var call = "reduce";
			if (!is.closure(func)) {
				throw new TypeError(call + ":" + "func must be a function");
			}
			if (!func.length === 2) {
				throw new TypeError(call + ":" + "func must be a binary function");
			}
			if (!is.array(iter) && !is.object (iter)) {
				throw new TypeError(call + ":" + "iter must be an array or object");
			}

			var first = true;

			for (ith in iter) {
				if (!iter.hasOwnProperty(ith)) {
					continue;
				}
				var elem = iter[ith];
				if (first) {
					var res = elem;
					first = false;
				} else {
					res = func(res, elem);
				}
			}
			return res;
		},
		negate: function (func) {

			var call = "negate";
			if (!is.closure(func)) {
				throw new TypeError(call + ":" + "func must be a function");
			}
			if (!func.length === 1) {
				throw new TypeError(call + ":" + "func must be a unary function");
			}

			return function (x) {
				return !func(x)
			}
		},
		concatMap: function (func, iter) {
			// (a -> b) -> a -> [b]

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

			for (ith in iter) {
				if (!iter.hasOwnProperty(ith)) {
					continue;
				}
				var val = iter[ith];
				result = result.concat(func(val, ith));
			}
			return result;
		},
		select: function (func, iter) {
			// (a -> boolean) -> a -> [a]

			var call = "select";
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
		until: function (pred, func, initial) {
			// (a -> boolean) -> (a -> a) -> a -> a

			var call = "until";
			if (!is.closure(pred)) {
				throw new TypeError(call + ":" + "pred must be a function");
			}
			if (!is.closure(func)) {
				throw new TypeError(call + ":" + "func must be a function");
			}
			if (!pred.length === 1) {
				throw new TypeError(call + ":" + "func must be a unary function");
			}
			if (!pred.length === 1) {
				throw new TypeError(call + ":" + "pred must be a unary function");			
			}

			// cut short after 10,000 iterations, 
			// in case pred was set up badly
			for (var failSafe = 0; failSafe < 10000; failSafe++) {

				if (pred(initial)) {
					break;
				} else {
					initial = func(initial);				
				}
			}
			return initial;

		},
		pickOne: function (iter) {
			// [a] -> a
			// return a single value from iter


		},
		sequence: function (from, to) {

			var result = [];
			for (var ith = from; ith <= to; ith++) {
				result = result.concat(ith);
			}
			return result;
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

var Matrix = {

	xs: [0, 0],
	ys: [0, 0],
	nrows: 2, ncols: 2,

	map: function (func) {
		// (a - > b) -> Matrix a -> Matrix b
		// element-wise mapping over matrix,
		// so that matrix is a Functor

		var call = "matrix.map";
		if (!is.closure(func)) {
			throw new TypeError(call + ":" + "func must be a function");
		}

		var mapped = Object.beget(Matrix);
		mapped.xs = [func( this.xs[0] ), func( this.xs[1] )];
		mapped.ys = [func( this.ys[0] ), func( this.ys[1] )]

		return mapped;
	},
	transpose: function () {
		// Matrix -> Matrix
		// get the transpose of a matrix 

		var transposed = Object.beget(Matrix);
		transposed.xs = [this.xs[0], this.ys[0]];
		transposed.ys = [this.xs[1], this.ys[1]];

		return transposed;
	},
	by: function (number) {
		// (integer) -> Matrix integer
		// scalar multiplication; linearly scale a point

		return this.map( function (x) {
			return x * number;
		} );
	},
	add: function (number) {
		// (integer) -> Matrix integer
		// scalar addition; translate a point

		return this.map( function (x) {
			return x + number;
		} );	
	},
	multiply: function (matrix) {
		// Matrix a -> Matrix -> a
		// non-scalar multiplication.
		// implemented directly for efficiency 
		// (canvas needs redraw on every resize).

		var product = Object.beget(Matrix);
		product.xs = [
			( (this.xs[0] * matrix.xs[0]) + (this.xs[1] * matrix.ys[0]) ),
			( (this.xs[0] * matrix.xs[1]) + (this.xs[1] * matrix.ys[1]) )]
		product.ys = [
				( (this.ys[0] * matrix.xs[0]) + (this.ys[1] * matrix.ys[0]) ),
				( (this.ys[0] * matrix.xs[1]) + (this.ys[1] * matrix.ys[1]) )]

		return product;
	},
	asRectangle: function () {
		// for two-way conversion from Rectange <-> Matrix

		var converted = Object.beget(Rectangle);
		converted.xMinus = this.xs[0];
		converted.xPlus = this.xs[1];
		converted.yMinus = this.ys[0];
		converted.yPlus = this.ys[1];

		return converted
	}
}

//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

var Rectangle = {
	// left, right. bottom, top.
	// easier to work with mathematical notation

	xMinus: 0, xPlus: 0,
	yMinus: 0, yPlus: 0,

	width: function () {
		return Math.abs(this.xPlus - this.xMinus)
	},
	height: function () {
		return Math.abs(this.xPlus - this.xMinus)
	},

	asMatrix: function () {
		// converts rectangle to a matrix,
		// with each row giving a component x, y
		// and each column giving a coordinate

		var converted = Object.beget(Matrix);
		converted.xs = [this.xMinus, this.xPlus];
		converted.ys = [this.yMinus, this.yPlus];

		return converted;
	}
}

// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = Core Algorithm = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 

var splitGrammar = ( function (lambda) {
	/* context-free grammar for deciding
	how to divide the rectangles. Allows fine grained control
	over rectangle subdivision.

	There must always exist a composition f_i o f_j ... f_k of 
	productions in the grammar of length n, otherwise no guarantees of tiling plane
	
	Start: 
		(n x n)
	Nonterminals: 
		a x b, such that a, b > 1 and (a + b) > 3

	Terminals: 
		(1 x 1) |
		(1 x 2) |
		(2 x 1)

	Production Rules: 
		(1 x n) -> [ (1 x (n-m)), (1 x m) ]
		(a x b) -> [
			( () x () ), 
			( () x () ),
			( () x () )
			( () x () )
		]

	*/
	var xor = function (a, b) {
		return (a || b) && !(a && b)
	}
	var isDivisible = function (tile) {
		/* Rectangle -> boolean */

		return tile.width() > 1 && tile.height() > 1 && 
			(tile.width() + tile.height()) > 3
	}

	return [
		{
			pattern: function (tile) {
				// matches 1 x n tiles

				return isDivisible(tile) && 
					xor(tile.width() === 1, tile.height() === 1);
			},
			production: function (tile) {
				// split an 1 x n tile into [ (1 x n-m), (1 x m) ],
				// where m is a random number in 2...(n-1)

				var production = 
					[Object.beget(tile), Object.beget(tile)];

				if (tile.width() === 1) {
					// dividing a vertical rectangle into two

					var boundary = {
						yMiddle: lambda.pickOne(
							lambda.sequence(
								from = tile.yMinus + 1,
								to = tile.yPlus - 1
						))
					}
					production[0].yMinus = boundary.yMiddle;
					production[1].yPlus = boundary.yMiddle;

				} else {
					// dividing a horizontal rectangle into two

					var boundary = {
						xMiddle: lambda.pickOne(
							lambda.sequence(
								from = tile.xMinus + 1,
								to = tile.xPlus - 1
						))
					}
					production[0].xMinus = boundary.xMiddle;
					production[1].xPlus = boundary.xMiddle;
				}
				return production;
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
					// height
					xMiddle: lambda.pickOne(
						lambda.sequence(
							from = tile.yMinus + 1,
							to = tile.yPlus - 1
					)),
					yMiddle: lambda.pickOne(
						lambda.sequence(
							from = tile.xMinus + 1,
							to = tile.xPlus - 1
					))
				};

				var production = [Object.beget(tile), Object.beget(tile),
					Object.beget(tile), Object.beget(tile)];

				// top-left
				production[0].xPlus = boundary.xMiddle;
				production[0].yMinus = boundary.yMiddle;

				// top-right
				production[1].xMinus = boundary.xMiddle;
				production[1].yMinus = boundary.yMiddle;

				// bottom-left
				production[2].xPlus = boundary.xMiddle;
				production[2].yPlus = boundary.yMiddle;

				// bottom-right
				production[3].xMinus = boundary.xMiddle;
				production[3].yPlus = boundary.yMiddle;

				return production;
			}
		}
	];

} )(lambda);

var tilePlane = ( function (is, lambda) {	
	return function (n, dimensions) {
		/* integer -> {integer} -> [Rectangle]
		 
		   takes an integer n and an object
		   whose .width and .height fields are positive integers.
		   returns an array of Rectangles of length n. This array of rectangles
		   will tile a plane of size dimensions.width x dimensions.height. 
		   */

		var nonTerminals = function (xs, rules) {
			/* [a] -> [{pattern: function production: function}] -> [a]
				takes a collection xs and an array rules of pattern : production object pairs
				returns the xs matching some pattern in rules.
				return the non-terminal values in the grammar rules. */

			return lambda.select(
				function (x) {

					for (ith in rules) {
						if (!rules.hasOwnProperty(ith)) {
							continue
						}
						var rule = rules[ith];
						if (rule.pattern(x)) {
							return true;
						}
					}
					return false;
				},
				xs
			)
		};
		var terminals = function (xs, rules) {
			/* [a] -> [{pattern: function production: function}] -> [a]
			   return terminal values in xs */

			var negated_rules = lambda.indMap(
				function (rule) {
					return {
						pattern: lambda.negate(rule),
						production: rule.production
					};
				},
				rules
			);
			return nonTerminals(xs, negated_rules);
		}

		var units = ( function (n, width, height) {
			/* magic numbers, for the moment.
			   later, units will be dynamically adjusted.
			   important, determines how many columns/rows of tiles to have */

			return {
				x: 6,
				y: 6
			}; 

		} )(n, dimensions.width, dimensions.height);

		// the initial rectangle to subdivide
		var start = Object.beget(Rectangle);
		start.xPlus = units.x;
		start.yPlus = units.y;
			
		var produce = function (tile, rules) {
			/* tile -> [{pattern: function, production: function}] -> [tile]
			   partitions a tile using one of the transformations within rules */

			for (ith in rules) {
				var rule = rules[ith];
				if (!rule.hasOwnProperty(rules)) {
					continue
				}
				if (rule.pattern(tile)) {
					return rule.production(tile);
				}
			}
		};

		// tile -> [tile]
		var tiles = lambda.until(
			pred = function (tileStacks) {
				return tileStacks.nonTerminal.length === 0
			},
			func = function (tileStacks) {
				/* [{ nonTerminal: [Rectangle], terminal: [Rectangle] }] ->
				   [{ nonTerminal: [Rectangle], terminal: [Rectangle] }] */

				var tile = tileStacks.nonTerminal.pop();
				var productions = produce(tile, splitGrammar);

				return {
					nonTerminal: 
						tileStacks.nonTerminal.concat(
							nonTerminals(productions, splitGrammar)),
					terminal:
						tileStacks.terminal.concat(
							terminals(productions, splitGrammar))
				};
			}, 
			initial = {
				nonTerminal: [start],
				terminal: []
			}
		);

		return lambda.indMap(
			function (tile, ith) {
				/* tile -> tile
				modify a tile by applying matrix transformations */

				return tile;
			},
			tiles.terminal
		);
	}

} )(is, lambda)

console.log( tilePlane(1, 1000, 1000) );



