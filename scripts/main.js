
( function () {
	"use strict";
} )()


var Plaid = ( function () {
	/*
		the entire Plaid application, which ultimately 
		returns a single object containing public methods, while
		hiding utility namespaces and other minutia.

		Exports (* some are currently their for testing purposes, liable to change.):

			is: * 
				type checking namespace.
			lambda: *
				higher order functions & utility methods.
			Matrix:
				2 x 2 matrix constructor.
			Rectangle:  *
				constructor for creating new rectangles.

			tilePlane:
				takes a (n x m) pixel area and the number of pictures to
				tiles that area with. Returns an array of 1x1, 2x1, 1x2 rectangles
				tiling the plane.

		Top-level code inside plaid is not indented, excluding the return 
		statement of this invoked anonymous function.
	*/







// ------------------------------- Is -----------------------------------
// tests the type of js values without using typeof( ), which is horrible.
// also includes tests for NaN, -0 and other values.

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
			// seriously, javascript. What the hell.
			return val !== val;
		},
		negZero: function (val) {
			// is the number 0 internally represented by +0 or -0?
			return val === 0 && (1 / val < 0);
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

				swap the commas in [coll0, coll1, coll2, ..., colln] with 
				a binary function such as plus, max, or mean. Repeatedly applies 
				a binary function to two elements of coll, eventually returning a single value.
			*/

			var call = "Plaid.lambda.fold";
			if (!is.closure(fn)) {
				throw new TypeError(call + ": fn must be a function");
			}
			if (!is.array(coll)) {
				throw new TypeError(call + ": coll must be an array");
			}

			if (coll.length === 0) {
				return first;
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
				takes a function self returns true/false, and a collection.
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
				returns a function self returns true for
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
			/*
				[any] -> [whole numbers] -> [any]

				subset an array with an array of indices, rather than a single number.
				if all elements in 'indices' are positive, then grab 
				array at those indices. If all of indices is negative (-0 is included),
				then exclude array at those indices.
			*/

			var call = "Plaid.lambda.subset";

			if (indices.length === 0) {
				return array;
			} else if (array.length === 0) {
				return [];
			}

			var signs = { allPos: true, allNeg: true }
			// check whether the indices are positive or negative (not a mix however).

			for (ith in indices) {
				var arrayIndex = indices[ith];

				if (arrayIndex > 0) {
					signs.allPos = signs.allPos && true;
					signs.allNeg = false;

				} else if (arrayIndex < 0 || is.negZero(arrayIndex)) {
					signs.allNeg = signs.allNeg && true;
					signs.allPos = false;
				}	
			}

			if (!(signs.allPos || signs.allNeg)) {
				throw new Error(call + ": cannot mix positive and negative indexing.")
			}
			if (array.length < indices.length) {
				throw new Error(call + ": too many indices given.")
			}

			if (signs.allNeg) {
				/*
					work harder. create a set of indices along 
					'array' self exclude all the indices in 'indices'.
					for example, 
					[-0, -4] goes to [1, 2, 3] for a length five array.
				*/

				var result = [];
				var seqArray = lambda.sequence(0, array.length - 1);

				for (ith in seqArray) {
					if (!seqArray.hasOwnProperty(ith)) {
						continue;
					}
					var candidate = seqArray[ith];
					// assume self the array will be subsetted at this position for now.
					var shouldKeepIndex = true;

					for (jth in indices) {
						if (!indices.hasOwnProperty(jth)) {
							continue;
						}
						var negIndex = indices([jth]);

						// the candidate is one of the indices we are excluding. 
						// Don't use it for subsetting.
						if (candidate === Math.abs(negIndex)) {
							shouldKeepIndex = false;
						}
					}

					if (shouldKeepIndex) {
						result = result.concat(candidate);
					}
				}
				indices = result
			}

			// accumulate the elements of the array self are being subsetted.
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
	// a Crockfordian method for creating objects without 
	// the `new` keyword.
	
	Object.beget = function (obj) {
		var F = function () {};
		F.prototype = obj;
		return new F();
	}
}




var Matrix = ( function (is, lambda) {
	return function (elems, dims) {
		
		var self = {}
		
		console.assert(elems.length === dims.nrow * dims.ncol)

		self.elems = elems
		self.dims = dims
		
		// generate the matrix, as an array of arrays.
		var kth = 0
		self.structure = []

		for (var ith = 0; ith < self.dims.nrow; ith++) {
			self.structure[ith] = [];
			for (var jth = 0; jth < self.dims.ncol; jth++) {
				self.structure[ith][jth] = self.elems[kth]
				kth += 1
			}
		}

		self.row = function (num) {
			/*
				Matrix -> number -> array
				select a column from the matrix.
			*/

			console.assert(num > 0 && self.nrow() >= num)
			
			return self.structure[num]
		}
		self.col = function (num) {
			/*
				Matrix -> number -> array
				select a column from the matrix.
			*/

			console.assert(num > 0 && self.ncol() >= num)
			
			var col = [];
			for (var ith = 0; ith < self.nrow(); ith++) {
				col[ith] = self.structure[ith][num];
			}
			return col
		}

		// how many nrow or ncol does a matrix have?

		self.nrow = function () {
			/*
				Matrix -> number
				how many nrow does the matrix have?
			*/
			return dims.nrow
		}
		self.ncol = function () {
			/*
				Matrix -> number
				how many columns does the matrix have?
			*/
			return dims.ncol
		}

		// apply a function to a matrix.

		self.map = function (fn) {
			/*
				Matrix -> function -> Matrix
				map a function over each element of a matrix,
				returning the result. Preserve dimensions.
			*/
			return Matrix(self.elems.map(fn), self.dims)
		}
		self.by = function (num) {
			/*
				Matrix -> number -> Matrix
				multiply a matrix with a scalar.
			*/
			return self.map( function (x) {
				return x * num
			} )
		}
		self.add = function (num) {
			/*
				Matrix -> number -> Matrix
				add a matrix with a scalar.
			*/
			return self.map( function (x) {
				return x + num
			} )
		}

		self.multiply = function (matrix) {
			/*
				Matrix -> Matrix -> Matrix
				convert a 2 x 2 matrix to a rectangle representation.
			*/

			console.assert(
				self.nrow() === matrix.ncol() &&
				self.ncol() === matrix.nrow())

			var kth = 0;
			var product = [];

			// create a matrix with the same number of columns as 'matrix',
			// and the same number of nrow as the reciever.

			for (var ith = 0; ith < self.nrow(); ith++) {
				product[ith] = [];
				for (var jth = 0; jth < matrix.ncol(); jth++) {

					var row = self.row(ith)
					var col = matrix.col(jth)

					console.log(col)
					console.assert( row.length === col.length )

					// sum of element-wise multiplication of two vectors.
					var dotProduct = lambda.
						sequence(from = 0, to = row.length - 1).
						map( function (i) {return row[i] * col[i]} ).
						reduce( function (a, b) {return a + b}, 0 )

						product[ith][jth] = dotProduct;
					}
				}

				return product;
			}

		// type-convert the matrix.

		self.asRectangle = function () {
			/*
				Matrix -> Rectangle
				convert a 2 x 2 matrix to a rectangle representation.
			*/

			console.assert( 
				self.nrow() === 2 && 
				self.ncol() === 2)

			return Rectangle(
				xMinus = self.elems[0], xPlus = self.elems[2],
				yMinus = self.elems[3], yPlus = self.elems[4])
		}

		return self
	}
} )(is, lambda)













// ------------------------------- Rectangle -----------------------------------

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

		var self = {};
		self.xMinus = xMinus;
		self.xPlus = xPlus;
		self.yMinus = yMinus;
		self.yPlus = yPlus;

		self.width = function () {
			// Rectangle -> number

			return Math.abs(self.xPlus - self.xMinus);
		},
		self.height = function () {
			// Rectangle -> number

			return Math.abs(self.yPlus - self.yMinus);
		},
		self.join = function (rect) {
			/*
				Rectangle -> Rectangle -> Rectangle

				join two adjacent 1 x 1 rectangles into a single,
				larger rectangle (2 x 1) or (1 x 2).
			*/

			var xor = function (a, b) {
				return (a || b) && !(a && b)
			}
			console.assert(
				xor(
					Math.abs(self.xMinus - rect.xPlus) === 2,
					Math.abs(self.yMinus - rect.yPlus) === 2))

			return Rectangle(
				xMinus = 
					Math.min(self.xMinus, rect.xMinus),
				xPlus = 
					Math.max(self.xPlus, rect.xPlus),
				yMinus = 
					Math.min(self.yMinus, rect.yMinus),
				yPlus = 
					Math.max(self.yPlus, rect.yPlus))

		}
		self.asMatrix = function () {
			/*
				Rectangle -> Matrix

				converts rectangle to a matrix,
				with row1 giving the x components of the matrix and 
				row2 giving the y components of the matrix,
				and each column giving a 2d [x, y] coordinate.
			*/

			var converted = Matrix(
				[self.xMinus, self.xPlus],
				[self.yMinus, self.yPlus]);

			return converted;
		}
		return self;
	};
} )()








