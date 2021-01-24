# 이벤트 루프와 태스크 큐 (마이크로 태스크, 매크로 태스크)

자바스크립트는 싱글 스레드 기반의 언어이고, 자바스크립트 엔진은 하나의 호출 스택만을 사용한다. 이는 요청이 **동기적**으로 처리되어, 한 번에 한 가지 일만 처리할 수 있음을 의미한다.

만약, 네트워크 요청과 같은 비동기 함수가 동기적으로 이루어지는 함수로 만들어졌다면, 어떤 일이 일어날까?

네트워크 요청이 다른 서버로 보내지고, 컴퓨터는 응답 받기를 기다리며 느려질 것이다. 그 사이에 클릭이나, 다른 요소가 렌더링이 되어져야 하는게 있더라도, 스택은 네트워크 요청 함수에 블락킹 되어있으므로, 아무 일도 일어나지 않게 된다.

이러한 문제는 **비동기 콜백**을 사용함으로써 해결된다. 비동기 요청은 자바스크립트 엔진을 구동하는 환경인 브라우저나 Node.js에서 처리된다.

### 브라우저 환경의 구조

<img width=70% src='https://i.imgur.com/1oCFAbj.png' />

- **자바스크립트 엔진**
  - **Heap** : 객체들은 힙 메모리에 할당된다. 크기가 동적으로 변하는 값들의 참조 값을 갖고 있다.
  - **Call Stack** : 함수 호출 시, 실행 컨텍스트가 생성되며, 이러한 실행 컨텍스트들이 콜 스택을 구성한다.
- **Web API or Browser API**
  - 웹 브라우저에 구현된 API이다.
  - DOM event, AJAX, Timer 등이 있다.
- **이벤트 루프**
  - 콜 스택이 비었다면, 태스크 큐에 있는 모든 콜백 함수를 처리한다.
- **태스크 큐**
  - 이벤트 루프는 하나 이상의 태스크 큐를 갖는다.
  - 태스크 큐는 **태스크의 Set**이다.
  - 이벤트 루프가 큐의 첫 번째 태스크를 가져오는 것이 아니라, 태스크 큐에서 실행 가능한(runnable) 첫 번째 태스크를 가져오는 것이다. 태스크 중에서 가장 오래된 태스크를 가져온다.
    > Task queues are **sets, not queues**, because step one of the event loop processing model **grabs the first runnable task from the chosen queue**, instead of dequeuing the first task.

### Node.js 환경의 구조

