
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
	function: function (val) {
		return toType(val) === "function";
	},
	array: function (val) {
		return toType(val) === 'array';
	},
	object: function (val) {
		toType(val) === 'object'
	},
	undefined: function (val) {
		toType(val) === 'undefined'
	}
};

// lambda
// this object contains higher order functions for the
// terse manipulation of arrays AND objects

var lambda = {
	indMap: function (func, iter) {
		// (integer -> a -> b) -> [a] -> [b]
		// apply a binary function to each element of 
		// an array or object, with the left argument being
		// the value iter[ith] and the right argument being the index ith

		assert(
			is.function(func),
			"error in indMap: func must be a function");
		assert(
			is.array(iter) || is.object(iter),
			"error in indMap: func must be an object or array")
		assert(
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
		// inject an infix binary function func
		// into the sequence iter[0] func iter[2] func .... iter[n],
		// returning a single value.
		
		console.assert(
			is.function(func),
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
	}
}

// OBJECT PROTOTYPES

// Matrix Prototype
// only implemented functions for 2 x 2 matrices, since all 
// functions will be applied to xy points.
// Ryan Grannell

var Matrix = {

	xs: [0, 0],
	ys: [0, 0],
	nrows: 2,
	ncols: 2,

	map: function (func) {
		// element-wise mapping over matrix,
		// so that matrix is a Functor

		assert(
			is.function(func),
			"error in Matrix.map: func must be a function");

		return [
			[func( this.xs[0] ), func( this.xs[1] )],
			[func( this.ys[0] ), func( this.ys[1] )]
		];
	},
	transpose: function () {

		return [
			[this.xs[0], this.ys[0]],
			[this.xs[1], this.ys[1]]
		];
	},
	by: function (number) {
		// scalar multiplication; linearly scale a point

		return this.map( function (x) {
			return x * number;
		} );
	},
	add: function (number) {
		// scalar addition; translate a point

		return this.map( function (x) {
			return x + number;
		} );	
	},
	multiply: function (matrix) {
		// non-scalar multiplication.
		// implemented directly for efficiency (canvas needs redraw on
		// resize).

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
	}
}


// CORE ALGORITHMS

// partition divides a rectangle into 
// subrectangles, and maps an image to each
// rectangle. 

//partitionRectangle: function () {
	// gets the four xy pairs denoting the screen boundaries
	// at the moment. depending on the number of images present, 
	// partition the window into subrectanges. Do not recursively
	// partition, there is a minimum size that images will have.

	// rectangle sizes: N x N | N x 2N | 2N x N
	// images are mapped in order to the rectanges, so any
	// shuffling is done outside this function. 

	// returns an array of Rectangle objects, which can 
	// then be drawn to the canvas or whatevs
	// use matrix transformations for efficiency


//}



