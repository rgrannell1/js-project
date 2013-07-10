
( function () { 
	"use strict"
} )()

var Matrix = function (array) {

	console.assert(
		is.array,
		"error: the argument given to array must be a matrix"
	);

	var rowLengths = lambda.indMap(
		function (row, ind) {
			return row.length;
		},
		array);

	console.assert(
		lambda.reduce(
			function (a, b) {
				a === b
			},
			rowLength),
		"error: every row given to Matrix() must have an equal length"
	)

	this.value = array;
	this.rows = array.length;
	this.columns = rowLengths[0]
}

Matrix.prototype.map = function (func) {
	// map a function over each element of the matrix.
	// useful for elementwise addition

	var product = this.value

	for (var ith = 0; ith < this.rows; ith++) {
		for (var jth = 0; jth < this.columns; jth++) {

			product[ith][jth] = func(product[ith][jth]);
		}
	}

	return new Matrix(product);
}
Matrix.prototype.transpose = function () {
	// transpose a matrix
}

Matrix.prototype.multiply = function (matrix) {
	// multiply two matrices (non-elementwise)

	var seqLen = function (len) {
		var result = [];
		for (var i = 0; i < len; i ++) {
			result[i] = i;
		}
		return result
	}

	console.log(
		this.rows === matrix.columns &&
		this.columns === matrix.rows,
		"error in Matrix.multiply: matrix was wrong dimension");

	for (ith in seqLen(this.rows)) {
		for (jth in seqLen(matrix.columns)) {

			var row = this.value[ith]

			product[ith][jth] = // sum of scalar multiplication of
			// ith row by the jth column

		}
	}
	return product;
}