![](https://i.imgur.com/FecAm36.png)

Node.js 는 비동기 IO를 지원하기 위해 `libuv`라이브러리를 사용한다. 이 libuv가 이벤트 루프를 제공한다.

## 이벤트 루프

브라우저와 Node.js에서 공통으로 제공하는 것이 '이벤트 루프'이다. 자바스크립트는 싱글 스레드 기반의 언어이지만, 자바스크립트가 구동되는 환경(Node.js, 브라우저)은 여러 스레드가 사용된다. 여러 스레드가 사용되는 구동 환경이 자바스크립트 엔진과 연동하기 위해 사용되는 장치가 '이벤트 루프'이다.

웹 사이트나 애플리케이션의 코드는 **메인 스레드**에서 실행되며, **같은 이벤트 루프를 공유한다.** 메인 스레드는 사이트의 코드를 실행시킬 뿐만 아니라, 이벤트들을 받고 실행시키거나, 웹 컨텐츠를 렌더링하거나 페인팅 하는 일들을 한다. 즉, 이벤트 루프는 스레드 안에 있는 코드들을 스케쥴링하고 실행시키는 역할을 담당한다.

이벤트 루프는 세 가지 종류가 있다.

- **window event loop**
  - 같은 origin인 모든 윈도우는 윈도우 이벤트 루프를 공유한다.
  - 모든 윈도우들은 동기적으로 소통할 수 있게 된다.
- **worker event loop**
  - window event loop와는 독립적으로 실행된다.
- **worklet event loop**

## 마이크로 태스크와 매크로 태스크 (microtask, macrotask)

![](https://uploads.disquscdn.com/images/9466d8aa53fc5b3e63a92858a94bb429df02bbd20012b738f0461343beaa6f90.gif?w=600&h=272)

태스크 큐는 구체적으로 마이크로 태스크큐와 매크로 태스크큐로 나뉘어진다. '매크로 태스크 큐'는 '이벤트 큐'라고도 불리고, '마이크로 태스크 큐'는 '잡 큐(Job Queue)'라고도 불린다.
API에 따라 마이크로 태스크 큐를 사용하거나, 매크로 태스크 큐를 사용한다.

> **macrotasks**: setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering
> **microtasks**: process.nextTick, Promises, queueMicrotask(f), MutationObserver

## 이벤트 루프의 동작 방식

![](https://i.imgur.com/sEf4Opl.png)

이벤트 루프는 다음을 반복한다.

1. 매크로태스크 큐에서 가장 오래된 태스크를 꺼내서 실행시킨다.
2. 마이크로 태스크 큐에 있는 모든 태스크를 실행시킨다.
3. 렌더링 작업을 실행한다.
4. 매크로 태스크 큐에 새로운 매크로 태스크가 나타날 때까지 기다린다.
5. 1번으로 돌아간다.

### 예시

![](https://uploads.disquscdn.com/images/fb98edb750d6839fbc9958548f3b2a97e26f30fa5f529b8a9fed296c7a71a2d8.gif?w=800&h=405)

다음 코드를 보고 결과를 예상해보자.

```javascript
console.log("script start"); // A

setTimeout(function () {
  // B
  console.log("setTimeout");
}, 0);

Promise.resolve()
  .then(function () {
    // C
    console.log("promise1");
  })
  .then(function () {
    // D
    console.log("promise2");
  });

console.log("script end"); // E
```

```
script start
script end
promise1
promise2
setTimeout
```

코드는 위에서부터 차례로 실행된다. [이곳](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)에서 실행되는 과정을 step-by-step으로 확인할 수 있다.

1. 콜 스택에는 전역 실행 객체가 있고, '스크립트 실행'이라는 태스크가 매크로 태스크 큐에 들어있다.
2. 이벤트 루프는 매크로 태스크 큐에 있는 '스크립트 실행' 태스크를 실행한다.
3. A에 도달하면, 'script start'가 출력된다.
4. B에 도달하면, setTimeout web api가 타이머를 실행시키고, 타이머가 종료되면 콜백 함수가 매크로 태스크 큐에 들어간다.
5. C에 도달하면, 콜백 함수가 마이크로 태스크 큐에 들어간다.
6. E에 도달하면, 'script end'가 출력된다.
7. 콜 스택이 비었으므로, 이벤트 루프는 마이크로 태스크 큐에 있는 프라미스 콜백 함수를 실행시킨다.
8. 'promise 1'이 출력된다.
9. Promise.then 메서드는 D 콜백 함수를 마이크로 태스크 큐에 등록한다.
10. 이벤트 루프는 다음 마이크로 태스크인 D 콜백 함수가 실행시킨다.
11. 'promise 2'가 출력된다.
12. 렌더링할 것이 있으면, 브라우저는 렌더링을 한다.
13. 매크로 태스크 큐에 있는 setTimeout 콜백함수를 실행시킨다.
14. 'setTimeout'이 출력된다.

### 마이크로 태스크 vs 매크로 태스크

이벤트 루프가 마이크로 태스크 큐와 매크로 태스크 큐에 있는 것을 실행시키는 것에 차이가 있다. 과정 9, 10을 보면, 마이크로 태스크가 실행된 후, 새로운 마이크로 태스크인 콜백 C를 추가하고 그것을 실행시키는 것을 알 수 있다.

**마이크로 태스크들은 실행하면서 새로운 마이크로 태스크를 큐에 추가할 수도 있다. 새롭게 추가된 마이크로 태스크도 큐가 빌 때까지 계속해서 실행된다.**

반대로, 이벤트 루프는 매크로 태스크 큐에 있는 것을 실행시키기 시작할 때 있는 매크로 태스크만 실행시킨다. 매크로 태스크가 추가한 매크로 태스크는 다음 이벤트 루프가 실행될 때까지 실행되지 않는다.

## 참고

- [자바스크립트와 이벤트 루프 - TOAST](https://meetup.toast.com/posts/89)
- [JavaScript Event Loop Explained](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4)
- [The JavaScript Event Loop: Explained](https://blog.carbonfive.com/the-javascript-event-loop-explained)
- [html spec - event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- [마이크로태스크 큐 - ko.javascript](https://ko.javascript.info/microtask-queue)
- [Difference between microtask and macrotask within an event loop context - stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
- [In depth: Microtasks and the JavaScript runtime environment - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
- [Let’s spin the event loop](https://medium.com/javascript-in-plain-english/lets-spin-the-event-loop-by-ashish-mishra-8ec4d1412376)
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [이벤트 루프와 매크로·마이크로태스크 - ko.javascript](https://ko.javascript.info/event-loop)
