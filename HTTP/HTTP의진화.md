

# HTTP의 진화

# 🌘 HTTP/0.9 - The one-line protocol

초기에는 버전 넘버가 없었고, 이후에 다른 버전들과 구분하기 위해 0.9 버전 넘버가 붙여졌다.

### 특징
- HTTP 헤더가 없었다.
    - HTML 파일만 전송이 되었고, 다른 타입의 문서는 전송되지 않았다.
- status, error code가 없었다.
    - 문제가 발생하면, 문제에 대한 설명이 HTML에 붙여져서 되돌아갔다.

### 요청 
- GET 메소드만 가능했다.
- `GET {path to the resource}`의 형태였다.

```
GET /mypage.html
```

### 응답
- 파일 내용으로만 구성되었다.

```
<HTML>
    A very simple HTML page
</HTML>
```

# 🌗 HTTP/1.0 - 확장성 만들기
1.0 버전에서는 브라우저와 서버 모두 융통성을 갖도록 확장되었다.

### 특징
- 버전 정보 추가
    - 버전 정보가 각 요청 안에 전송되었다.(e.g. `HTTP/1.0`)
- status code 추가
    - 응답의 첫 번째 줄에 status code가 전송되었다.
    - 브라우저가 요청의 성공과 실패 여부를 이해할 수 있게 되었고, 그에 따른 행동을 취할 수 있게 했다.
- HTTP 헤더 도입
    - 요청과 응답에 HTTP 헤더라는 개념이 도입되었다.
    - metadata를 전송할 수 있게 되었다.
    - 프로토콜을 유연하고, 확장성있게 되었다.
- 다른 타입의 문서 전송
    - `Content-Type` 헤더로 인하여, plain HTML외에 다른 문서가 전송될 수 있게 되었다.


### 요청과 응답의 형태
- 첫 번째 요청/응답
```
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
<HTML>
A page with an image
  <IMG SRC="/myimage.gif">
</HTML>
```
- 두 번째 요청/응답

두 번째 연결 요청을 한 후, 이미지를 fetch한다.
Content-Type으로 text/gif가 있음을 확인할 수 있다.

```
GET /myimage.gif HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:32 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/gif
(image content)
```

# 🌖 HTTP/1.1 - 표준 프로토콜

