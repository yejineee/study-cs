# 자바스크립트의 메모리 관리

C와 같은 low level 언어는 malloc(), free() 같은 것으로 직접 메모리 관리를 해주어야 한다. 반대로, 자바스크립트는 객체가 생성되었을 때 메모리 할당이나, 더이상 사용되지 않을 때 메모리 해제시켜주는 작업을 자동으로 해준다.

## ✏️ 메모리 생명 주기

메모리 생명 주기는 다음과 같다.

> 1. 메모리 할당
> 2. 할당된 메모리 사용 (쓰기, 읽기)
> 3. 더이상 사용되지 않을 때, 할당된 메모리 해제

1, 3 단계는 로우레벨 언어에서는 명시적으로 해야 하지만, 자바스크립트와 같은 하이레벨 언어에서는 대부분 명시적으로 하지 않는다.

### 1. JS에서 메모리 할당

- **값 초기화 (Value Initialization)**

값이 처음 선언되었을 때, JS는 자동으로 메모리를 할당한다.

```javascript
var n = 123; // allocates memory for a number
var s = "azerty"; // allocates memory for a string

var o = {
  a: 1,
  b: null,
}; // allocates memory for an object and contained values

// (like object) allocates memory for the array and
// contained values
var a = [1, null, "abra"];

function f(a) {
  return a + 2;
} // allocates a function (which is a callable object)

// function expressions also allocate an object
someElement.addEventListener(
  "click",
  function () {
    someElement.style.backgroundColor = "blue";
  },
  false
);
```

- **함수 호출을 통한 할당**

어떠한 함수 호출의 결과로 메모리 할당이 일어난다.

```javascript
var d = new Date(); // allocates a Date object

var e = document.createElement("div"); // allocates a DOM element
```

어떠한 메서드는 새로운 값이나 객체를 할당한다.

```javascript
var s = "azerty";
var s2 = s.substr(0, 3); // s2 is a new string
// Since strings are immutable values,
// JavaScript may decide to not allocate memory,
// but just store the [0, 3] range.

var a = ["ouais ouais", "nan nan"];
var a2 = ["generation", "nan nan"];
var a3 = a.concat(a2);
// new array with 4 elements being
// the concatenation of a and a2 elements.
```

### 2. 값 사용하기

값을 사용한다는 것은 할당된 메모리에서 읽고 쓴다는 것을 의미한다.

### 3. 메모리 해제 (가비지 컬렉션)

자바스크립트와 같은 고수준 언어는 가비지 컬렉션(GC)라고 하는 자동 메모리 관리 방법을 사용한다.
가비지 컬렉터의 목적은 메모리 할당을 모니터하고, 할당된 메모리가 더 이상 필요 없는지 판단하여, 그 메모리를 다시 사용할 수 있게 하는 것이다. 이 자동 메모리 관리는 완벽하지는 않다. 그 메모리가 여전히 필요한지 아닌지를 결정하는 문제는 true/false로 결정할 수 있는 문제가 아니기 때문이다.

## ✏️ 가비지 컬렉션 (GC)

이제 가비지 컬렉션 알고리즘과 그 한계를 이해하기 위해 반드시 알아야 하는 개념을 설명하겠다.

### 1. 참조

가비지 컬렉션 알고리즘이 의존하는 주요 개념은 **참조**이다.
메모리 관리 측면에서, A 객체가 B객체에 접근할 수 있다면, A객체는 B객체를 참조한다고 한다.
예를들어, 자바스크립트 객체는 prototype을 암시적으로 참조하고 있고, 그 객체의 프로퍼티 값을 명시적으로 참조한다.

여기서 '객체'(object)라는 개념은 일반적인 자바스크립트의 객체를 넘어서, 함수 스코프를 포함한다.

### 2. Reference-counting garbage collection

가장 단순한 가비지 컬렉션 알고리즘이다.
어떠한 객체를 참조하는 다른 객체가 하나도 없다면, 그 객체를 '가비지' 혹은 회수 가능하다고 한다.

