# Web Worker란

## single-threaded JS의 한계

비동기 프로그래밍을 통해 UI는 블락되지 않고 실행될 수 있다. 그렇다면, Web API를 사용하지 않는 일반 코드가 CPU를 많이 사용하는 경우엔 어떨까?

```javascript
let i = 0;
while (i < 10 ** 10) {}
```

위의 코드가 실행되는 동안, 다른 코드들은 실행될 수 없으므로 페이지가 멈춰지는 현상이 발생한다.

이것이 single-thread인 자바스크립트의 한계이다. HTML5에 추가된 web worker는 이러한 한계를 해소시켜준다.

Web Worker는 메인 스레드가 아닌 **새로운 thread**에서 parallel하게 실행된다. 상당히 오랜 시간 동안 계산이 필요한 작업을 web worker를 사용하여 백그라운드에서 계산하도록 한다면, UI가 블락되는 일은 발생하지 않는다.

## Web Workers의 종류

web worker는 세 종류가 있다.

- **Dedicated Workers**
  web worker를 호출한 스크립트에서만 접근할 수 있다.

- **Shared Workers**
  같은 origin에서 동작하는 여러 프로세스에서 접근할 수 있다. 다른 브라우저 탭, iframe, 심지어는 worker에서도 접근할 수 있다.

- **Service Worker**
  event driven 워커이다.

## Web Workers 동작 방식

웹 워커는 브라우저에서 독립된 스레드에서 동작한다. 따라서 웹 워커로 동작할 코드를 다른 파일에 적어야 한다.

웹 워커를 만드는 방식은 다음과 같다.

```javascript
const myWorker = new Worker("worker.js");
```

worker.js 파일이 존재하고, 접근가능하다면, 브라우저는 새로운 스레드를 만들어내서, 비동기적으로 해당 파일을 다운로드한다.

생성된 웹 워커를 시작하게 하려면, `postMessage` 메서드를 사용해야 한다.

```javascript
// main thread
myWorker.postMessage([first, second]);
```

웹 워커에서는 `onmessage` 메서드로 데이터를 받을 수 있다. 메세지는 event 객체의 data 속성에 넘어오게 된다.

웹 워커에서도 postMessage로 메시지를 전달할 수 있다.

```javascript
//worker.js
onmesesage = function (e) {
  const [first, second] = [e.data[0], e.data[1]];
  postMessage("send from web worker");
};
```

메인 스레드에서는 웹 워커에서 전달한 메시지를 마찬가지로 `onmessage`로 받을 수 있다.

```javascript
myWorker.onmessage = function (e) {
  const response = e.data;
};
```

워커를 종료시킬 때는 main thread에서 `myWorker.terminate()`로 종료시키거나, 워커에서 `close()`를 호출하여 스스로 종료시킬 수 있다.

웹 워커와 메인 스레드 사이에서 전달되는 메세지는 공유되는 것이 아니다. 메세지는 복사되거나 전달된다.

**메세지가 복사되는 경우**, 직렬화(serialized)되어 복사된후, 전달되고, 다시 역직렬화(deserialized)된다. 대부분의 브라우저가 이 방식을 JSON encoding/decoding 하는 식으로 구현한다. 이러한 방식은 메시지가 전송되는데, 상당히 큰 오버헤드가 발생하게 된다. 따라서 메세지가 클 수록, 전달하는데 더 오래걸린다.

**메세지가 전달될 경우**, 메시지를 보낸 쪽에서는 그 값을 사용할 수 없다. 이 방식은 오직 ArrayBuffer만 전송할 수 있다는 한계가 있다.

## 웹 워커의 한계

웹 워커에서 직접 DOM 조작을 할 수 없고, window 객체의 메서드나 속성을 사용할 수 없다. 웹 워커에서 사용할 수 있는 API는 [이 사이트](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers)에서 확인할 수 있다.

## 웹 워커를 사용하면 좋은 경우

- 암호화
- 데이터를 미리 fetch하기
  - data를 로드해오는 시간을 개선하고, 웹 사이트를 최적화하기 위해 웹 워커로 데이터를 미리 로드해서 저장할 수 있다.

## 참고

- [How JavaScript works: The building blocks of Web Workers + 5 cases when you should use them](https://blog.sessionstack.com/how-javascript-works-the-building-blocks-of-web-workers-5-cases-when-you-should-use-them-a547c0757f6a)
- [웹 워커 사용하기 - MDN](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API/basic_usage)
