
( function () {
	"use strict";
} )();

var make = ( function (lambda, is) {

	var that = {};
	that.positiveIntegers = function () {
		return lambda.pickOne(
			lambda.sequence(1, 100)
		);
	}
	that.sequences = function () {
		var from = that.positiveIntegers();
		var to = from + that.positiveIntegers()
		return lambda.sequence(from, to)
	}
	that.seqsAlong = function () {
		var to = that.positiveIntegers();
		return lambda.sequence(0, to);
	}
	that.matrices = function () {
		var template = Matrix([0, 0], [0, 0]);
		return template.map(
			function (elem) {
				return that.positiveIntegers();
			}
		);
	}
	return that;

} )(lambda, is)

var forall = ( function (lambda, is) {
	return function (description, cases, assert) {
		/* {a} -> functions -> boolean
			quickcheck-like testing function */

		var call = 'forall';
		if (!is.string(description)) {
			throw new TypeError(call + ": description must be a string");
		}
		if (!is.array(cases)) {
			throw new TypeError(call + ": cases must be an array");
		}
		if (!is.closure(assert)) {
			throw new TypeError(call + ": assert must be a function");
		}

		for (ith in cases) {
			if (!cases.hasOwnProperty(ith)) {
				continue
			}
			if ( !is.closure(cases[ith]) ) {
				throw new TypeError(call + ": each member of the array 'cases' " +
					"must be a function");
			}
		}

		var timeLeft = lambda.timer(0.3);
		var testResults = [];

		while (timeLeft()) {

			var thisCase = [];
			// get some random test cases
			for (key in cases) {
				if (!cases.hasOwnProperty(key)) {
					continue;
				};
				var generator = cases[key];
				thisCase[key] = generator();
			}

			// run the assertion with the test cases
			var assertResult = assert.apply(null, thisCase);

			if (is.logical(assertResult)) {
				testResults = testResults.concat({
					testCase: thisCase,
					passed: assertResult});
			} else {
				var msg = "'" + description + "'\n" + 
				"a non-boolean value was produced when testing the function\n\n" +
					assert.toString() + "\n\nwith random inputs. A nullary function containing the " +
					"failed case has been returned";

				try {
					throw new TypeError(msg);						
				}
				finally {
					return function () {
						return testCase;
					}
				}
			}
		}

		// get the failures, if any
		var failed = lambda.fold(
			function (accum, test) {

				if (test.passed) {
					return accum;
				} else {
					return accum.concat([test.testCase]);
				}
			},
			[],
			testResults
		);
		if (failed.length > 0) {
			var msg = "'" + description + "'\n" + 
			"of " + testResults.length + " cases " + 
				failed.length + " failed for the function\n\n" +
				assert.toString() +  
				"\n\n A nullary function containing the failed cases has been returned"
			try {
				throw new Error(msg);				
			}
			finally {
				return function () {
					return failed;
				}				
			}
		} else {
			console.log("'" + description + "'\n" +  
				"all " + testResults.length + " cases passed.\n")
			return true;
		}
	}

} )(lambda, is);


