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
## unhandledrejection
```
当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件；

window.addEventListener("unhandledrejection", event => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

window.onunhandledrejection = event => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
};

```
## requestIdleCallback
```
var handle = window.requestIdleCallback(callback[, options])
callback:一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
options:包括可选的配置参数。具有如下属性：timeout：如果指定了timeout并具有一个正值，并且尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行，尽管这样很可能会对性能造成负面影响。

window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。
你可以在空闲回调函数中调用requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。
返回值是一个ID，可以把它传入 Window.cancelIdleCallback() 方法来结束回调。

```

## 浏览器渲染

### 渲染页面
* 五大关键渲染路径
1. JavaScript
2. 样式计算：该过程根据选择器计算元素的css规则，通过这些规则计算出每个元素的最终样式。
3. 布局：在知道一个元素css规则后，浏览器便开始计算每个元素的空间大小和具体位置。
4. 绘制：绘制是填充像素的过程。包括绘制文本、颜色、图像、边框、阴影等
5. 合成：页面的各部分可能被绘制到多层，因此需要按正确顺序绘制到屏幕上。
* 三种输出方式
1. js/css-样式-布局-绘制-合成  如果改变了元素的几何属性（例如宽高等），那么浏览器将检查所有元素，重排页面。
2. js/css-样式-绘制-合成    如果改变了背景图片、颜色、阴影等不会影响页面布局的属性，浏览器将跳过布局阶段。
3. js/css-样式-合成   如果改变的属性不影响布局和绘制，将直接进行合成阶段。
### 帧
* 在视频领域，电影、电视、数字视频等可视为随时间连续变换的许多张画面，其中帧是指每一张画面。

## visibilitychange
```
当其选项卡的内容变得可见或被隐藏时，会在文档上触发 visibilitychange (能见度更改)事件。

document.addEventListener("visibilitychange", function() {
  console.log( document.visibilityState );
});
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'visible') {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});

当 visibleStateState 属性的值转换为 hidden 时，Safari不会按预期触发visibilitychange； 因此，在这种情况下，您还需要包含代码以侦听 pagehide 事件。

出于兼容性原因，请确保使用  document.addEventListener 而不是window.addEventListener来注册回调。 Safari <14.0仅支持前者。
```
## 剪切板(http://www.ruanyifeng.com/)

