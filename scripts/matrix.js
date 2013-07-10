
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
Matrix.prototype.multiply = function (matrix) {
	// implement matrix multiplication
}





