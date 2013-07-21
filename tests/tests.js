
( function () {
	"use strict";
})();

var testSuite = ( function (is, lambda) {

	var allEqual = function (xs, ys) {

		var call = "allEqual";
		if (!is.array(xs)) {
			throw new TypeError(call + ":" + "xs must be an array");
		}
		if (!is.array(ys)) {
			throw new TypeError(call + ":" + "ys must be an array");
		}

	    if (xs.length !== ys.length) {
	        return false
	    }
	    
		for (var ith = 0; ith < xs.length; ith++) {
			if (xs[ith] !== ys[ith]) {
				return false;
			}
		}
		return true;
	};
	var test = function (description, func) {
		return {
			description: description,
			func: func
		};
	};	

	return [
		test("test that indMap indices are correct", function () {

			return forall(
				"indices are correct",
				[make.seqsAlong],
				function (sequence) {

					return allEqual(
						lambda.indMap(
							function (val, ith) { return ith },
							sequence),
							sequence);
				}
			);

		}),
		test("test that indMap values are correct", function () {

			return forall(
				"values are same as indices",
				[make.seqsAlong],
				function (sequence) {

					return allEqual(
						lambda.indMap(
							function (val, ith) { return val },
							sequence),
							sequence);
				}
			)

		}),
		test("test that negate negates predicates", function () {

			var predicate = {
				truth: lambda.negate(function (x) {
					return false
				}),
				falsehood: lambda.negate(function (x) {
					return true;
				})
			};

			return predicate.truth(1) === true &&
				predicate.falsehood(1) === false;
		}),
		test("test that fold sum is equal to normal sum", function () {

			var foldSum = function (iter) {
				return lambda.fold(
					function (a, b) { return a + b },
					0, iter);
			}

			return forall(
				"fold sum",
				[make.sequences],
				function (sequence) {

					return foldSum(sequence) === (
						function () {
							var sum = 0;
							for (var ith = 0; ith < sequence.length; ith++) {
								sum = sum + sequence[ith];
							}
							return sum
						}
					)()
				}
			);
		}),
		test("test that concatMap acts as a map function", function () {

			return forall(
				"indmap and concatMap are equivelant",
				[make.seqsAlong],
				function (sequence) {

					return allEqual(
						lambda.indMap(
							function (x) {return x * x},
							sequence),
						lambda.concatMap(
							function (x) {return x * x},
							sequence));
				}
			);
		}),
		test("test that concatMap concatenates", function () {

			return forall(
				"indmap and concatMap are equivelant",
				[make.seqsAlong],
				function (sequence) {

					return lambda.concatMap(
							function (x) {return [x, x]},
							sequence).length === (sequence.length * 2)
				}
			);
		}),
		test("test that select selects the correct values", function () {

			var isEven = function (n) {
				return n % 2 === 0
			}
			return forall(
				"select",
				[make.seqsAlong],
				function (sequence) {

					var evens = lambda.select(isEven, sequence);
					var evensControl = ( function () {

						result = [];
						for (var ith = 0; ith < sequence.length; ith++) {
							if (isEven(sequence[ith])) {
								result.push( sequence[ith] );
							}
						}
						return result;
					} )();

					return allEqual(evens, evensControl);
				} 
			)
		}),
		test("test that until works and terminates", function () {

			console.log("asdasdasd")

			return forall(
				"until terminates and whatnot",
				[make.positiveIntegers],
				function (upper) {

					lambda.until(
						function (xs) {
							return xs[xs.length - 1] > upper;
						},
						function (xs) {
							return xs.concat(xs[xs.length - 1] + 1);
						},
						[0]);
				}
			)

		}),
		test("multiplying a matrix by identity yields identity", function () {

			var I = Matrix([1, 0], [0, 1]);

			return forall(
				"matrices",
				[make.matrices],
				function (A) {
					var product = A.multiply(I);

					return allEqual(A.xs, product.xs) && 
						allEqual(A.ys, product.ys);
				});

		}),
		test("test a basic grammar", function () {

			var simpleGrammar = Grammar([
				{
					pattern: function (symbol) {
						return symbol === "a";
					},
					production: function (symbol) {
						return ["b", "c"];
					}
				},
				{
					pattern: function (symbol) {
						return symbol === "b";
					},
					production: function (symbol) {
						return ["c"];
					}
				}
			]); 

			var sentence = simpleGrammar.generate(["a"]);
			return allEqual(sentence, ["c", "c"]);
		})
	];

} )(is, lambda)
