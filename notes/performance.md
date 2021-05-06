



## window.performance

```
connectEnd	HTTP（TCP） 返回浏览器与服务器之间的连接建立时的时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。
connectStart	HTTP（TCP） 域名查询结束的时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 fetchStart一致。
domComplete	当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange 被触发时的时间戳
domContentLoadedEventEnd	当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳。
domContentLoadedEventStart	当解析器发送DOMContentLoaded 事件，即所有需要被执行的脚本已经被解析时的时间戳。
domInteractive	当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的时间戳。
domLoading	当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的 readystatechange事件触发时）的时间戳。
domainLookupEnd	DNS 域名查询完成的时间。如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
domainLookupStart	DNS 域名查询开始的UNIX时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致。
fetchStart	浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳。这个时间点会在检查任何应用缓存之前。
loadEventEnd	当load事件结束，即加载事件完成时的时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0.
loadEventStart	load事件被发送时的时间戳。如果这个事件还未被发送，它的值将会是0。
navigationStart	同一个浏览器上一个页面卸载(unload)结束时的时间戳。如果没有上一个页面，这个值会和fetchStart相同。
redirectEnd	最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
redirectStart	第一个HTTP重定向开始时的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0。
requestStart	返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的时间戳。
responseEnd	返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的时间戳。
responseStart	返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间
secureConnectionStart	HTTPS 返回浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，则返回0。
unloadEventEnd	和 unloadEventStart 相对应，unload事件处理完成时的时间戳。如果没有上一个页面,这个值会返回0。
unloadEventStart	上一个页面unload事件抛出时的时间戳。如果没有上一个页面，这个值会返回0。
```

## 常见性能指标
```
FP	页面首次绘制时间
FCP	页面首次有内容绘制的时间
FMP	页面首次有效绘制时间，FMP >= FCP
TTI	页面完全可交互时间
FID	页面加载阶段，用户首次交互操作的延时时间
MPFID	页面加载阶段，用户交互操作可能遇到的最大延时时间
LOAD	页面完全加载的时间（load 事件发生的时间）
```
### FP
FP (First Paint)指标通常会反映页面的白屏时间，而白屏时间会反映当前 Web 页面的网络加载性能情况，当加载性能非常良好的情况下，白屏的时间就会越短，用户等待内容的时间就会越短，流失的概率就会降低。
该指标可以通过 performance.getEntriesByType('paint') 方法获取 PerformancePaintTiming API 提供的打点信息，找到 name 为 first-paint 的对象，描述的即为 FP 的指标数据
### FCP
FCP (First Contentful Paint) 为首次有内容渲染的时间点，在性能统计指标中，从用户开始访问 Web 页面的时间点到 FCP 的时间点这段时间可以被视为无内容时间，一般 FCP >= FP。
该指标可以通过 performance.getEntriesByType('paint') 方法获取 PerformancePaintTiming API 提供的打点信息，找到 name 为 first-contentful-paint 的对象，描述的即为 FCP 的指标数据

### TTI

TTI（Time To Interactive），即从页面加载开始到页面处于完全可交互状态所花费的时间。页面处于完全可交互状态时，满足以下 3 个条件：
1. 页面已经显示有用内容。
2. 页面上的可见元素关联的事件响应函数已经完成注册。
3. 事件响应函数可以在事件发生后的 50ms 内开始执行。
window.performance.getEntriesByType('resource')会返回当前页面加载的所有资源（js、css、img...）的各类性能指标，可用于静态资源性能数据采集。
主要类型有：script、link、img、css、xmlhttprequest、beacon、fetch、other。
```
connectEnd	一个 DOMHighResTimeStamp，表示浏览器完成建立与服务器的连接以检索资源之后的时间。
connectStart	一个 DOMHighResTimeStamp，表示浏览器开始建立与服务器的连接以检索资源之前的时间。
decodedBodySize	一个 number，表示在删除任何应用的内容编码之后，从消息主体的请求（HTTP 或缓存）中接收到的大小（以八位字节为单位）。
domainLookupEnd	一个 DOMHighResTimeStamp，表示浏览器完成资源的域名查找之后的时间。
domainLookupStart	一个 DOMHighResTimeStamp，表示在浏览器立即开始资源的域名查找之前的时间
duration	返回一个 timestamp，即 responseEnd 和 startTime 属性的差值。
encodedBodySize	一个 number，表示在删除任何应用的内容编码之前，从有效内容主体的请求（HTTP 或缓存）中接收到的大小（以八位字节为单位）。
entryType	返回 "resource"。
fetchStart	一个 DOMHighResTimeStamp，表示浏览器即将开始获取资源之前的时间。
initiatorType	一个 string，代表启动性能条目的资源的类型
name	返回资源 URL。
nextHopProtocol	一个 string，代表用于获取资源的网络协议，由 ALPN 协议 ID（RFC7301） 定义。
redirectEnd	一个 DOMHighResTimeStamp，表示收到上一次重定向响应的发送最后一个字节时的时间。
redirectStart	一个 DOMHighResTimeStamp 代表启动重定向的请求开始之前的时间。
requestStart	一个 DOMHighResTimeStamp，表示浏览器开始向服务器请求资源之前的时间。
responseEnd	一个 DOMHighResTimeStamp，表示在浏览器接收到资源的最后一个字节之后或在传输连接关闭之前（以先到者为准）的时间。
responseStart	一个 DOMHighResTimeStamp，表示浏览器从服务器接收到响应的第一个字节后的时间。
secureConnectionStart	一个 DOMHighResTimeStamp，表示浏览器即将开始握手过程以保护当前连接之前的时间。
serverTiming	一个 PerformanceServerTiming 数组，包含服务器计时指标的 PerformanceServerTiming 条目。
startTime	返回一个 timestamp，表示资源获取开始的时间。该值等效于 fetchStart。
transferSize	一个 number 代表所获取资源的大小（以八位字节为单位）。该大小包括响应标头字段以及响应有效内容主体。
workerStart	一个 DOMHighResTimeStamp， 如果服务 Worker 线程已经在运行，则返回在分派 FetchEvent 之前的时间戳，如果尚未运行，则返回在启动 Service Worker 线程之前的时间戳。如果服务 Worker 未拦截该资源，则该属性将始终返回 0。

```
### 其他指标计算方式

