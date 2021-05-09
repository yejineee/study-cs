

# SSR vs CSR

## SSR이란?

![](https://i.imgur.com/59waJ2R.png)


SSR은 서버에서 페이지를 모두 구성하여 사용자에게 페이지를 보여주는 방식이다. SSR을 사용하면 모든 데이터가 매핑된 서비스 페이지를 클라이언트에게 바로 보여줄 수 있다. 

서버에서 페이지를 구성하기 때문에 ❓CSR(client-side rendering)보다 페이지를 구성하는 속도는 늦어지지만, 전체적으로 사용자에게 보여주는 컨텐츠 구성이 완료되는 시점은 빨라진다는 장점이 있다. 또한, HTML에 모든 컨텐츠가 저장되어있기에 SEO가 가능하다.

단 매번 새로운 페이지를 요청할 때마다 새로고침이 발생하고, 간단한 데이터 수정도 서버를 거쳐야하며, 매번 서버에 요청을 하는 것은 서버 과부하의 원인이 된다.

## CSR이란?

![](https://i.imgur.com/n1877qB.png)

최초 페이지 로딩 이후, JS를 사용하여 동적으로 데이터를 변경하며 화면을 바꾸는 웹 애플리케이션이다. 서버는 JSON만 보내주는 역할을 하고, 클라이언트는 그 데이터를 갖고 HTML을 렌더링한다.

CSR은 첫 로딩이 느리나, 이후 좋은 UX를 제공한다는 점이 장점이다. 그러나, SEO에 문제가 생기고, 초기 렌더링 속도가 느리다는 단점이있다. 

## CSR과 SSR의 렌더링 속도의 차이

![](https://media.vlpt.us/images/ksh4820/post/073ecd83-dc1d-4909-b05e-23e04ef18811/image.png)

## SPA란?


데스크탑에 비해 성능이 낮은 모바일을 통해 웹페이지를 출력해야 했는데, SSR방식은 성능상 문제가 보였다. 기존과는 다른 접근이 필요했고, SPA가 등장하게 되었다.

단일 페이지 애플리케이션으로, 현재의 페이지를 동적으로 작성함으로써 사용자와 소통하는 웹 애플리케이션이다.

연속되는 페이지간의 UX를 향상시키고, 웹 애플리케이션이 데스크톱 애플리케이션처럼 동작하도록 도와준다.

## 검색엔진최적화 - SEO(Search Engine Optimization)

SEO는 웹페이지 검색엔진이 자료를 수집하고, 순위를 매기는 방식에 맞게 웹페이지를 구성해서 검색 결과의 상위에 나올수 있도록 하는 작업을 말한다.(위키백과)


웹 크롤러, 봇들이 JS를 실행시키지 못하고 HTML에서만 컨텐츠를 수집하므로, CSR 방식으로 개발된 페이지를 빈 페이지로 인식하게 된다. 따라서 CSR에서의 SEO가 불리하다.

SSR은 서버가 view를 렌더링하여 HTML을 클라이언트에 전송하기에, HTML에 컨텐츠가 담겨있다. 따라서 SEO가 가능해진다.


---

## 출처
- [어서 와, SSR은 처음이지? - 도입 편 - naver D2](https://d2.naver.com/helloworld/7804182)
- [SPA, CSR과 SSR, SEO](https://velog.io/@ksh4820/SPA-CSR%EA%B3%BC-SSR-SEO)
- [서버 사이드 렌더링 그리고 클라이언트 사이드 렌더링 - jbee](https://asfirstalways.tistory.com/244)
- [검색 엔진 최적화 - 위키백과](https://ko.wikipedia.org/wiki/%EA%B2%80%EC%83%89_%EC%97%94%EC%A7%84_%EC%B5%9C%EC%A0%81%ED%99%94)

## 읽어보면 좋을 것 같은 글
- [웹 렌더링 - google developers](https://developers.google.com/web/updates/2019/02/rendering-on-the-web?hl=ko)