### Document.execCommand() 方法
```
document.execCommand('copy')（复制）
document.execCommand('cut')（剪切）
document.execCommand('paste')（粘贴）

Document.execCommand()方法虽然方便，但是有一些缺点。

首先，它只能将选中的内容复制到剪贴板，无法向剪贴板任意写入内容。

其次，它是同步操作，如果复制/粘贴大量数据，页面会出现卡顿。有些浏览器还会跳出提示框，要求用户许可，这时在用户做出选择前，页面会失去响应。

```
### 异步 Clipboard API
```
Clipboard API 是下一代的剪贴板操作方法，比传统的document.execCommand()方法更强大、更合理。

它的所有操作都是异步的，返回 Promise 对象，不会造成页面卡顿。而且，它可以将任意内容（比如图片）放入剪贴板。

navigator.clipboard属性返回 Clipboard 对象，所有操作都通过这个对象进行。

const clipboardObj = navigator.clipboard

如果navigator.clipboard属性返回undefined，就说明当前浏览器不支持这个 API。

由于用户可能把敏感数据（比如密码）放在剪贴板，允许脚本任意读取会产生安全风险，所以这个 API 的安全限制比较多。

首先，Chrome 浏览器规定，只有 HTTPS 协议的页面才能使用这个 API。不过，开发环境（localhost）允许使用非加密协议。

其次，调用时需要明确获得用户的许可。权限的具体实现使用了 Permissions API，跟剪贴板相关的有两个权限：clipboard-write（写权限）和clipboard-read（读权限）。"写权限"自动授予脚本，而"读权限"必须用户明确同意给予。也就是说，写入剪贴板，脚本可以自动完成，但是读取剪贴板时，浏览器会弹出一个对话框，询问用户是否同意读取。






Clipboard.readText()方法用于复制剪贴板里面的文本数据。
Clipboard.writeText()方法用于将文本内容写入剪贴板。






```
## grid布局(http://www.ruanyifeng.com/)
```
指定一个容器采用网格布局。注意，设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。
div {
  display: grid;
}


默认情况下，容器元素都是块级元素，但也可以设成行内元素。
div {
  display: inline-grid;
}








容器属性:
容器指定了网格布局以后，接着就要划分行和列。grid-template-columns属性定义每一列的列宽，grid-template-rows属性定义每一行的行高。
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
}
除了使用绝对单位，也可以使用百分比。
.container {
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
  grid-template-rows: 33.33% 33.33% 33.33%;
}
有时候，重复写同样的值非常麻烦，尤其网格很多时。这时，可以使用repeat()函数，简化重复的值。上面的代码用repeat()改写如下。
.container {
  display: grid;
  grid-template-columns: repeat(3, 33.33%); //grid-template-columns: repeat(2, 100px 20px 80px);
  grid-template-rows: repeat(3, 33.33%);
}


有时，单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用auto-fill关键字表示自动填充。
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
}

为了方便表示比例关系，网格布局提供了fr关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为1fr和2fr，就表示后者是前者的两倍。
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
fr可以与绝对长度的单位结合使用，这时会非常方便。
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;
}


minmax()函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。
grid-template-columns: 1fr 1fr minmax(100px, 1fr);


auto关键字表示由浏览器自己决定长度。
grid-template-columns: 100px auto 100px;


grid-template-columns属性和grid-template-rows属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用。
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}


传统的十二网格布局
grid-template-columns: repeat(12, 1fr);


grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）。
.container {
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}
grid-gap属性是grid-column-gap和grid-row-gap的合并简写形式，语法如下。
.container {
  grid-gap: 20px 20px;
}


网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。grid-template-areas属性用于定义区域。
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}
上面代码先划分出9个单元格，然后将其定名为a到i的九个区域，分别对应这九个单元格。
多个单元格合并成一个区域的写法如下。
grid-template-areas: 'a a a'
                     'b b b'
                     'c c c';
					 
					 
grid-template-areas: "header header header"
                     "main main sidebar"
                     "footer footer footer";					 
上面代码中，顶部是页眉区域header，底部是页脚区域footer，中间部分则为main和sidebar。
如果某些区域不需要利用，则使用"点"（.）表示。
grid-template-areas: 'a . c'
                     'd . f'
                     'g . i';
注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。



					 
划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行				 
这个顺序由grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。					 
设为row dense，表示"先行后列"，并且尽可能紧密填满，尽量不出现空格。					 
					 
					 
justify-items属性设置单元格内容的水平位置（左中右），align-items属性设置单元格内容的垂直位置（上中下）。					 
place-items属性是align-items属性和justify-items属性的合并简写形式。					 
place-items: start end;					 


justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。
place-content属性是align-content属性和justify-content属性的合并简写形式。
place-content: space-around space-evenly;







------------------------------------------------------------------------


项目属性:
grid-column-start属性：左边框所在的垂直网格线
grid-column-end属性：右边框所在的垂直网格线
grid-row-start属性：上边框所在的水平网格线
grid-row-end属性：下边框所在的水平网格线

这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。
这四个属性的值还可以使用span关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。
使用这四个属性，如果产生了项目的重叠，则使用z-index属性指定项目的重叠顺序。
grid-column属性是grid-column-start和grid-column-end的合并简写形式，grid-row属性是grid-row-start属性和grid-row-end的合并简写形式。
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
斜杠以及后面的部分可以省略，默认跨越一个网格。





grid-area属性指定项目放在哪一个区域。
.item-1 {
  grid-area: e;
}
grid-area属性还可用作grid-row-start、grid-column-start、grid-row-end、grid-column-end的合并简写形式，直接指定项目的位置。
.item-1 {
  grid-area: 1 / 1 / 3 / 3;
}



justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目。
align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目。
place-self属性是align-self属性和justify-self属性的合并简写形式。





					 
```











