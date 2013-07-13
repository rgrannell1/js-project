( function () {
	"use strict";
} )()


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

		console.assert(
			is.closure(func),
			"error in indMap: func must be a function");
		console.assert(
			is.array(iter) || is.object(iter),
			"error in indMap: func must be an object or array")
		console.assert(
			func.length === 2,
			"error in indMap: binary function required")

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
		
		console.assert(
			is.closure(func),
			"error in reduce: func must be a function");
		console.assert(
			is.array(iter) || is.object(iter),
			"error in reduce: func must be an object or array")
		console.assert(
			func.length === 2,
			"error in reduce: binary function required")

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
	which: function (func, iter) {
		// for what indices did func(iter) return true?

		var result = [];
		for (var ith = 0; ith < iter.length; ith++) {
			if (!hasOwnProperty(ith)) {
				continue;
			}
			if ( func(iter(ith)) ) {
				result = result.push(ith)
			}
		}
		return result;
	},
	negate: function (f) {
		return function (x) {
			return !f(x)
		}
	},
	concatMap: function (func, iter) {
		// (a -> b) -> a -> [b]

		console.assert(
			is.closure(func),
			"error in indMap: func must be a function");
		console.assert(
			is.array(iter) || is.object(iter),
			"error in indMap: func must be an object or array")
		console.assert(
			func.length === 1,
			"error in concatMap: unary function required")

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

		console.assert(
			is.closure(func),
			"error in select: func must be a function");
		console.assert(
			is.array(iter) || is.object(iter),
			"error in select: func must be an object or array")
		console.assert(
			func.length === 1,
			"error in concatMap: unary function required")

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
	}
}

// OBJECT PROTOTYPES
// (Rectangle, and Matrix)

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

var tilePlane = function (n, dimensions) {
	// integer -> {integer} -> [Rectangle]
	//
	// takes an integer n and an object
	// whose .width and .height fields are positive integers.
	// returns an array of rectangles of the same length
	// as the array of url's

	var isDivisible = function (rect) {
		// Rectangle -> boolean
		// is the rectangle divisible into rectangles with integal
		// sides?

		return rect.width > 1 && rect.height > 1
	}
	var nonTerminals = function (xs, rules) {
		// [a] -> [{pattern: function production: function}] -> [a]
		// return the non-terminal values, according to rules.

		return lambda.select(
			function (x) {

				var isNonTerminal = false

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
		// [a] -> [{pattern: function production: function}] -> [a]
		// return only terminal values
		
		// reverse the rules to find the not-non-terminals (terminals)
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

	// magic numbers, for the moment.
	// later, units will be dynamically adjusted.
	// important, determines how many columns/rows of tiles to have {
	var units = {
		x: 6,
		y: 6
	}; 

	console.assert(
		n > units.x * units.y,
		"too many images to tile canvas with")
	//}

	// the initial rectangle to subdivide
	var start = Object.beget(Rectangle);
	start.xPlus = units.x;
	start.yPlus = units.y;
	
	var rectangles = [start];
	
	var splitGrammar = ( function () {
		/* nondeterministic context-free grammar for deciding
		how to divide the rectangles. Allows fine grained control
		over rectangle subdivision.

		There must always exist a composition f_i o f_j ... f_k of 
		productions in the grammar of length n,
		otherwise no guarantees of tiling plane
		
		each product is an element of 
		{ (n x n), (n x n), (n x 2n) }, for some number 1,2,..?

		Start: (n x n)
		Nonterminals:
		Production Rules: 
			 ->
			 ->  
		Terminals: (1 x 1) | (1 x 2) | (2 x 1)
		*/

		[
			{
				pattern: function (rect) {
					return isDivisible(rect);
				},
				production: function (rect) {
					return // some lovely production of rect
				}
			},
			{
				pattern: function (rect) {
					return isDivisible(rect);
				},
				production: function (rect) {
					return // some lovely production of rect
				}
			}
		];

	} )();
	
	var partitionTile = function (tile, rules) {
		// tile -> [{pattern: function, production: function}] -> [tile]
		// partitions a tile using one of the transformations within rules


	}

	// split the tiles into smaller tiles
	var tiles = lambda.until(
		function (xs) {
			// terminate when no non-terminals left
			xs.nonterminal.length === 0
		},
		function (xs) {
			// [{ nonTerminal: [Rectangle], terminal: [Rectangle] }] ->
			// [{ nonTerminal: [Rectangle], terminal: [Rectangle] }]
			//
			// pop a single tile off the stack.
			// apply a production rule to it, 
			// and push both the terminals and non-terminals produced
			// to their respective stacks in resulting object.

			var tile = xs.nonterminal.pop();
			var produced = partitionTile(tile, rules);

			return {
				nonTerminal: 
					xs.nonTerminal.concat(nonTerminals(produced)),
				terminal:
					xs.terminal.concat(terminals(produced))
			};
		}, 
		{
			nonTerminal: nonTerminals(start, splitGrammar),
			terminal: []
		}
	)
	
	// scale each tile up using le matrix algebras

	return tiles
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
