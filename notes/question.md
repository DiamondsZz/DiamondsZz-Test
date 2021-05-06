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