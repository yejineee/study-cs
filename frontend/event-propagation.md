# 이벤트 캡쳐링 & 버블링 & 이벤트 전파 순서

```
-----------------------------------
| element1                        |
|   -------------------------     |
|   |element2               |     |
|   -------------------------     |
|                                 |
-----------------------------------
```

element1과 element2 모두 이벤트 핸들러가 등록되어있다. 이 때, element2에 이벤트가 발생하면 어떤 이벤트 핸들러가 먼저 실행될까?

Netscape는 `이벤트 캡쳐링`이라고 불리는 모델을 만들었다. 이는 element1의 이벤트가 먼저 실행된다.
Microsoft는 element2의 이벤트가 먼저 실행되도록 하였고, 이는 `이벤트 버블링`이라고 불린다.

## 이벤트 캡쳐링

```
               | |
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  \ /          |     |
|   -------------------------     |
|        Event CAPTURING          |
-----------------------------------
```

이벤트 캡쳐링에서는 1의 이벤트가 먼저 발생하고, 2가 나중에 발생한다.

## 이벤트 버블링

```
               / \
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  | |          |     |
|   -------------------------     |
|        Event BUBBLING           |
-----------------------------------

```

이벤트 버블링에서는 2의 이벤트가 먼저 발생하고, 1의 이벤트가 나중에 발생한다.

## W3C Model & Event Flow

W3C 모델은 어떤 이벤트가 먼저 발생해야할 것인지에 대해 중간의 입장을 취했다.

W3C모델에서 이벤트가 발생하면, **이벤트 캡쳐링이 먼저 일어나고, 이벤트 타겟 도착 후에 다시 버블링이 일어난다.**

![](https://i.imgur.com/QKuDBRd.png)

## Event Phase

이벤트 타겟까지 이벤트가 전달되는 순서가 있는 list를 **propagation path**라고 한다. 이 propagation path는 Document의 계층적인 트리 구조를 나타낸다.

propagation path의 가장 마지막 아이템이 _이벤트 타겟_ 이며, 이벤트 타겟 이전의 아이템들을 _타겟의 조상_ 이라고 하며, 타겟 바로 이전에 있는 아이템을 _타겟의 부모_ 라고 한다.

propagation path가 결정이 되면, 이벤트 객체는 하나 이상의 event phase를 따라 전달된다.
event phase에는 세 가지가 있다.

- **capturing phase** : window부터 타겟의 부모까지 이벤트 객체가 전달된다.
- **target phase**: event 객체가 이벤트 타겟에 도착했을 때이다.
- **bubbling phase**: event 객체가 타겟의 부모부터 Window까지 전달된다.

### addEventListner의 useCapture 파라미터

addEventListener의 세 번째 파라미터는 useCapture로 boolean을 받는다. capturing phase에 이벤트 리스너를 실행시킬 것이라면 true, bubbling phase에 이벤트 리스너를 실행시킬 것이라면 false를 넣는다. 기본값은 bubbling phase인 false이다.

```
                 | |  / \
-----------------| |--| |-----------------
| element1       | |  | |                |
|   -------------| |--| |-----------     |
|   |element2    \ /  | |          |     |
|   --------------------------------     |
|        W3C event model                 |
------------------------------------------
```

위의 구조로 생긴 DOM에 이벤트를 다음처럼 걸어보자.

```javascript
element1.addEventListener("click", doSomething2, true);
element2.addEventListener("click", doSomething, false);
```

1. 'click' 이벤트는 먼저 capturing phase에 들어간다. 이벤트는 이벤트 타겟에 도달할 때까지 capuring phase에 실행될, onclick event handler를 찾는다.
2. element1은 capturing phase에 실행되므로, doSomething2가 실행된다.
3. 이벤트가 타겟에 도착하고, 이벤트는 이제 bubbling phase에 들어선다. element2는 bubbling phase에 클릭 이벤트 핸들러를 등록했으므로, doSomething이 실행된다.
4. 이벤트는 타겟의 부모부터 window에 도착할 때까지, bubbling phase에 등록된 onclick event listener를 찾는다. bubbling phase에 해당되는 이벤트 핸들러를 찾지 못하였으므로, 아무 일도 일어나지 않는다.

## 이벤트 전파 중단하기 - e.stopPropagation()

이벤트가 발생하면 브라우저는 모든 이벤트의 조상 엘리먼트를 찾아서 이벤트 핸들러가 있는지 확인해야 한다. 어떠한 이벤트 핸들러가 없을지라도, 핸들러를 찾게된다. 이벤트 캡쳐링과 버블링을 중단시키면 시스템의 리소스를 아낄 수 있다.

W3C 모델에서는 이벤트 객체의 `stopPropagation()` 메서드를 호출하여, 이벤트의 전파를 막을 수 있다. stopPropagation은 현재 이벤트 이후로 이벤트의 전파를 막는다.

## 이벤트 취소 - e.preventDefault();

preventDefault() 메서드를 호출하면, 브라우저가 갖고 있는 기본적인 이벤트가 취소된다. 단, 이벤트의 전파는 막지 않는다.

## currentTarget

이벤트 객체의 curretTarget 프로퍼티는 현재 이벤트 핸들러가 등록된 요소를 가리킨다. this 키워드로도 currentTarget을 참조할 수 있다. target은 이벤트가 발생한 이벤트 타겟을 가리킨다.

## 출처

- [UI Events - W3C](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
- [Event order - quirksmode ](https://www.quirksmode.org/js/events_order.html#link4)