```
DNS查询	DNS 阶段耗时	domainLookupEnd - domainLookupStart
TCP连接	TCP 阶段耗时	connectEnd - connectStart
SSL建连	SSL 连接时间	connectEnd - secureConnectionStart
首字节网络请求	首字节响应时间（ttfb）	responseStart - requestStart
内容传输	内容传输，Response阶段耗时	responseEnd - responseStart
DOM解析	Dom解析时间	domInteractive - responseEnd
资源加载	资源加载	loadEventStart - domContentLoadedEventEnd
首字节	首字节	responseStart - fetchStart
DOM Ready	dom ready	domContentLoadedEventEnd - fetchStart
redirect时间	重定向时间	redirectEnd - redirectStart
DOM render	dom渲染耗时	domComplete - domLoading
load	页面加载耗时	loadEventEnd - navigationStart
unload	页面卸载耗时	unloadEventEnd - unloadEventStart
请求耗时	请求耗时	responseEnd - requestStart
白屏时间	白屏时间	domLoading - navigationStart

```


## 错误数据采集方案

目前所能捕捉的错误有三种:
1. 资源加载错误，通过 addEventListener('error', callback, true)在捕获阶段捕捉资源加载失败错误。
2. js 执行错误，通过 window.onerror捕捉 js 错误。
跨域的脚本会给出 "Script Error." 提示，拿不到具体的错误信息和堆栈信息。此时需要在script标签增加crossorigin="anonymous"属性，同时资源服务器需要增加CORS相关配置，比如Access-Control-Allow-Origin: *
3. promise 错误，通过 addEventListener('unhandledrejection', callback)捕捉 promise 错误，但是没有发生错误的行数，列数等信息，只能手动抛出相关错误信息。
```
// 在捕获阶段，捕获资源加载失败错误
addEventListener('error', e => {
    const target = e.target
    if (target != window) {
        monitor.errors.push({
            type: target.localName,
            url: target.src || target.href,
            msg: (target.src || target.href) + ' is load error',
            time: Date.now()
        })
    }
}, true)

// 监听 js 错误
window.onerror = function(msg, url, row, col, error) {
    monitor.errors.push({
        type: 'javascript',
        row: row,
        col: col,
        msg: error && error.stack? error.stack : msg,
        url: url,
        time: Date.now()
    })
}

// 监听 promise 错误 缺点是获取不到行数数据
addEventListener('unhandledrejection', e => {
    monitor.errors.push({
        type: 'promise',
        msg: (e.reason && e.reason.msg) || e.reason || '',
        time: Date.now()
    })
})

```

## 数据上报方案
在这个场景中，需要考虑两个问题：
1. 如果数据上报接口与业务系统使用同一域名，浏览器对请求并发量有限制，所以存在网络资源竞争的可能性。
2. 浏览器通常在页面卸载时会忽略异步ajax请求，如果需要必须进行数据请求，一般在unload或者beforeunload事件中创建同步ajax请求，以此延迟页面卸载。从用户侧角度，就是页面跳转变慢。

* Beacon 接口用来调度向 Web 服务器发送的异步非阻塞请求。
1. Beacon 请求使用 HTTP POST方法，并且不需要有响应。
2. Beacon 请求能确保在页面触发 unload 之前完成初始化。 通俗的讲就是，Beacon可将数据异步发送至服务端，且能够保证在页面卸载完成前发送请求（解决ajax页面卸载会终止请求的问题）。
```
navigator.sendBeacon(url, data);
其中 data 参数是可选的，它的类型可以为 ArrayBufferView, Blob, DOMString 或者 FormData。如果浏览器成功地将 beacon 请求加入到待发送的队列里，这个方法将会返回 true ，否则将会返回 false

使用Beacon时需要后台需要使用post方法接收参数，考虑到跨域问题，后台还需要改造接口配置CORS。同时请求头必须满足CORS-safelisted request-header，其中content-type的类型必须为application/x-www-form-urlencoded, multipart/form-data, 或者text/plain。

type ContentType = 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

const serilizeParams = (params: object) => {
    return window.btoa(JSON.stringify(params))
}

function sendBeacon(url: string, params: object) {
  const formData = new FormData()
  formData.append('params', serilizeParams(params))
  navigator.sendBeacon(url, formData)
}



sendBeacon的兼容性问题是不可避免的，不过可以充分利用大部分浏览器会在页面卸载前完成图片的加载的特性，通过在页面添加img的方式上报数据。


function sendImage(url: string, params: object) {
  const img = new Image()

  img.style.display = 'none'

  const removeImage = function() {
    img.parentNode.removeChild(img)
  }

  img.onload = removeImage
  img.onerror = removeImage

  img.src = `${url}?params=${serilizeParams(params)}`

  document.body.appendChild(img)
}


由于img图片为get请求方式，不同服务器针对uri的长度有限制，长度超过限制时会出现HTTP 414错误，所以还要注意上报频率，减少一次性上传的属性过多。


```