```javascript
var x = {
  a: {
    b: 2,
  },
};

var y = x; // The 'y' variable is the second thing that has a reference to the object.

x = 1; // Now, the object that was originally in 'x' has a unique reference
//   embodied by the 'y' variable.

var z = y.a; // Reference to 'a' property of the object.
//   This object now has 2 references: one as a property,
//   the other as the 'z' variable.

y = "mozilla"; // The object that was originally in 'x' has now zero
//   references to it. It can be garbage-collected.
//   However its 'a' property is still referenced by
//   the 'z' variable, so it cannot be freed.

z = null; // The 'a' property of the object originally in x
//   has zero references to it. It can be garbage collected.
```

- **한계 : 순환 참조**

함수 내에 두 객체는 서로를 참조하고 있으며, 순환 참조를 이룬다. 함수 호출이 종료되면, 두 객체는 스코프를 벗어나며, 더이상 필요 없으므로 할당된 메모리는 해제되어야 한다. 그러나, reference-counting 알고리즘은 두 객체가 서로를 참조하고 있기에, 회수해야 한다고 생각하지 않으며, 가비지 컬렉션의 대상이 되지 않는다.

```javascript
function f() {
  var x = {};
  var y = {};
  x.a = y; // x references y
  y.a = x; // y references x

  return "azerty";
}

f();
```

- 실제 예제

IE 6, 7은 DOM 객체에 reference-counting 가비지 컬렉터를 사용한다. 순환으로 인하여 메모리 누수가 발생한다.

```javascript
var div;
window.onload = function () {
  div = document.getElementById("myDivElement");
  div.circularReference = div;
  div.lotsOfData = new Array(10000).join("*");
};
```

div는 자기 자신을 참조, 즉 순환 참조를 하고 있다. 따라서, circularReference값이 명시적으로 지워지거나, null이 되지 않는 이상, div는 하나 이상의 참조를 갖게 된다. 이 경우 DOM element가 DOM 트리에서 제거되더라도, 메모리에는 DOM element가 남아있게 된다. 만약, DOM element가 많은 데이터를 갖고 있다면, 이 데이터에 의해 소모되는 메모리는 절대 해제되지 않으며, 브라우저가 점점 느려지는 문제와 같은 메모리 관련 이슈로 이어지게 된다.

### 3. Mark-and-sweep algorithm

이 알고리즘에서 '객체가 더이상 사용되지 않는다'는 것을 **닿을 수 없는 객체**로 정의한다.

![](https://upload.wikimedia.org/wikipedia/commons/4/4a/Animation_of_the_Naive_Mark_and_Sweep_Garbage_Collector_Algorithm.gif)

이 알고리즘은 루트의 집합을 갖고 있다. 자바스크립트에서 루트는 **전역 객체** 이다. 주기적으로, 가비지 컬렉터는 루트에서부터 시작하여 참조될 수 있는 모든 객체를 찾는다. 결국, 가비지 컬렉터는 모든 _닿을 수 있는 객체_ 를 찾게 되고, 닿을 수 없는 객체들을 모으게 된다.

이 알고리즘은 **순환 참조를 문제를 해결**한다. 왜냐하면 모든 '참조되지 않는 객체'는 '닿을 수 없는 객체'이기 때문이며, 그 역은 성립하지 않기 때문이다.

2012년 기준으로 모든 최신 브라우저는 mark-and-sweep 알고리즘을 사용하고 있다.

- **한계: 수동 메모리 해제**

언제 어떤 메모리가 해제될지를 직접 결정하는 것이 더 편리할 때도 있다. 메모리를 해제하기 위해서는, 명시적으로 닿을 수 없도록 하는 기능이 있어야 한다.

2019년에는, 자바스크립트에서 명시적으로 가비지 컬렉션을 할 수 없다.

## 참조

- [Memory_Management - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [File:Animation of the Naive Mark and Sweep Garbage Collector Algorithm.gif](https://commons.wikimedia.org/wiki/File:Animation_of_the_Naive_Mark_and_Sweep_Garbage_Collector_Algorithm.gif)
