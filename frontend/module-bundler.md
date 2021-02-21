## 🌳 JS module bundler

사실 나는 webpack을 왜 쓰는지도 공부해본 적이 없다. webpack 외에 다른 선택지가 무엇이 있는지 알아보기 전에, 우선 JS 모듈 번들러가 무엇인지, 왜 사용하는지부터 알아봐야겠다. [이 글](https://lihautan.com/what-is-module-bundler-and-how-does-it-work/)을 참고하여 다시 정리하였다. 

### 🌳 모듈 번들러란?
모듈 번들러는 자바스크립트 모듈을 하나의 js 파일로 번들하여, 브라우저에서 실행할 수 있도록 한 것이다. 
    
### 🌳 모듈 번들러가 필요한 이유
- 브라우저가 모듈 시스템을 지원하지 않을 수 있다.
- 모듈들을 개발자가 작성한 의존 순서에 따라 로드하여 **의존성 관리**를 도와준다.
- image, css와 같은 asset들을 의존 순서에 따라 로드하게 해준다.


html은 파싱될 때, \<script> 태그에 있는 파일들을 http request로 요청하게 된다. 만약 다음과 같이 5개의 파일을 가져오려면, 총 5번의 http 요청을 해야 한다.

```htmlembedded
<html>
  <script src="/src/foo.js"></script>
  <script src="/src/bar.js"></script>
  <script src="/src/baz.js"></script>
  <script src="/src/qux.js"></script>
  <script src="/src/quux.js"></script>
</html>

```

하나의 파일로 번들하게 되면, 단 한 번만 파일을 요청하면 된다. 

```htmlembedded
<html>
  <script src="/dist/bundle.js"></script>
</html>
```

파일을 번들하는 과정에서 몇 가지 문제가 있다. 
1. 파일의 순서를 어떻게 관리할 것인가?
2. 파일 사이에서 이름이 충돌하는 것을 어떻게 막을 것인가?
3. 번들에서 사용하지 않는 파일을 어떻게 결정할 것인가?

이러한 문제들은 **각 파일간의 관계를 파악**하고 있으면 해결할 수 있다. 즉,
1. 파일과 파일간의 의존 관계를 파악하고
2. 파일에서 어떠한 인터페이스가 다른 파일에게도 노출 되었으며
3. 그 interface중 어떤 것이 다른 파일에 의해 사용되는지를 파악해야 한다. 

파일간의 관계를 설명하기 위한 방법으로 **JS 모듈 시스템**이 등장하게 되었다. `CommonJS`와 `ES6 modules`가 대표적이다. 



### 🌳 어떻게 하나의 번들 파일로 묶이는가?

 어떻게 번들하는지는 두 번들러 `webpack`과 `rollup` 가 번들하는 방식으로 살펴보자. 두 번들러는 완전히 다른 방식으로 번들링을 하게 된다. 

 세 개의 파일 circle.js, square.js, app.js 세 개의 파일이 있다고 하자.
     
```javascript
// filename: circle.js
const PI = 3.141;
export default function area(radius) {
  return PI * radius * radius;
}
```

```javascript
// filename: square.js
export default function area(side) {
  return side * side;
}
```

```javascript
// filename: app.js
import squareArea from './square';
import circleArea from './circle';
console.log('Area of square: ', squareArea(5));
console.log('Area of circle', circleArea(5));
```

#### webpack 방식

```javascript
// filename: webpack-bundle.js
const modules = {
  'circle.js': function(exports, require) {
    const PI = 3.141;
    exports.default = function area(radius) {
      return PI * radius * radius;
    }
  },
  'square.js': function(exports, require) {
    exports.default = function area(side) {
      return side * side;
    }
  },
  'app.js': function(exports, require) {
    const squareArea = require('square.js').default;
    const circleArea = require('circle.js').default;
    console.log('Area of square: ', squareArea(5))
    console.log('Area of circle', circleArea(5))
  }
}

webpackStart({
  modules,
  entry: 'app.js'
});
```
웹팩 방식에서 주목할만한 **특징**이 있다. 

1. `module map`
    모듈 맵은 모듈 이름과 함수로 감싸진 모듈을 매핑시켜주는 딕셔너리이다. 모듈 맵은 쉽게 모듈을 등록할 수 있게 한다.
    
2. 각 모듈들은 **함수로 감싸져** 있다.
    각 모듈을 함수 안에 넣음으로써, **모듈 스코프**를 만들게 된다. 모듈 스코프 안에서 선언된 모든 것들은 그 자체로 스코프를 갖게 된다. 이러한 역할을 하는 함수를 `module factory function`이라고 한다. 이 함수는 'exports'와 'require'을 파라미터로 받는다. 이 두 가지가 모듈이 인터페이스를 export하고 require로 다른 모듈로부터 인터페이스를 가져올 수 있게 한다. 
    
    모듈에 스코프를 만드는 이유는 브라우저에서는 파일 단위의 스코프가 없기 때문인 것 같다. 만약 모듈 스코프를 만들어주지 않으면, 모듈 간 변수 이름이 같을 때, 의도하지 않게 변수 이름을 덮어씌우는 문제가 발생하기 때문일 것 같다.  
    
3. 애플리케이션은 모든 것들을 하나로 붙여주는 `webpackStart` 함수로 시작된다. 

```javascript
// filename: webpack-bundle.js

function webpackStart({ modules, entry }) {
  const moduleCache = {};
  const require = moduleName => {
    // if in cache, return the cached version
    if (moduleCache[moduleName]) {
      return moduleCache[moduleName];
    }
    const exports = {};
    // this will prevent infinite "require" loop
    // from circular dependencies
    moduleCache[moduleName] = exports;

    // "require"-ing the module,
    // exported stuff will assigned to "exports"
    modules[moduleName](exports, require);
    return moduleCache[moduleName];
  };

  // start the program
  require(entry);
}
```


`webpackStart`함수는 런타임에 모든 모듈을 하나로 묶어준다. 

이 함수는 'module map'과 엔트리 모듈을 사용하여 애플리케이션을 시작하게 된다. 이 함수는 'require 함수'와 'moduleCache'를 정의하게 된다.  

여기서의 'require'함수는 CommonJS의 require과 다르다. 여기서의 'require'함수는 모듈 이름을 받아서, 모듈에서 export된 인터페이스를 반환하게 된다. 

export된 인터페이스는 모듈 캐쉬에 캐싱된다. 따라서 같은 모듈 이름을 반복적으로 'require'하여도, 'module factory function'은 한 번만 실행되게 된다. 

- ✨ 언제 웹팩을 쓰면 좋을까?

    웹팩은 각 모듈을 함수로 감싸고, 브라우저 친화적인 `require` 구현과 함께 번들에 모듈을을 넣고, 모듈들을 하나씩 처리한다. 

    만약, on-demand loading과 같은 것이 필요하다면 웹팩이 좋은 선택이다. 그렇지 않은 경우엔, 약간의 낭비가 있으며, 많은 모듈이 있을 때는 더 안좋을 수 있다. 그에 대한 참고 자료는 이 [링크](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)를 클릭하면 된다. 


#### Rollup 방식

Rollup은 **ES6 모듈 방식의 장점**을 살려, flat한 번들 파일을 빌드하게 된다. 

```javascript
// filename: rollup-bundle.js
const PI = 3.141;

function circle$area(radius) {
  return PI * radius * radius;
}

function square$area(side) {
  return side * side;
}

console.log('Area of square: ', square$area(5));
console.log('Area of circle', circle$area(5));

```

롤업 방식의 특징을 알아보자. 

1. 웹팩에 비해 번들 파일이 더 작다. 
    롤업에서 **모든 모듈들은 번들 파일에 'flatten'된다**. 모듈을 감싸서 스코프를 만들어주는 함수도 없고, 모듈 맵도 없다. 

    모든 변수와 함수는 전역 스코프에 선언된다.

    그렇다면, 만약 두 모듈이 같은 이름의 변수나 함수를 선언하면 어떻게 될까?
    rollup은 변수명이나 함수명이 충돌하는 것을 막기 위해, **변수나 함수 이름을 바꾸게 된다.** 

    위 예제를 보면, circle.js와 square.js 둘 다 area 함수를 선언하였는데, 번들 파일에서는 그 이름이 바뀐 것을 알 수 있다. 


2. 번들 안에서 모듈의 순서가 중요하다. 
    circle$area 함수와 square$area 함수 같은 경우는 호이스팅이 되므로, console.log 이후에 와도 괜찮을 수 있다. 그러나, PI 변수는 TDZ 때문에, console.log 전에 선언되어야 한다. 
    

롤업 방식이 웹팩 방식보다 더 작은 번들 파일과, 모든 함수를 제거함으로써 런타임 오버헤드를 줄여준다는 점에서는 좋다. 

그러나 롤업에도 단점이 있다. **순환 의존 관계**가 있을 경우엔 잘 동작하지 않을 수 있다. 

```javascript
// filename: shape.js
const circle = require('./circle');

module.exports.PI = 3.141;

console.log(circle(5));
```

```javascript
// filename: circle.js
const PI = require('./shape');

const _PI = PI * 1

module.exports = function(radius) {
  return _PI * radius * radius;
}
```

여기 두 파일은 서로를 의존하고 있다. 따라서 rollup은 번들 파일에 어떠한 모듈을 먼저 두어야 할지는 올바른 정답이 존재할 수 없다. 

따라서 다음과 같은 번들 파일이 만들어질 수 있다.

```javascript
// filename: rollup-bundle.js
// cirlce.js first
const _PI = PI * 1; // throws ReferenceError: PI is not defined
function circle$Area(radius) {
  return _PI * radius * radius;
}

// shape.js later
const PI = 3.141;
console.log(circle$Area(5));
```

\_PI 변수는 TDZ에 있는 PI 변수를 참조하려 하므로 Reference Error를 발생시킨다. 이러한 문제를 해결할 뾰족한 수는 없다. 따라서 롤업은 이렇게 순환 의존을 하는 경우, 경고를 띄우게 된다.

일단 위의 문제를 해결하기 위해서는 \_PI의 계산을 lazy하게 하면 된다.

```javascript
// filename: circle.js
const PI = require('./shape');
const _PI = () => PI * 1; // to be lazily evaluated
module.exports = function(radius) {
  return _PI() * radius * radius;
}
```

위에처럼 \_PI를 lazy하게 계산되도록 하면, 두 모듈의 순서는 중요하지 않게 된다. 
\_PI가 계산되는 시점에는 PI가 정의되어있기 때문이다. 

```javascript
// filename: rollup-bundle.js
// cirlce.js first
const _PI = () => PI * 1;
function circle$Area(radius) {
  return _PI() * radius * radius;
}

// shape.js later
const PI = 3.141;
console.log(circle$Area(5)); // prints 78.525
```


- ✨ Rollup의 장점과 단점

    롤업은 모든 코드를 한 곳에 두고, 한 번에 계산하게 한다. 이는 더 간단한 코드를 만들어서, 더 빠르게 시작할 수 있게 한다. 

    그러나 롤업은 hot module replacement(HMR)을 지원하지 않는다.
    HMR이란, 브라우저를 새로 고치지 않아도 빌드된 결과물이 웹앱에 실시간으로 반영될 수 있게 해주는 설정이다. 





### 🌳 정리

- 모듈 번들러는 여러 자바스크립트 모듈을 하나의 자바스크립트 파일로 묶어준다. 
- 번들러마다 번들하는 방식이 다르다.
    - webpack 방식
        - module map을 사용한다.
        - 각 모듈을 함수로 감싼다.
        - 모든 모듈들을 하나로 묶어주는 런타임 코드가 있다.
    - rollup 방식
        - 모든 모듈이 하나의 번들파일에 flatten된다. 
        - 웹팩에 비해 번들이 작다.
        - 의존 관계에 따라 순서를 정렬하는 것이 중요하다.
        - 순환 의존 관계에 의해서는 제대로 동작하지 않을 수 있다.
    



