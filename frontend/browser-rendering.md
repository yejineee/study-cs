# 브라우저 렌더링 과정

브라우저가 어떻게 동작하는지 알게 되면, 어떠한 과정을 거쳐서 화면에 페이지가 보이는지 알게 된다.

## 🖍 브라우저의 주요 기능

- 사용자가 선택한 자원을 서버에 요청하고 브라우저에 표시하는 것
- 자원의 주소는 URI에 의해 정해진다.
- 자원은 HTML, PDF, 이미지 혹은 다른 형태이다.

## 🖍 브라우저 기본 구조

![](https://i.imgur.com/95xfCs0.png)

1. 사용자 인터페이스 : 요청한 페이지를 보여주는 창 제외한 나머지 모든 부분 (예 : 주소 표시줄, 북마크 메뉴)
2. 브라우저 엔진 : 사용자 인터페이스와 렌더링 엔진 사이의 동작 제어
3. 렌더링 엔진 : 요청한 컨텐츠 표시 - HTML을 요청하면 HTML과 CSS를 파싱하여 표시
4. 통신
   - HTTP 요청과 같은 네트워크 호출에 사용.
   - 플랫폼 독립적
   - 각 플랫폼 하부에서 실행
5. UI 백엔드 : 콤보 박스와 창 같은 기본적인 장치를 그림. 플랫폼에서 명시하지 않은 일반적인 인터페이스로서, OS 사용자 인터페이스 체계를 사용.
6. 자료저장소 : 모든 종류의 자원을 하드 디스크에 저장.
7. 자바스크립트 해석기

크롬은 각 탭마다 별도의 렌더링 엔진 인스턴스를 유지한다. 각 탭은 독립된 프로세스로 처리된다.

## 🖍 렌더링 엔진

- 렌더링 엔진은 요청 받은 내용을 브라우저 화면에 표시한다.
- 주로 HTML, XML, 이미지를 표시하고, 확장 기능을 이용하면 PDF와 같은 다른 유형의 문서도 표시할 수 있다.

- 렌더링 엔진 종류
  - 게코 엔진 (Gecko) - 파이어폭스에서 사용
  - 웹킷 엔진 (Webkit) - 사파리, 크롬이 사용

## 🖍 렌더링 엔진의 동작 과정

![](https://i.imgur.com/76dlfT3.png)

브라우저에서 웹 페이지를 로드하면 가장 먼저 HTML 파일을 다운로드한다.
이후 파싱 -> 스타일 -> 레이아웃 -> 페인트 -> 합성 단계를 거치게 된다.

1. 파싱 : HTML 마크업을 처리하여 **DOM 트리**를 생성한다.
2. 파싱 : CSS 마크업을 처리하여 **CSSOM 트리**를 생성한다.
3. 스타일 : DOM 트리와 CSSOM 트리를 결합하여 **렌더링 트리** 생성한다.
4. 레이아웃 : 각 노드에 대해 화면에서의 정확한 위치와 크기를 계산한다.
5. 페인팅 : 렌더트리의 각 노드를 화면상의 실제 픽셀로 변환한다.
6. 합성 : 페인트 단계에서 생성된 레이어를 합성하여 스크린을 업데이트한다.

이 과정들은 **점진적으로 진행**된다. 렌더링 엔진은 모든 HTML을 파싱할 때까지 기다리지 않고 배치와 그리기 과정을 시작한다. 네트워크로부터 나머지 내용이 전송되기를 기다리는 동시에 받은 내용의 일부를 먼저 화면에 표시한다.
이는 좀 더 나은 사용자 경험을 위한 것이다.

- 웹킷 동작 과정

  ![](https://i.imgur.com/RL6h4UL.png)

- 모질라의 게코 렌더링 엔진 동작 과정

  ![](https://i.imgur.com/24EX7JO.png)

### ✨ 1. 파싱 - DOM(Document Object Model) 트리 생성

```htmlembedded
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <title>Critical Path</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>

```

![](https://i.imgur.com/lOHM4bV.png)

- HTML을 해석해서 DOM을 생성한 후, 각 DOM 객체를 _트리 데이터 구조_ 로 연결하여 부모-자식 관계를 갖도록 한다.
- HTML 페이지는 바이트를 문자로 변환 -> 토큰화 -> 노드로 변환 -> DOM 트리 생성 과정을 거치게 된다.
- 파싱 중 `<script>`, `<link>`, `<img>` 태그를 발견하면 각 리소스를 요청하고 다운로드한다.
- DOM 트리는 렌더링될 때 어떻게 표시할지는 알려주지 않는데, 그 정보는 CSSOM이 알려주게 된다.

### ✨ 2. 파싱 - CSSOM(CSS Object Model) 트리 생성

브라우저가 DOM을 생성하는 동안 `<head>` 섹션에서 style.css를 참조하는 문서의 링크 태그를 만나게 된다. 브라우저는 이 리소스에 대한 처리를 요청하고, 요청의 결과는 다음과 같다.

```htmlembedded=
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }

```

CSS 또한 HTML과 마찬가지로, 바이트를 문자로 변환 -> 토큰화 -> 노드로 변환 -> CSSOM 트리 구축 과정을 거치게 된다.

![](https://i.imgur.com/gPFdcFS.png)

- CSSOM이 트리 구조를 갖는 이유?

  - 스타일은 **하향식**으로 규칙을 적용하게 된다. 페이지의 객체에 있는 스타일을 계산할 때, 브라우저는 해당 노드에 적용 가능한 가장 일반적인 규칙에서 더욱 구체적인 규칙을 적용하게 된다.

- 위의 트리는 완전한 CSSOM 트리가 아니다.
  - 브라우저가 기본적으로 제공하는 'user agent styles'에서 스타일 시트가 재정의 하도록 결정한 스타일만 표시한다.

### ✨ 3. 스타일 - 렌더링 트리 생성

![](https://i.imgur.com/9iB4RPE.png)

- 먼저 **DOM트리와 CSSOM 트리를 결합하여 렌더링 트리를 형성한다.**
- 렌더링 트리에는 페이지를 렌더링하는데 필요한 노드만 포함된다.
- **렌더링 트리는 페이지에 표시되는 모든 DOM 컨텐츠와 각 노드에 대한 모든 스타일 정보를 갖고 있다**.

#### 렌더링 트리 생성 과정

1. DOM 트리의 루트에서 시작하여 순회한다.
   - 렌더링이 되지 않는 `<script>`, `<meta>` 태그와 같은 노드들은 렌더링 트리에서 생략된다.
   - 일부 노드는 CSS를 통해 숨겨지며, 렌더링 트리에서도 생략된다. 예를 들면 'display:none' 속성을 갖는 노드는 렌더링 트리에서 생략된다.
2. 표시된 각 노드에 대해 매칭되는 CSSOM규칙을 찾고, 적용한다.
3. 표시된 노드를 컨텐츠와 스타일과 함께 내보낸다.

### ✨ 4. 레이아웃 - 렌더 트리 배치

- **뷰포트 내에서 노드의 정확한 위치와 크기를 계산한다.**
- 페이지 내에서의 각 객체의 정확한 위치와 크기를 계산하기 위해, 브라우저는 렌더링 트리의 루트에서 시작하여 트리를 순회한다.
- 레이아웃 과정의 결과는 **Box Model**이다. 박스 모델은 뷰포트 내에서 각 노드의 정확한 위치와 크기 정보를 담고 있다. 모든 상대적인 측정값은 스화면에서의 **절대적인 픽셀**로 변환된다.

### ✨ 5. 'painting' or 'rasterizing' - 렌더 트리 그리기

- 렌더링 트리의 각 노드를 화면에서의 실제 픽셀로 변환한다.
- 위치와 관계없는 CSS 속성을 적용한다.
- 픽셀로 변환된 결과는 _개별 레이어_ 로 관리된다.
- 각각의 엘리먼트가 모두 레이어가 되는 것은 아니며, `transform` 속성 등을 사용하면 엘리먼트가 레이어화된다.

### ✨ 6. 합성 & 렌더

- 페인팅 단계에서 생성된 레이어를 합성하여 스크린을 업데이트한다.

## 출처

- [네이버 D2 - 브라우저는 어떻게 동작하는가?](https://d2.naver.com/helloworld/59361)
- [poiemaweb - 브라우저 동작 원리](https://poiemaweb.com/js-browser)
- [constructing the object model](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model)
- [Render-tree Construction, Layout, and Paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)
- [성능 최적화 - toast](https://ui.toast.com/fe-guide/ko_PERFORMANCE#%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83%EA%B3%BC-%EB%A6%AC%ED%8E%98%EC%9D%B8%ED%8A%B8)
