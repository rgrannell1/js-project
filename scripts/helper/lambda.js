
define(["is"], function (is) {
	// functional utility functions

	var indMap: function (func, iter) {
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
				continue;
			}
			ith = ith + 1;
			result[ith] = func(val, ith);
		}
		return result;
	}

	var reduce = function (func, iter) {
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
	};

	return {
		indMap: indMap
		reduce: reduce
	};
});
