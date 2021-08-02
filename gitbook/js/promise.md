# 프라미스 Promise

## 프라미스는 성공 또는 실패만 한다.

exeucutor는 프라미스의 상태를 이행(fulfilled) 또는 거부(rejected)로 변경시킨다.

![](https://i.imgur.com/GDJBNRw.png)

성공 혹은 실패만 한다. resolve나 reject가 되어 상태가 결정되면, 이후로는 상태를 변경할 수 없다.
처리가 끝난 프라미스에 resolve나 reject가 호출되면 무시된다.

```javascript
const testMultipleResolve = new Promise((resolve, reject) => {
  resolve("done")
  reject(new Error("error")) // 무시
  setTimeout(() => reject("error2"), 10) // 무시
})
;(async () => {
  try {
    console.log(await testMultipleResolve) // 'done'
  } catch (e) {
    console.log(e)
  }
})()
```

## resolve, reject 함수 즉시 호출하기

executor에서 꼭 비동기 연산을 수행한 후, resolve나 reject를 호출하지 않아도 된다.
resolve나 reject를 즉시 호출해도 된다.

```javascript
const immediatePromise = new Promise((resolve, reject) => {
  resolve("done immediately")
})
;(() => {
  console.log(promise) // Promise { <pending> }
  console.log(immediatePromise) // Promise { 'done immediately' }
})()
```

# 소비자 : then, catch, finally

- 프라미스 객체 : executor와 소비 함수를 이어주는 역할
- 소비함수는 .then, .catch, .finally 메서드를 사용하여 등록

## then

- 두 개의 콜백 함수를 인수로 받는다.
- 첫 번째 콜백은 이행되었을 때 실행된다. resolve의 값을 받는다.
- 두 번째 콜백은 거부되었을 때 실행된다. reject의 에러를 받는다.

```javascript
promise.then(
  function (result) {
    /* 결과(result)를 다룹니다 */
  },
  function (error) {
    /* 에러(error)를 다룹니다 */
  }
)
```

- 예제

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 10)
})
const rPromise = new Promise((resolve, reject) => {
  setTimeout(() => reject("error"), 10)
})

;(async () => {
  promise.then(
    (result) => console.log(`result1 : ${result}`), // result1 : done
    (error) => console.error(`reject1 ${error}`) // 실행되지 않음
  )
  rPromise.then(
    (result) => console.log(`result2 : ${result}`), // 실행되지 않음
    (error) => console.error(`reject2 ${error}`) // reject2 error
  )
})()
```

## catch

- 내부적으로 `.then(undefined, onRejectedFunction)`을 호출한다.
- catch는 프라미스를 반환한다.
  - onRejected 핸들러 안에서 `throws`가 있거나, `Promise.rejected`를 반환하면 catch가 반환하는 프라미스는 reject된다.

### catch에서 Error 객체 반환하기

catch에서 단순히 string을 throwing하는 것 보다,
**Error 인스턴스를 throwing하는게 더 좋다.**
Error 인스턴스를 반환해야 stack trace와 같은 결과를 확인할 수 있다.

```javascript
Promise.reject(new Error("error instance")).catch((e) => console.error(e))
Promise.reject("just string error").catch((e) => console.error(e))
```

```
Error: error instance
    at Object.<anonymous> (/Users/kakao/study/js/promise.js:79:16)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
    at internal/main/run_main_module.js:17:47
just string error
```

## finally

- 인자를 받지 않는다. 프라미스가 이행된 것인지, 거부된 것인지 확인할 수 있는 확실한 방법이 없기 때문이다.
- 프라미스가 이행 또는 거부되면, finally의 콜백이 실행된다.
- 프라미스의 결과에 상관없이 실행되어야하는 cleanup함수나 연산을 해야할 때 finally를 사용하면 좋다.
- finally가 설정한 함수가 반환하는 프라미스를 반환한다.

```javascript
function checkMail() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Mail has arrived")
    } else {
      reject(new Error("Failed to arrive"))
    }
  })
}

checkMail()
  .finally(() => {
    console.log("Experiment completed")
  })
  .then((mail) => {
    console.log(mail)
  })
  .catch((err) => {
    console.error(err)
  })
```

```
Experiment completed
Mail has arrived
```

```
Experiment completed
Error: Failed to arrive
    at /Users/kakao/study/js/promise.js:95:14
    at new Promise (<anonymous>)
    at checkMail (/Users/kakao/study/js/pro
```
