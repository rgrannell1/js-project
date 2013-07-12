
// Matrix Prototype
// only implemented functions for 2 x 2 matrices, since all 
// functions will be applied to xy points. 
// Ryan Grannell

var Matrix = {
	// constructor for matrices

	xs: [0, 0],
	ys: [0, 0],
	nrows: this.xs.length,
	ncols: this.ys.length,

	map: function (f) {
		// element-wise mapping over matrix

		return [
			[f( this.xs[0] ), f( this.xs[1] )],
			[f( this.ys[0] ), f( this.ys[1] )]
		];
	},
	transpose: function () {

		return [
			[this.xs[0], this.ys[0]],
			[this.xs[1], this.ys[1]]
		];
	},
	by: function (a) {
		// scalar multiplication; linearly scale a point

		return this.map( function (x) {
			return x * a
		} );
	},
	add: function (a) {
		// scalar addition; translate a point

		return this.map( function (x) {
			return x + a
		} );	
	},
	multiply: function (m) {
		// non-scalar multiplication

		return [
			[
				( (this.xs[0] * m.xs[0]) + (this.xs[0] * m.xs[1]) ),
				( (this.xs[0] * m.ys[0]) + (this.xs[0] * m.ys[1]) )],
			[
				( (this.xs[1] * m.xs[0]) + (this.xs[1] * m.xs[1]) ),
				( (this.xs[1] * m.ys[0]) + (this.xs[1] * m.ys[1]) )]
		];
	}
}

