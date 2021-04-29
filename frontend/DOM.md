
여행자보험의 보장명과 보장가격을 가져오기 위해 웹크롤링을 해보았다. 사실 이 과정은 그냥, html parsing해주는 라이브러리를 사용해서 html에서 내가 원하는 정보를 가져오는 것이 전부였다. 원하는 결과가 무엇인지, 내가 무엇을 해야하는지는 명확했지만, 그 결과를 얻기 위한 과정에서 어려움이 있었다. Element, Node에 대한 차이를 이해하지 못했기 때문이다.

브라우저의 DOM에 대해 다시 학습하고, Element와 Node의 차이가 무엇인지 정리해보고자 한다.
[DOM이 무엇인지에 대해 정리한 글](https://bitsofco.de/what-exactly-is-the-dom/?utm_source=CSS-Weekly&utm_campaign=Issue-341&utm_medium=email)을 읽으며 DOM에 대해 학습하였다.


# DOM

DOM은 Document Object Model의 줄임말며, **웹페이지에 대한 인터페이스**라고 한다. DOM이 인터페이스 이므로, 우리는 DOM을 통해 웹페이지의 컨텐츠, 구조, 스타일을 읽고 조작할 수 있다.

## ❄️ Web page는 어떻게 빌드되는가?

브라우저가 HTML 파일을 읽어와서 화면에 띄워주는 과정은 'critical rendering path'라고 불린다. 이 과정을 크게 두 가지로 나누자면, (1) 브라우저가 HTML과 CSS를 파싱하여, 결국 화면에 어떤 것이 보여지게 되는지를 결정하는 과정과 (2) 브라우저가 렌더링을 하는 과정이다.

![](https://i.imgur.com/IW0tTPH.png)

(1)번 과정을 거치면, **렌더트리**가 만들어진다. 렌더트리는 화면에 보여지게 되는 HTML element와 그에 대응하는 스타일을 표현한 것이다. 렌더트리가 만들어지기 위해서는 **CSSOM**(element와 연관된 스타일이 표현된 Object Model)과 **DOM**(element를 표현하는 Object model)이 필요하다.


## ❄️ DOM은 어떻게 만들어지는가?

DOM은 HTML 문서를 객체 기반으로 표현한 것이다. 왜 객체로 표현했을까? 이는 HTML의 구조와 내용을 객체 모델로 바꿔서 다양한 프로그램에서 쉽게 사용할 수 있게 하기 위함이다. 

DOM의 객체 구조는 '노드 트리'라고도 불린다. 왜냐하면, DOM을 루트에서부터 여러 노드들이 가지치며 나오는 트리로 생각할 수 있기 때문이다. 루트의 \<html> element로 부터 중첩된 여러 element가 뻗어나오게 되며, 말단 노드에는 각 element의 content가 있는 형태이다.

다음의 HTML 문서는 아래와 같은 노드 트리로 표현된다. html 태그로부터, head, body node가 나오게 되며, 트리의 leaf에는 컨텐츠들이 있는 것을 확인할 수 있다.

```htmlembedded
<!DOCTYPE html>
<html>
 <head>
  <title>My title</title>
 </head>
 <body>
   <h1>My header</h1>
   <a href='#'>My Link</a>
 </body>
</html>
```

<img width=40% src='https://i.imgur.com/JDxZUUV.png' />


## ❄️ DOM이 아닌 것은 무엇인가?

DOM이 HTML 문서와 1대1로 매핑되는 것 처럼 보이지만, 좀 더 자세히 알아보며 그 차이를 이해해야 한다.

### DOM은 원본 HTML이 아니다

DOM이 HTML 문서로부터 만들어지긴 했지만, 항상 정확하게 같지는 않다.

- (차이점 1) : HTML이 유효하지 않을 경우

    DOM은 오로지 **유효한 HTML 문서**에 대한 인터페이스이다. HTML을 파싱하며 DOM을 생성하는 과정에서, 브라우저는 HTML에서 문제가 있는 것들을 고칠 수도 있다.
    
    예를 들어, 아래의 HTML과 같이 \<head> 와 \<body> 가 빠진 유효하지 않은 HTML의 경우, DOM은 head와 body를 추가하여 유효한 HTML로 고치게 된다.
    
```htmlembedded
<!doctype html>
<html>
Hello, world!
</html>
```

![](https://i.imgur.com/KbY9asL.png)


- (차이점 2) : DOM이 자바스크립트에 의해 수정되었을 경우
    DOM은 정적인 것이 아니고, 동적으로 변경될 수 있다. JS가 DOM에 수정을 가할 수 있는데, DOM에 노드를 추가하거나, 수정하느 등의 작업을 할 수 있다. 그러나 JS가 DOM을 변경한다고 하여서 HTML이 변경되는 것은 아니다.
    
###  DOM이 브라우저에서 보여지는 것은 아니다.

브라우저 화면에서 보여지는 것은 렌더트리이며, 렌더트리는 DOM과 CSSOM을 합쳐서 구성하게 된다. DOM과 렌더트리의 차이는 렌더트리는 화면에 페인트될 것으로 구성되어있다는 것이다.

렌더트리는 오로지 무엇이 렌더링될지에 대해 관심을 갖기 때문에 보여지지 않는 부분은 렌더트리에서 제외가 된다.
`display: none` 속성이 있는 element는 DOM에는 있지만, 보여지지 않기 때문에 렌더트리에는 빠진다.

단, `visibility: hidden`은 마찬가지로 화면에 보이지는 않지만, 렌더트리에는 포함된다. 따라서, `visibility: hidden`으로 숨겨진 element는 보이지는 않지만, 실제 화면에서 그 공간을 차지하고는 있다.


### DOM이 devtool에 있는 것과 같은 것이 아니다. 

devtool은 DOM에 가까운 것을 제공한다. 그러나, 데브툴은 DOM에 없더라도, 우리에게 정보를 주기 위해 추가로 넣는 것들이 있다.

그 예로는 CSS의 pseudo element가 있따. pseudo-element는 CSSOM과 렌더트리로부터 ::before와 ::after 셀렉터로 만들어지게 된다. 그러나, DOM에는 속하지 않는다. DOM은 HTML로부터 만들어지는 것이기 때문에, 그 Element와 관련된 스타일은 포함하지 않기 때문이다.

pseudo-element가 DOM의 구성은 아니지만, devtool은 그것을 보여주게 된다. 그러므로, pseudo-element가 devtool에서 보여진다 하더라도, JS로 그 엘리먼트를 target할 수는 없는 것이다. 

----

# DOM Node와 Element의 차이점

## 🧩 DOM Node

DOM은 Node의 계층 구조로 이루어져 있다. 각 노드는 부모와 children을 가질 수 있다.

 
```htmlembedded
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <!-- Page Body -->
    <h2>My Page</h2>
    <p id="content">Thank you for visiting my web page!</p>
  </body>
</html>
```
위의 HTMl은 아래에 있는 노드들의 계층으로 구성되어있따.

![](https://i.imgur.com/RL1IrMs.png)

HTML에 있는 tag (\<html>, \<p>와 같은...)들은 node를 표현하게 된다. 여기서 그저 text이더라도 node가 된다는 점이다. 노드트리를 보면, \<p> 자식 노드로 text node가 있는 것을 확인할 수 있다.


- **Node Type**
    ```
    Node.ELEMENT_NODE
    Node.ATTRIBUTE_NODE
    Node.TEXT_NODE
    Node.CDATA_SECTION_NODE
    Node.PROCESSING_INSTRUCTION_NODE
    Node.COMMENT_NODE
    Node.DOCUMENT_NODE
    Node.DOCUMENT_TYPE_NODE
    Node.DOCUMENT_FRAGMENT_NODE
    Node.NOTATION_NODE
    ```
    Node.ELEMENT_NODE 외에도, 주석의 타입인 COMMENT_NODE와 전체 document tree를 표현하는 
    Node.DOCUMENT_NODE도 있다.
    

## 🧩 DOM Element

Element는 node의 특정 타입 즉, Node.ELEMENT_NODE인 것이다. 

element는 HTML에서 태그로 적은 노드들을 지칭한다. 예를 들어, \<html>, \<div>, \<title> 과 같은 태그로 나타낸 것들은 전부 element인 것이다. 주석이나 text node와 같은 것들은 HTML 태그로 표현된 것이 아니므로 element가 아니다. 

JS DOM에서`Node`는 node의 constructor이고, `HTMLElement`는 element의 constructor이다. 

paragraph는 node이자 동시에 element이다. 

```javascript
const paragraph = document.querySelector('p');

paragraph instanceof Node;        // => true
paragraph instanceof HTMLElement; // => true
```

## 🧩 DOM 프로퍼티 

node에만 있는 DOM 프로퍼티와 element에만 있는 DOM 프로퍼티를 구분할 줄 알아야 한다.

다음 Node의 프로퍼티들은 node나 NodeList라고 한다.

```
node.parentNode; // Node or null

node.firstChild; // Node or null
node.lastChild;  // Node or null

node.childNodes; // NodeList
```

다음 Node의 프로퍼티들은 element나 element의 집합(HTMLCollection)이다.

```
node.parentElement; // HTMLElement or null

node.children;      // HTMLCollection

```

여기서 주목할 것은 Node의 children을 가져오는 프로퍼티라는 점에서는 같지만, NodeList 형태로 가져오는 `node.childNodes`와 HTMLCollection 형태로 가져오는 `node.children`이 있다는 것이다.

왜 이 두 개를 만들게 되었으며, 그 차이는 무엇일까?

```htmlembedded=
<p>
  <b>Thank you</b> for visiting my web page!
</p>
```

```javascript
const paragraph = document.querySelector('p');

paragraph.childNodes; // NodeList:       [HTMLElement, Text]
paragraph.children;   // HTMLCollection: [HTMLElement]

```

위에 있는 p tag를 childNodes와 children으로 접근하였을 때, 그 결과가 달라지게 된다. 

childNodes로 접근하면 HTMLElement와 Text가 있다. 이는 p tag 안에 자식노드로 태그가 있는 element인 `<b>Thank you</b>`와 text node인 `for visiting my web page!`가 있음을 나타낸 것이다.

children으로 접근하면, 오로지 HTMLCollection 즉 element만 가져오므로 text node인 `for visiting my web page!`는 빠지고, element node인 `<b>Thank you</b>`만 가져오게 된다.

---

## 정리

Element와 Node의 차이점을 잘 이해하고, 적절한 때에 적절한 것에 접근하면 되는 것 같다. 예를 들자면, 현재 element의 parent로 넘어가서 sibling element에 접근해야 했다. 이 때, parentNode로 parent를 가져오려고 했을 때, 내가 의도한 바를 이루지 못했었다. element로 넘어가려면 parentElement를 했어야 하는데, 그러지 못한 것이었다. 이제 Node와 Element의 차이점을 알았으니, 파싱할때나 바닐라로 플젝할 시에 좀 더 삽질을 덜 할 수 있을 것이라고 믿는다...

```javascript
productExampleElement.parentElement.nextElementSibling;
```




## 참고
- [What, exactly, is the DOM? - Ire Aderinokun](https://bitsofco.de/what-exactly-is-the-dom/?utm_source=CSS-Weekly&utm_campaign=Issue-341&utm_medium=email)
- [What's the Difference between DOM Node and Element?
](https://dmitripavlutin.com/dom-node-element/)