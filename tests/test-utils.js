
var make = ( function (lambda, is) {
	
	return {
		positiveIntegers: function () {
			return lambda.pickOne(
				lambda.sequence(1, 100)
			);
		}
	}

} )(lambda, is)

var forall = ( function (lambda, is) {
	return function (description, cases, assert) {
		/* {a} -> functions -> boolean
			quickcheck-like testing function
		*/

		var timeLeft = lambda.timer(4);
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
			var didCasePass = assert.apply(null, thisCase);

			if (is.boolean(didCasePass)) {
				testResults = testResults.concat(
					{testCase: thisCase, passed: didCasePass}
				);
			} else {
				var msg = "'" + description + "'\n" + 
				"a non-boolean value was produced when testing the function\n\n" +
					assert.toString() + "\n\nwith random inputs. A nullary function containing the " +
					"failed case has been returned";

				console.log(msg);	
				return function () {
					return testCase
				}		
			}
		}

		// get the failures, if any
		var failed = lambda.fold(
			function (accum, test) {

				if (test.passed) {
					return accum
				} else {
					return accum.concat([test.testCase])
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
				"\n\na nullary function containing the failed cases has been returned"

			console.log(msg);
			return function () {
				return failed
			}
		} else {
			console.log("'" + description + "'\n" +  
				"all " + testResults.length + " cases passed.\n")
		}
	}

} )(lambda, is);

forall(
	"integer addition commutes",
	[
		make.positiveIntegers,
		make.positiveIntegers,
	],
	function (a, b) {
		return a + b === b + a
	}
)
