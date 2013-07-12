
// partition divides a rectangle into 
// subrectangles, and maps an image to each
// rectangle. 

return {
	partitionRectangle: function () {
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


	}
}
