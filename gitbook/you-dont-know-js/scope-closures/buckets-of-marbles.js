/*
## 주제 : 두 수의 최대 공약수 구하기
## 날짜 : 2020/12/29
## 조건
1. If you color all the scopes (including the global scope!) different colors, you need at least six colors. 
Make sure to add a code comment labeling each scope with its color. ✅
global scope를 포함하여 적어도 6개의 스코프를 색칠하라  - 스코프에 컬러를 붙여서 라벨링을 한 주석을 남겨라

BONUS: identify any implied scopes your code may have.

2. Each scope has at least one identifier. ✅
각 스코프는 적어도 하나의 식별자를 갖고 있다. 

3. Contains at least two function scopes and at least two block scopes. ✅
적어도 2개의 함수 스코프와 적어도 2개의 블록 스코프가 있어야 한다. 

4. At least one variable from an outer scope must be shadowed by a nested scope variable (see Chapter 3).
적어도 외부 스코프에 있는 하나의 변수는 중첩된 스코프의 변수에 의해 shadow되어야 한다. ✅

5. At least one variable reference must resolve to a variable declaration at least two levels higher in the scope chain.
적어도 하나의 변수에 대한 참조는 두 레벨 이상의 변수 정의에 의해 resolve되어야 한다. ✅
*/

// Red(1)
const a = 12;
const b = 18;

function getFindFactorFunc(num) {
  // Blue(2)

  var i = Math.floor(Math.sqrt(num)); // function scope
  return function () {
    // Yellow (3)
    var factor = []; // function scope
    if (!Number.isInteger(num)) {
      //purple(4)
      throw Error("정수가 아닌 값은 약수를 구할 수 없습니다.");
    }
    for (let k = i; k >= 1; k--) {
      //green(5)
      if (num % k !== 0) {
        // gray(6);
        continue;
      }
      factor.push(k);
      factor.push(num / k);
    }
    return factor;
  };
}

function findCommonFactor(a, b) {
  // brown(7)
  // shadowed variable
  const ascOrderFunc = (a, b) => {
    // orange(8)
    // block scope
    return a - b;
  };
  const commonFactor = a.filter((fa) => b.some((fb) => fb === fa));
  return commonFactor.sort(ascOrderFunc);
}

function solution(a, b) {
  // ivory(9)
  const findFactorA = getFindFactorFunc(a);
  const findFactorB = getFindFactorFunc(b);
  const commonFactor = findCommonFactor(findFactorA(), findFactorB()); // block scope
  return commonFactor;
}

console.log(solution(a, b));

module.exports = {
  findCommonFactor,
  solution,
};