1997년 1월에 [RFC 2068](https://datatracker.ietf.org/doc/html/rfc2068)에서 처음 공개되었다.

### 특징

- **Persistent HTTP** : 커넥션의 재사용
    ![](https://i.imgur.com/ud1yj0b.png)

    - HTTP1.0에서는 `non-persistent` connection이었다. 즉, 한 번의 커넥션에 하나의 object만 받을 수 있었다. 다른 리소스를 요청하기 위해 다시 커넥션을 맺어야하는 오버헤드가 있다.
    - HTTP1.1에서는 `persistent connection`이 디폴트이다. 즉, 한 번의 커넥션에 여러 개의 object를 요청/응답할 수 있다. 이를 통해, 하나의 파일에 있는 리소스를 얻기 위해 여러번 커넥션을 맺어야 하는 시간을 줄일 수 있게 되었다.

- **Pipelining** 

    ![](https://i.imgur.com/22H5E1C.png)

    - 파이프라이닝은 응답을 기다리지 않고, 바로 새로운 요청을 보낼 수 있다. 이를 통해 응답 대기 시간을 낮추었다.
    - Persistent with Pipelining이 HTTP/1.1에서 디폴트 모드이다.
    - 그러나, 복잡하기에 잘 쓰이지 않는다.
    - 응답은 순차적이어야 한다. 즉, 첫 번째 응답이 와야 두 번째 응답을 받을 수 있다. 이는 한 응답이 늦어지면, 그 다음 응답도 늦어지는 문제가 있다.

- Chunked response를 지원한다.
- 캐시 컨트롤 메커니즘이 도입되었다.
- 언어, 인코딩,  타입 등이 도입되었다.
- `Host` 헤더로 인해, 동일 IP 주소에서 다른 도메인을 호스트하는 기능을 가능하게 한다. 

### 요청/응답

```
GET /en-US/docs/Glossary/Simple_header HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 20 Jul 2016 10:55:30 GMT
Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a"
Keep-Alive: timeout=5, max=1000
Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
Server: Apache
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding

(content)


GET /static/img/header-background.png HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Age: 9578461
Cache-Control: public, max-age=315360000
Connection: keep-alive
Content-Length: 3077
Content-Type: image/png
Date: Thu, 31 Mar 2016 13:34:46 GMT
Last-Modified: Wed, 21 Oct 2015 18:27:50 GMT
Server: Apache

(image content of 3077 bytes)
```

# 🌖 15년 간의 확장

## 보안 전송을 위한 HTTP : TLS, SSL

TCP/IP 위에서 HTTP를 전송하는 것을 넘어서서, `SSL`(secure socket layer)이라는 암호화된 전송 계층을 추가하였다. SSL은 e-commerce 웹 사이트가 생기게 해주었는데, 이는 SSL이 클라이언트와 서버 사이에 암호화되고, 보장되는 인증 메시지 교환을 해주었기 때문이다.

SSL은 표준이 되어, `TLS`(Transport Layer Security)가 되었다. TLS는 암호화된 TCP 연결을 할 수 있게 해준다.

## 복잡한 애플리케이션을 위한 HTTP

2000년에 새로운 HTTP 패턴이 디자인되었다 : `REST`(representational state transfer)

> **REST** : The basic idea of REST is that a resource, e.g. a document, is transferred via well-recognized, language-agnostic, and reliably standardized client/server interactions. Services are deemed RESTful when they adhere to these constraints.


2005년 부터는 새로운 API들이 생겼다.
- Server-sent events : 서버가 브라우저에 메시지를 먼저 푸쉬(전송) 수 있다.
- WebSocket : 브라우저와 서버 사이에 interactive 통신 세션을 설정할 수 있게 한다. 브라우저는 서버에 polling하지 않고, event-driven  응답을 받을 수 있다.


## 웹의 보안 모델 완화

HTTP는 웹의 보안 모델인 same-origin 정책과는 독립되어있다. 
- CORS : Cross-Origin 리소스 공유
- CSP : 컨텐츠 보안 정책

많은 헤더들이 추가되었다.
- DNT(Do Not Track) : deprecated되었다.
- X-Frame-Options : 이 응답 헤더는 `<frame>, <iframe>, <embed>, <object>` 를 브라우저가 렌더링할 것을 허락하는지에 대한 여부를 나타낸다.
- Upgrade-Insecure-Requests : 이 요청 헤더는 서버에게 클라이언트가 암호화되고, authenticated 응답을 원한다는 신호를 보낸다.


# 🌕 HTTP/2 더 나은 성능을 위한 프로토콜

HTTP/1.1에서는 요청이 순차적으로 이루어져야 했다. 


HTTP/2 프로토콜의 기초는 구글의 **SPDY 프로토콜**이다. 이 프로토콜은 responsiveness를 개선시켰고, 중복된 데이터 전송의 문제를 해결하였다. 

## HTTP/2가 HTTP/1.1과는 달라진 점

- Binary 프로토콜이다.
    - 1.1 이하 버전에서는 텍스트 기반으로 헤더와 데이터가 연결되었다면, 2버전에서는 메시지들을 binary 단위로 구성하여, 더 작은 프레임으로 쪼개서 관리한다.
    - 성능 최적화 알고리즘이 적용된다.
- Multiplexed 프로토콜이다.
    - 병렬 요청이 같은 커넥션에서 처리될 수 있다.
    - HTTP/1.1에서의 순서와, 블락킹 제약 사항을 없앴다.
- 헤더를 압축한다.
    - HTTP/2의 헤더는 허프만 코드로 인코딩되어 압축된다.
    - 헤더는 set of request들 사이에서 비슷비슷하다. 따라서, 헤더를 압축함으로써, 데이터 전송의 중복과 오버헤드를 없애준다.
- 서버푸쉬
    - 서버가 클라이언트 캐시에 데이터를 전송
    - `server push`라는 메커니즘으로 인해, 클라이언트의 요청이 없어도 서버가 클라이언트에 데이터를 전송할 수 있다. 






## 참고
- [HTTP의 진화 - MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
- [Evolution of HTTP - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
- [HTTP/1.x의 커넥션 관리 - MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Connection_management_in_HTTP_1.x)
- [HTTP/2 특징들에 대한 정리 - Jin's Dev Inside](https://jins-dev.tistory.com/entry/HTTP2-%ED%8A%B9%EC%A7%95%EB%93%A4%EC%97%90-%EB%8C%80%ED%95%9C-%EC%A0%95%EB%A6%AC)
