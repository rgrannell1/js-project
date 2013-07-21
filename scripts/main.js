var assignLinks = function (images, rectangles){

	var notFound = true,
		squareNotFound = true,
		k = 0,
		j = 0,
		rectangle,
		temp = {url: "", dimension: [0, 0]},
		result = result = {url: "1", rectangle: "2"},
		results = [],
		indexOfImage = 0,
		currentType = 0;
		
	while( rectangles.length !== 0 ){
		
		rectangle = rectangles.pop(); 
		j = 0;
		notFound = true; 
		indexOfImage = 0;
		
		while(notFound){
		
			if(images[j].aspectRatio() < 0.75 ){
				currentType = 0.5; //4*2
			}else if(images[j].aspectRatio() > 1.25 ){
				currentType = 2; //2*4
			}else{
				currentType = 1; //square
			}
			
			if( rectangle.aspectRatio() === currentType ){
				
				indexOfImage = j; //correct match found
				notFound = false;
			}
			
			if( notFound && ( j === (images.length - 1 )) ){
			
				indexOfImage = 0;
				squareNotFound = true;
				k = 0; 
				
				//Find square
				while(squareNotFound){
				
					if(images[k].aspectRatio() < 0.75 ){
						currentType = 0.5; //4*2
					}else if(images[k].aspectRatio() > 1.25 ){
						currentType = 2; //2*4
					}else{
						currentType = 1; //square
					}
					
					if( currentType === 1 ){
						indexOfImage = k; //take first square
						squareNotFound = false;
					}
					
					//square not found
					if( squareNotFound && ( k === (images.length - 1 )) ){
						indexOfImage = 0; //take first image in the array
						squareNotFound = false;
					}
					k++;
				}
				notFound = false;
			}
			j++;
		}
		
		temp = images.slice(0, indexOfImage+1);
		var image = temp.pop();
		if(images.length !== 1){
			images = temp.concat(images.slice(indexOfImage+1, images.length));
		}
		result = {url: image.url(), rectangle: "4"}; 
		results.push(result)
	}
	return results; 
};