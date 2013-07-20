
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

		var reduceSum = function (iter) {
			return lambda.fold(
				function (a, b) {
					return a + b
				},
				0,
				iter
			);
		}

		return reduceSum([0, 1, 2, 3, 4, 5]) === 15;
	}),
	test("test that concatMap acts as a map function", function () {

		var mapped = lambda.concatMap(function (x) {
			return x * x
		}, [1, 2, 3, 4]);

		return allEqual(mapped, [1, 4, 9, 16]);
	}),
	test("test that concatMap concatenates, not pushes", function () {

		return lambda.concatMap(
			function (x) {
				return [x, x];
			},
			[0, 1, 2, 3, 4]).length === 10
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
	test("double transposing a matrix returns the matrix", function () {

		var A = Matrix([1, 2], [3, 4]);

		var transpose = {
			once: A.transpose(),
			twice: A.transpose().transpose()
		};

		return allEqual(A.xs, transpose.twice.xs) && 
			allEqual(A.ys, transpose.twice.ys) &&
			!allEqual(A.xs, transpose.once.xs) &&
			!allEqual(A.ys, transpose.once.ys);

	})
];
