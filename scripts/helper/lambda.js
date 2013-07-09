
// TODO: add to define function

var lambda = {
	// functional utilities
	indMap: function (func, iter) {
		"apply a binary function to each element of 
		an array or object, with the left argument being
		the value iter[ith] and the right argument being the index ith"

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
				continue
			}
			ith = ith + 1
			result[ith] = func(val, ith)
		}
		return result
	}
}
