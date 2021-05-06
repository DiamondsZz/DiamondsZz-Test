## window.postMessage
```
从广义上讲，一个窗口可以获得对另一个窗口的引用（比如 targetWindow = window.opener），然后在窗口上调用 targetWindow.postMessage() 方法分发一个  MessageEvent 消息。接收消息的窗口可以根据需要自由处理此事件。
传递给 window.postMessage() 的参数（比如 message ）将通过消息事件对象暴露给接收消息的窗口。


otherWindow.postMessage(message, targetOrigin, [transfer])

targetOrigin:通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。
在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；
只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；
例如，当用postMessage传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的origin属性完全一致，来防止密码被恶意的第三方截获。
如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin，而不是*。
不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  var origin = event.origin
  if (origin !== "http://example.org:8080")
    return;

  // ...
}

```
## Window.localStorage(同源)
```
// storage事件监听器
storageListener(e) {
	if (e.newValue) {
	}
},
		
		
window.addEventListener('storage', storageListener)

```
## MessageChannel()
```

new MessageChannel() 返回的对象中包含两个 MessagePort 对象。
{
port1: MessagePort {onmessage: null, onmessageerror: null},
port2: MessagePort {onmessage: null, onmessageerror: null}
}





// main thread
if (serviceWorker) {
  // 创建信道
  const channel = new MessageChannel();
  // port1留给自己
  channel.port1.onmessage = (e) => {
    console.log("main thread receive message...");
  };

  // port2给对方
  serviceWorker.postMessage("hello world!", [channel.port2]);
}

// sw
self.addEventListener("message", (ev) => {
  console.log("sw receive message..");
  // 取main thread传来的port2
  ev.ports[0].postMessage("Hi, hello too");
});



```
## Beacon
```




用于将异步和非阻塞请求发送到服务器。信标（Beacon ）请求使用HTTP协议中的POST方法，请求通常不需要响应。这个请求被保证在，页面的unload状态从发起到完成之前，被发送。而并不需要一个阻塞请求，例如 XMLHttpRequest 。

Beacon API 的示例用例是记录活动并向服务器发送分析数据。



Beacon 接口满足了分析和诊断代码的需要，这些代码通常会尝试在卸载文档之前将数据发送到 web服务器。发送数据的任何过早时机都可能导致错失收集数据的机会。但是，确保在卸载文档期间发送数据是开发人员难以做到的。
用户代理通常会忽略卸载文档处理程序中的异步 XMLHttpRequests 请求。若要解决此问题，为了分析和诊断代码，通常会在 unload 事件或 beforeunload 事件中创建同步 XMLHttpRequest 请求以提交数据。同步 XMLHttpRequest 请求强制浏览器延迟卸载文档，并使下一个页面跳转看起来较慢。下一页面没有任何办法来避免这种页面加载性能不佳的感觉。
其他技术也可以用来确保提交数据。其中一种技术是通过创建 Image 元素并在卸载文档处理程序中设置其 src 属性来延迟卸载以提交数据。由于大多数用户代理会延迟文档卸载，以完成挂起的图片加载，因此可以在卸载过程中提交数据。另一种方法是在卸载处理程序中创建一个无操作循环，花费数秒以延迟卸载并将数据提交到服务器。
但是上述技术不仅代表了较差的编码模式，其中一些还是不可靠的，会导致下一个导航的页面加载性能较差的感觉。信标 API 提供了解决这些问题的标准方法。


 Navigator.sendBeacon() 方法用于在全局浏览上下文中向服务器发送数据信标。该方法有两个参数，URL和要在请求中发送的数据data。data参数是可选的，其类型可以是 ArrayBufferView、Blob、DOMString 或FormData。如果浏览器成功的以队列形式排列了用于传递的请求，则该方法返回“true”，否则返回“false”。

```