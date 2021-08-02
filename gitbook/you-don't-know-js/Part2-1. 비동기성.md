

# Part 2 - 1장. 비동기성 : 지금과 나중

- 자신의 프로그램에 비동기 요소를 왜, 어떻게 추가해야하는지를 알아야 한다.

## 1.1 Program Chunk

- 일반적인 프로그램 chunk 단위는 함수

## 1.2 이벤트 루프
- **호스팅 환경**

    자바스크립트 엔진은 **호스팅 환경**에서 실행된다. 브라우전, 노드js 등에서 실행이 된다. 이 호스팅 환경의 공통적인 특징은 **`스레드`** 가 **`이벤트 루프`** 라는 메커니즘을 갖고 있다는 것이다. 

- **이벤트 루프**
    
    이벤트 루프는 매 순간 자바스크립트 엔진을 호출하여, 프로그램의 chunk들을 실행시킬 수 있게 한다. 
    
    > But the one common “thread” (that’s a not-so-subtle asynchronous joke, for what it’s worth) of all these environments is that they have a mechanism in them that handles executing multiple chunks of your program over time, at each moment invoking the JS engine, called the event loop.


- **tick**

    이벤트 루프가 매 iteration 마다, 이벤트를 꺼내서 실행시킨다. 이 iteration을 `tick`이라고 한다. 이벤트는 콜백함수이다.
    
    setTimeout()은 타이머 함수일 뿐이고, 콜백함수를 이벤트 큐에 넣는 것은 **호스팅 환경**이다.
  

> 💡 정리 
> - 자바스크립트 엔진: 프로그램의 chunk를 실행시키는 실행기
> - 이벤트 루프: 그 엔진을 실행시키는게 이벤트 루프. 이벤트 스케쥴링하고, 자바스크립트 엔진이 이벤트를 실행시키도록 한다.
> - tick마다 이벤트 루프가 이벤트를 실행시킴

## 1.3 병렬 스레딩
    
- **완전 실행 - Run To Complete**

    자바스크립트는 싱글 스레드이므로, 함수 내부의 코드는 원자적(atomic)이다. 한 함수의 실행이 끝난 후, 다른 함수가 실행된다는 것이다. 이를 `완전 실행(run-to-complete)`이라고 한다. 

- **Race Condition**

    자바스크립트는 완전 실행이지만, 함수 실행 순서에 따라 결과가 달라질 수 있다(함수 순서에 따른 비결정성). 이를 race condition이라고 한다.
## 참고
- you don't know js - 비동기와 성능 (카일 심슨)
