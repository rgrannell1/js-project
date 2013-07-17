
var allEqual = function (xs, ys) {

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
	test("test that indMap returns correct indices", function () {

		var indices = lambda.indMap(function (val, ind) {
			return ind
		}, ["a", "b", "c"]);

		return allEqual(indices, [0, 1, 2]);
	}),
	test("test that indMap returns correct values", function () {

		var values = lambda.indMap(function (val, ind) {
			return val * val
		}, [0, 1, 2, 3, 4])

		return allEqual(values, [0, 1, 4, 9, 16]);
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
	test("test that reduce sum is equal to normal sum", function () {

		var reduceSum = function (iter) {
			return lambda.reduce(
				function (a, b) {
					return a + b
				},
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
	})
];
