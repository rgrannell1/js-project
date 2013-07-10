
define(function () {
	// this object is included because the builtin tests for 
	// properties in javascript is awful, and these should be 
	// standardised between branches

	return {
		// tests for certain types of values (functions, objects)
		toType: function (val) {
			// found online, better than typeof at determining
			// the class of an object

			return ({}).toString.call(val).
				match(/\s([a-zA-Z]+)/)[1].toLowerCase()
		},
		function: function (val) {
			return toType(val) === "function";
		},
		array: function (val) {
			return toType(val) === 'array';
		},
		object: function (val) {
			toType(val) === 'object'
		}
	};
})

