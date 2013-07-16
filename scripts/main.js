( function () {
	"use strict";
} )()


// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = Lambda and Is = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # 
// = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

// is
// this object contains tests for various properties;
// if your test is general (undefined, array, NaN) please
// consider extending this object

var is = {
	// tests for certain types of values (functions, objects)
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
	}
};

// lambda
// this object contains higher order functions for the
// terse manipulation of arrays AND objects; all methods implemented
// here should work on both if possible

var lambda = {
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
		if (!is.array(iter) && !is.object (iter)) {
			throw new TypeError(call + ":" + "iter must be an array or object");
		}

		var ith = 0;
		var result = [];

		for (val in iter) {
			if (!iter.hasOwnProperty(val)) {
				continue;
			}
			ith = ith + 1;
			result[ith] = func(val, ith);
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
		for (elem in iter) {
			if (!iter.hasOwnProperty(elem)) {
				continue;
			}
			if (first) {
				var res = iter[0];
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

		var ith = 0;
		var result = [];

		for (val in iter) {
			if (!iter.hasOwnProperty(val)) {
				continue;
			}
			ith = ith + 1;
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

		var ith = 0;
		var result = [];

		for (val in iter) {
			if (!iter.hasOwnProperty(val)) {
				continue;
			}
			ith = ith + 1;
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

		while (!pred(initial)) {
			initial = func(initial);
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
// Ryan Grannell

//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #
//# = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = # = #

var Matrix = {

	xs: [0, 0],
	ys: [0, 0],
	nrows: 2,
	ncols: 2,

	map: function (func) {
		// (a - > b) -> Matrix a -> Matrix b
		// element-wise mapping over matrix,
		// so that matrix is a Functor

		console.assert(
			is.closure(func),
			"error in Matrix.map: func must be a function");

		return [
			[func( this.xs[0] ), func( this.xs[1] )],
			[func( this.ys[0] ), func( this.ys[1] )]
		];
	},
	transpose: function () {
		// Matrix -> Matrix
		// get the transpose of a matrix 

		return [
			[this.xs[0], this.ys[0]],
			[this.xs[1], this.ys[1]]
		];
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

		console.assert(
			m.nrows === 2 && m.ncols === 2,
			"Matrix.multiply(m): the matrix m must be 2 x 2");

		return [
			[
				( (this.xs[0] * matrix.xs[0]) + (this.xs[0] * matrix.xs[1]) ),
				( (this.xs[0] * matrix.ys[0]) + (this.xs[0] * matrix.ys[1]) )],
			[
				( (this.xs[1] * matrix.xs[0]) + (this.xs[1] * matrix.xs[1]) ),
				( (this.xs[1] * matrix.ys[0]) + (this.xs[1] * matrix.ys[1]) )]
		];
	},
	asRectangle: function () {
		// for two-way conversion from Rectange <-> Matrix

		var converted = Object.beget(Rectangle)
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

	xMinus: 0,
	xPlus: 0,
	yMinus: 0,
	yPlus: 0,

	width: Math.abs(this.xPlus - this.xMinus),
	height: Math.abs(this.xPlus - this.xMinus),

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

var splitGrammar = ( function () {
	/* context-free grammar for deciding
	how to divide the rectangles. Allows fine grained control
	over rectangle subdivision.

	There must always exist a composition f_i o f_j ... f_k of 
	productions in the grammar of length n,
	otherwise no guarantees of tiling plane
	
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

	*/

	var isDivisible = function (tile) {
		/* Rectangle -> boolean
		   is the Rectangle divisible into Rectangles with integal
		  sides, and is it non-terminal? */

		return Math.min(tile.width, tile.height) > 1 && 
			tile.width + tile.height > 3
	}

	return [
		{
			pattern: function (tile) {
				// matches 1 x n tiles

				return isDivisible(tile) && xor(
					tile.width === 1,
					tile.height === 1);
			},
			production: function (tile) {
				// split an 1 x n tile into [ (1 x n-m), (1 x m) ],
				// where m is a random number in 2...(n-1)

				var boundary = lambda.pickOne(
					lambda.sequence(
						from = 1,
						to = Math.max(tile.width, tile.height) - 1
				));

				var production = [
					Object.beget(tile),
					Object.beget(tile)];

				if (tile.width === 1) {
					// dividing a vertical rectangle into two

					production[0].yMinus = production[0].yMinus +
						(production[0].height - boundary);
					
					production[1].yPlus = production[1].yPlus - 
						boundary;


				} else {
					// dividing a horizontal rectangle into two

					production[0].xMinus = production[0].xMinus +
						(production[0].width - boundary);
					
					production[1].xPlus = production[1].xPlus - 
						boundary;

				}
				return production;
			}
		},
		{
			pattern: function (rect) {
				return isDivisible(rect)
			},
			production: function (rect) {
				return // some lovely production of rect
			}
		}
	];

} )();

var tilePlane = function (n, dimensions) {
	/* integer -> {integer} -> [Rectangle]
	 
	   takes an integer n and an object
	   whose .width and .height fields are positive integers.
	   returns an array of Rectangles of the same length
	   as the array of url's.
	   */

	var xor = function (a, b) {
		return (a || b) && !(a && b)
	}
	var nonTerminals = function (xs, rules) {
		/* [a] -> [{pattern: function production: function}] -> [a]
			takes a collection xs and an array rules of pattern : production object pairs
			returns the xs matching some pattern in rules.
		    return the non-terminal values in the grammar rules. */

		return lambda.select(
			function (x) {
				var isNonTerminal = false;

				for (rule in rules) {
					if (!hasOwnProperty(rule)) {
						continue
					}
					if (rule.pattern(x)) {
						isNonTerminal = true;
					}
				}
				return isNonTerminal;
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
		return nonTerminals(xs, negated_rules)
	}


	var units = ( function (n, width, height) {
		/* magic numbers, for the moment.
		   later, units will be dynamically adjusted.
		   important, determines how many columns/rows of tiles to have */
		
		console.assert(
			n > units.x * units.y,
			"too many images to tile canvas with")

		return {
			x: 6,
			y: 6
		}; 

	} )(n, dimensions.width, dimensions.height);

	// the initial rectangle to subdivide
	var start = Object.beget(Rectangle);
	start.xPlus = units.x;
	start.yPlus = units.y;
		
	var applyProduction = function (tile, rules) {
		/* tile -> [{pattern: function, production: function}] -> [tile]
		   partitions a tile using one of the transformations within rules */

		for (rule in rules) {
			if (!rule.hasOwnProperty(rules)) {
				continue
			}
			if (rule.pattern(tile)) {
				return rule.production(tile);
			}
		}
	};

	var tiles = lambda.until(
		pred = function (tileStacks) {
			tileStacks.nonterminal.length === 0
		},
		func = function (tileStacks) {
			/* [{ nonTerminal: [Rectangle], terminal: [Rectangle] }] ->
			   [{ nonTerminal: [Rectangle], terminal: [Rectangle] }]
			   */

			var tile = tileStacks.nonterminal.pop();
			var productions = applyProduction(tile, rules);

			return {
				nonTerminal: 
					tileStacks.nonTerminal.concat(
						nonTerminals(productions)),
				terminal:
					tileStacks.terminal.concat(
						terminals(productions))
			};
		}, 
		initial = {
			nonTerminal: nonTerminals([start], splitGrammar),
			terminal: []
		}
	);

	return lambda.indMap(
		function (tile, ith) {
			/* tile -> tile

			   scale each tile up using le matrix algebras
			   do any last minute corrections/adjustments */



			return tile
		},
		tiles.terminal
	);
}

var assignLinks = function (images, rectangles) {
	// [ {url: string, dimensions: [x y]} ] -> [Rectangles] -> [{url: string, rectangle: Rectangle}]
	// returns an array of objects which are bijective maps from 
	// a url onto a rectangle.

	// greedy find the mapping f(urls, rectangles) that minimises
	// sum (percentage cropping needed per image)

	// var result = []
	// for each image get the dimension; find the first hor/vert/square tile to fit it in
		// push {image: url} into result, remove both the current image and rectangle from the stacks


}
