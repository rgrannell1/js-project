
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
		},
		negZero: function (val) {
			// is the number 0 internally represented by +0 or -0?
			return val === 0 && (1/val < 0);
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
		},
		subset: function (array, indices) {
			// subset an array with an array of indices.
			// if all of 'indices' are positive, then grab 
			// array at those indices. If all of indices is negative,
			// then exclude array at those indices.

			var call = "Plaid.lambda.subset";

			if (indices.length == 0) {
				return array;
			} else if (array.length == 0) {
				return [];
			}

			var sign = {
				allPos: true,
				allNeg: true
			}

			// check whether the indices are positive or negative (not a mix however).

			for (ith in indices) {
				var indexToCheck = indices[ith];

				if (indexToCheck > 0) {
					sign.allPos = sign.allPos && true;
					sign.allNeg = sign.allNeg && false;

				} else if (indexToCheck < 0 || is.negZero(indexToCheck)) {
					sign.allNeg = sign.allNeg && true;
					sign.allPos = sign.allNeg && false;
				}	
			}

			if (!(sign.allPos || sign.allNeg)) {
				throw new Error(call + ": cannot mix positive and negative indexing.")
			}
			if (array.length < indices.length) {
				throw new Error(call + ": too many indices given.")
			}

			if (!sign.allPos) {
				// work harder. create a set of indices along 
				// 'array' that exclude all the values in 'indices'. 
				// [-0, -4] -> [1, 2, 3] for a length five array.

				var res = [];
				var seqArray = lambda.sequence(0, array.length - 1);

				for (ith in seqArray) {
					if (!seqArray.hasOwnProperty(ith)) {
						continue;
					}
					// assume that the array will be subsetted at this position.
					var candidate = seqArray[ith];
					var shouldSubset = true;

					for (jth in indices) {
						if (!indices.hasOwnProperty(jth)) {
							continue;
						}
						var toExclude = Math.abs(indices[jth]);

						// the candidate is one of the indices we are excluding. Remove.
						if (candidate === toExclude) {
							shouldSubset = false;
						}
					}

					if (shouldSubset) {
						res = res.concat(ith);
					}
				}
				indices = res
			}

			// accumulate the elements of the array that are being subsetted.
			return lambda.concatMap(
				function (ith) {
					return array[ith];
				},
				indices
			);
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
			// Matrix -> integer
			that.xs.length;
		}
		that.cols = function () {
			// Matrix -> integer
			that.ys.length;
		}
		that.map = function (fn) {
			/*
				Matrix -> unary function -> Matrix
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
				Matrix -> number -> Matrix
				multiply a matrix by a scalar (scale the matrix uniformly).
			*/

			return that.map( function (x) {
				return x * number;
			} );
		}
		that.add = function (number) {
			/*
				Matrix -> number -> Matrix
				add a scalar to a matrix (translate the matrix uniformly).
			*/

			return that.map( function (x) {
				return x + number;
			} );	
		}
		that.multiply = function (matrix) {
			/* 
				Matrix -> Matrix -> Matrix
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
				Matrix -> Rectangle
				convert a matrix to a rectangle object.
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

		// check the inputs are non-NaN numbers.
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
			// Rectangle -> number

			return Math.abs(that.xPlus - that.xMinus);
		},
		that.height = function () {
			// Rectangle -> number

			return Math.abs(that.yPlus - that.yMinus);
		},
		that.join = function (rect) {
			/*
				Rectangle -> Rectangle -> Rectangle

				join two adjacent 1 x 1 rectangles into a single,
				larger rectangle (2 x 1) or (1 x 2).
			*/

			console.assert(
				xor(
					Math.abs(that.xMinus - rect.xPlus) === 2,
					Math.abs(that.yMinus - rect.yPlus) === 2))

			return Rectangle(
				xMinus = 
					Math.min(that.xMinus, rect.xMinus),
				xPlus = 
					Math.max(that.xPlus, rect.xPlus),
				yMinus = 
					Math.min(that.yMinus, rect.yMinus),
				yPlus = 
					Math.max(that.yPlus, rect.yPlus)
			)

		}
		that.asMatrix = function () {
			/*
				Rectangle -> Matrix

				converts rectangle to a matrix,
				with row1 giving the x components of the matrix and 
				row2 giving the y components of the matrix,
				and each column giving a 2d [x, y] coordinate.
			*/

			var converted = Matrix(
				[that.xMinus, that.xPlus],
				[that.yMinus, that.yPlus]);

			return converted;
		}
		return that;
	};
} )()

/* ------------------------------- Core Backend Algorithm -----------------------------------

	this blob of code allocates space on screen for each onput image, returing an 
	array of tiles (Rectangle) that indiviually represent one picture on screen.
	
	Initially every tile is a square. The function mergeTiles() can take an
	object with the structure 

	{squares: [Rectangle], horiz: [Rectangle], vert: [Rectangle]},

	Grab two square tiles and generate
	a non-square tile, returning an object with the same format as above but with less
	square tiles and more rectangle tiles.

	Ultimately the array of tiles that are returned will have some square and 
	some non-square tiles, which should hypothetically look pretty.

*/

