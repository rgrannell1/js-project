var assignLinks = function (images, rectangles) {
 // [ {url: string, dimensions: [x y]} ] -> [Rectangles] -> [{url: string, rectangle: Rectangle}]
 	// returns an array of objects which are bijective maps from 
 // a url onto a rectangle.

 // greedy find the mapping f(urls, rectangles) that minimises
 // sum (percentage cropping needed per image)

 // var result = []
 // for each image get the dimension; find the first hor/vert/square tile to fit it in
 	// push {image: url} into result, remove both the current image and rectangle from the stacks
};

//create an array of results --> url-rectangle mapping to the result
//pop each rectangle and image from their stacks 
//is there an exact number of rectangles for each type? 
	//If so, why not assign the image to rectangle when the rectangles are generated.
var assignLinks = function (images, rectangles){
	
	var imageType = 0,
		notFound = true,
		j = 0;
	
	for(i=0;i<images.length; i++){
		if(images[i].width>images[i].height){
			if(images[i].width >= images[i].height*1.5){
				//return n*2n
				imageType = 1;
			}else{
				//return n*n
				imageType = 2;
			}
		}else{
			if(images[i].height >= images[i].width*1.5){
				//return 2n*n
				imageType = 3;
			}else{
				//return n*n
				imageType = 2;
			}
		}
		j=0;
		while(notFound){
			if(rectangles[j].type == imageType){
				rectangles[j].image = images[i]//assign image to rectangle
				notFound = false;
			}
			j++;
		}
		notFound = true;
	}
	return rectangles;
};
