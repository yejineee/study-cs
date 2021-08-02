const { test, expect } = require("@jest/globals");
const { findCommonFactor, solution } = require("./buckets-of-marbles");

test("두 배열을 넘겨주면, 그에 대한 공약수를 찾아준다.", () => {
  expect(
    findCommonFactor([1, 2, 3, 4, 6, 12], [1, 2, 3, 4, 6, 8, 12, 24])
  ).toEqual([1, 2, 3, 4, 6, 12]);
});

test("두 수를 넘겨주면, 그에 대한 공약수를 찾아준다.", () => {
  expect(solution(3452, 5232)).toEqual([1, 2, 4]);
});