var initTiles = ( function () {
	return function (units) {
		/* 
			{x: integer, y: integer} -> {squares: [Rectangle], horiz: [], vert: []}

			for convenience, the tiles will be partitioned into three sets; square (1 x 1), 
			horizontal (2 x 1) and verical (1 x 2) tiles. 
		*/

		return {
			squares: ( function () {

				var res = [];
				for (var ith = 0; ith < units.x; ith++) {
					for(var jth = 0; jth < units.y; jth++) {
						res = res.concat(
							Rectangle(
								ith, ith + 1,
								jth, jth + 1))
					}
				}
				return res

			} )(),
			horiz: [],
			vert: []
		}	
	} 	
} )()

var mergeTile = ( function (is, lambda) {
	return function (tiles, units) {
		/*
			{:squares, :horiz, :vert} -> {:squares, :horiz, :vert}
			takes an object containing square tiles and horizonal and vertical tiles, and
			merges two squares into a horizontal or vertical tile.

			returns an object with squares, horiz, and vert fields.
		*/

		var areMergesNeeded = function () {
			/* 
				lexically scopes 'tile' and 'units', for cleanness.
				are there enough horizontal 2 x 1 or vertical 1 x 2 tiles?
			*/
			return {
				horiz: tile.horiz.length < Math.floor((units.x * units.y) / 3);
				vert: tile.vert.length < Math.floor((units.x * units.y) / 3);
			}
		}

		var squares = tiles.squares;

		for (var ith in squares) {
			for (var jth in squares) {

				if (!squares.hasOwnProperty(ith) || !squares.hasOwnProperty(jth) ||
					// merging a tile with itself would be silly.
					ith === jth
				) {
					continue
				}

				if ( areMergable(squares[ith], squares[jth]) ) {
					/*
						merge two square tiles into one non-square tile, and return the
						an object with the same fields as the input object, but with 
						less squares and more non-squares.
					*/

					var merged = squares[ith].join(squares[jth]);
					
					if (merged.width === 2) {
						// merge two adjacenct horizontal squares into a horizontal rectangle.
						
						return {
							squares: lambda.subset(squares, [-ith, -jth]),
							horiz: tiles.horiz.concat(merged),
							vert: tiles.vert
						}

					} else if (merged.height === 2) {
						// merge two adjacenct vertical squares into a vertical rectangle.
						
						return {
							squares: lambda.subset(squares, [-ith, -jth]),
							horiz: tiles.horiz,
							vert: tiles.vert.concat(merged)
						}

					}
				}
			}
		}
		throw new Error(
			"no matches found! this part of the algorithm needs tweaking."
		)
	}

} )(is, lambda);

var tilePlane = ( function (is, lambda) {	
	return function (amount, dimensions) {
		/* 
			integer -> {width: integer, height: integer} -> [Rectangle]

			tilePlane is the wrapper function for all the backend work. It takes a 
			number 'amount' and an object dimensions with the pixel with and height of
			the picture area. It returns an array of Rectangle objects, which represent
			images on the picture area.
		*/

		var areMergable = function (square1, square2) {
			/*
				Rect -> Rect -> Rect
				Are two squares adjecent to each, and if so
				is another horizontal or vertical join needed?
			*/

			var areAdjacent = {
				horiz: Math.abs(square1.width + square2.width) === 2,
				vert: Math.abs(square1.height + square2.height) === 2
			}

			if (areAdjacent.horiz) {
				return areMergesNeeded().horiz
			} else if (areAdjacent.vert) {
				return areMergesNeeded().vert
			}
		}

		var call = "Plaid.lambda.tilePlane";
		if (!is.number(amount)) {
			throw new TypeError(call + ": amount must be an number");
		}
		if (Math.round(amount) !== amount || amount < 0) {
			throw new Error(call + ": n must be a positive integer");
		}

		var units = ( function (amount, dimensions) {
			/*
				magic numbers, for the moment.
				later, units will be dynamically adjusted.
				important, determines how many columns/rows of tiles to have. 
				won't be in an invoked anonymous function later, just a placeholder.
			*/

			return {x: 6, y: 6}; 

		} )(amount, dimensions);

		// initialise a grid of tiles to merge.
		var tiles = initTiles(units);

		// iteratively merge tiles until there are a few
		// 2 x 1 and 1 x 2 tiles as well.
		while (areMergesNeeded().horiz || areMergesNeeded().vert) {
			tiles = mergeTiles(tiles);
		} 

		var scaleMatrix = Matrix(
			[dimensions.width / units.x, 0],
			[0, dimensions.height/ units.y]);

		return lambda.indMap(
			function (tile, ith) {
				/* 
					Rectangle -> integer -> Rectangle

					convert each tile (Rectangle) to its Matrix representation,
					multiply it by a matrix that scales it to fit on the html page, 
					and convert it back to a Rectangle, with its new dimensions intact.
				*/

				return tile.
					asMatrix().
					multiply(scaleMatrix).
					asRectangle();
			},
			tiles
		);
	}

} )(is, lambda)

tilePlane(10, {width: 1000, height: 1000})
