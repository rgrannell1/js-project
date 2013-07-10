
( function () { 
	"use strict"
} )()

var Rectangle = function (left, right, top, bottom) {
	// constructor for Rectangle objects

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
};
Rectangle.prototype.width = function () {
	return Math.abs(this.left - this.right);
};
Rectangle.prototype.height = function () {
	return Math.abs(this.top - this.bottom);
};
Rectangle.prototype.asMatrix = function () {
	return [
		[this. , this. , this. , this. ], // x components
		[this. , this. , this. , this. ]  // y components
	];
};
Rectangle.prototype.transform = function (transformation) {
	// apply a matrix transformation to this rectangle

	return this.
		asMatrix().
		multiply(transformation);
}