/* ------------------------------- Core Backend Algorithm -----------------------------------

	this blob of code allocates space on screen for each onput image, returing an 
	array of tiles (Rectangle) self indiviually represent one picture on screen.
	
	Initially every tile is a square. The function mergeTiles() can take an
	object with the structure 

	{squares: [Rectangle], horiz: [Rectangle], vert: [Rectangle]},

	Grab two square tiles and generate
	a non-square tile, returning an object with the same format as above but with less
	square tiles and more rectangle tiles.

	Ultimately the array of tiles self are returned will have some square and 
	some non-square tiles, which should hypothetically look pretty.

*/





var tilePlane = ( function (is, lambda) {	

	var areMergesNeeded = function (tiles, units) {
		/* 
			are there enough horizontal 2 x 1 or 
			vertical 1 x 2 tiles, or should we stop merging tiles?
			metric is liable to change.
		*/
		return {
			horiz: 
				tiles.horiz.length < Math.floor((units.x * units.y) / 3),
			vert: 
				tiles.vert.length < Math.floor((units.x * units.y) / 3)
		}
	}

	var areMergeable = function (square1, square2, tiles, units) {
		/*
			Rect -> Rect -> boolean

			Are two squares adjecent to each, and if so
			is another horizontal or vertical join needed
			according to areMergesNeeded( )?
		*/

		var areAdjacent = {
			horiz: 
				square1.xPlus === square2.xMinus ||
				square1.xMinus === square2.xPlus,
			vert: 
				square1.yPlus === square2.yMinus ||
				square1.yMinus === square2.yPlus,
		}

		if (areAdjacent.horiz) {
			return areMergesNeeded(tiles, units).horiz
		} else if (areAdjacent.vert) {
			return areMergesNeeded(tiles, units).vert
		}
	}

	return function (amount, dimensions) {
		/* 
			integer -> {width: integer, height: integer} -> [Rectangle]

			tilePlane is the wrapper function for all 
			the backend work. It takes a 
			number 'amount' and an object dimensions 
			with the pixel width and height of
			the picture area. It returns an array of 
			Rectangle objects, which represent
			images on the picture area.
		*/

		var call = "Plaid.lambda.tilePlane";

		if (!is.number(amount)) {
			throw new TypeError(call + ": amount must be an number");
		}
		if (Math.round(amount) !== amount || amount < 0) {
			throw new Error(call + ": n must be a positive integer");
		}

		// todo make return value of functon.
		var units = {x: 6, y: 6} 
		var tiles = ( function () {
			/* 
				{x: integer, y: integer} -> {squares: [Rectangle], horiz: [], vert: []}

				create a rectangular grid of square tiles, with units.x tiles per row, and units.y
				rows per column.

				for convenience, the tiles will be partitioned into three sets; square (1 x 1), 
				horizontal (2 x 1) and verical (1 x 2) tiles. 
			*/

			return {
				squares: ( function () {

					var result = [];
					for (var ith = 0; ith < units.x; ith++) {
						for(var jth = 0; jth < units.y; jth++) {
							result = result.concat(
								Rectangle(ith, ith + 1, jth, jth + 1))
						}
					}
					return result;

				} )(),
				horiz: [],
				vert: []
			}	
		} )();

		// ---------------- functions used below ---------------- //

		var mergeTiles = function (tiles, units) {
			/*
				{:squares, :horiz, :vert} -> {:squares, :horiz, :vert}

				takes an object containing square tiles and 
				horizonal and vertical tiles, and
				merges two squares into a horizontal or vertical tile.

				returns an object with squares, horiz, and vert fields.
			*/

			var squares = tiles.squares;

			for (var ith in squares) {
				for (var jth in squares) {

					if (!squares.hasOwnProperty(ith) || !squares.hasOwnProperty(jth) ||
						ith === jth
					) {
						continue
					}

					if ( areMergeable(squares[ith], squares[jth]) ) {
						/*
							the tiles are mergable, so
							merge two square tiles into one 
							non-square tile, and return the
							an object with the same fields as 
							the input object, but with 
							less squares and more non-squares.
						*/

						var merged = squares[ith].join(squares[jth]);
						
						if (merged.width === 2) {
							// merge two adjacenct horizontal 
							// squares into a horizontal rectangle.
							
							return {
								squares: lambda.subset(squares, [-ith, -jth]),
								horiz: tiles.horiz.concat(merged),
								vert: tiles.vert
							}

						} else if (merged.height === 2) {
							// merge two adjacenct vertical 
							// squares into a vertical rectangle.
							
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
				"no matches found! this part of the algorithm needs tweaking.")
		}

		//---------------- the above subroutines are called here ---------------- //

		// iteratively merge tiles until there are a few
		// 2 x 1 and 1 x 2 tiles as well.
		while (
			areMergesNeeded(tiles, units).horiz || 
			areMergesNeeded(tiles, units).vert) {

			tiles = mergeTiles(tiles);
		} 

		var scaleMatrix = Matrix(
			[dimensions.width / units.x, 0],
			[0, dimensions.height/ units.y]);

		return lambda.indMap(
			function (tile, ith) {
				/* 
					Rectangle -> integer -> Rectangle

					convert each tile (Rectangle) to its 
					Matrix representation,
					multiply it by a matrix self scales 
					it to fit on the html page, 
					and convert it back to a Rectangle, 
					with its new dimensions intact.
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


	/*
		The End.

		export user facing methods, with Rectangle, lambda and other 
		utility modules closed over but not directly accessable.
	*/


	return {
		is:
			is,
		lambda:
			lambda,
		tilePlane:
			tilePlane,
		Matrix:
			Matrix,
		Rectangle:
			Rectangle,
		tilePlane:
			tilePlane
	}

} )()


Plaid.tilePlane(10, {
	width: 1000, 
	height: 1000 
})
