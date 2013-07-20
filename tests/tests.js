
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

var testSuite = [
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
		var evens = lambda.select(isEven, [1, 2, 3, 4, 5, 6]);
		return allEqual(evens, [2, 4, 6]);

	}),
	test("test that until works and terminates", function () {

		lambda.until(
			function (x) {
				return x === 10;
			},
			function (x) {
				return x + 1;
			},
			[1]
		);

		var oneToTen = lambda.until(
			function (x) {
				return x.length === 10;
			},
			function (x) {
				var max = x[x.length - 1];
				return x.concat(max + 1);
			},
			[1]
		);

		return allEqual(oneToTen, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	}),
	test("multiplying a matrix by identity yields identity", function () {

		var A = Matrix([1, 2], [3, 4]);
		var I = Matrix([1, 0], [0, 1]);

		var res = A.multiply(I);
		return allEqual(A.xs, res.xs) && allEqual(A.ys, res.ys);
	}),
	test("test that basic grammars", function () {
		return false;
	})
];
