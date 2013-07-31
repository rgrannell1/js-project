
var testRectangles = ( function () {

	var scaleMatrix = Matrix([1000 / 4, 0], [0, 1000/ 4]);

	var tiles = [
		Rectangle(0, 1, 3, 4),
		Rectangle(0, 1, 2, 3),
		Rectangle(0, 1, 1, 2),
		Rectangle(0, 1, 0, 1),
		Rectangle(1, 2, 3, 4),
		Rectangle(1, 2, 2, 3),	
		Rectangle(1, 2, 0, 3),
		Rectangle(2, 4, 3, 4),
		Rectangle(2, 3, 2, 3),
		Rectangle(2, 4, 1, 2),
		Rectangle(2, 3, 0, 1),
		Rectangle(3, 4, 2, 3),
		Rectangle(3, 4, 0, 1)
	];

	return lambda.indMap(
		function (tile, ith) {
			return tile.
				asMatrix().
				multiply(scaleMatrix).
				asRectangle();
		},
		tiles
	)

})();

