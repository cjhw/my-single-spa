import { reroute } from './reroute'

export const routingEventsListeningTo = ['hashchange', 'popstate']

function urlReroute() {
  reroute([], arguments) // 会根据路径重新加载不同的应用
}

const capturedEventListeners = {
  // 后续挂载的事件先暂存起来
  hashchange: [],
  popstate: [],
}

// 拦截页面切换（hash改变,历史记录变换）,处理应用加载的逻辑在最前面
window.addEventListener('hashchange', urlReroute)
window.addEventListener('popstate', urlReroute)

// 除此之外，用户还可能绑定自己的路由事件，比如说vue-router
// 拦截所有注册的事件，以便确保这里的事件总是第一个执行
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

// 拦截加载的应用的事件
window.addEventListener = function (eventName, fn) {
  // 如果是 hash 改变事件，并且没缓存过，则先存起来
  if (
    routingEventsListeningTo.indexOf(eventName) >= 0 &&
    !capturedEventListeners[eventName].some((listener) => listener == fn)
  ) {
    capturedEventListeners[eventName].push(fn)
    return
  }
  return originalAddEventListener.apply(this, arguments)
}

window.removeEventListener = function (eventName, fn) {
  if (routingEventsListeningTo.indexOf(eventName) >= 0) {
    capturedEventListeners[eventName] = capturedEventListeners[
      eventName
    ].filter((l) => l !== fn)
    return
  }
  return originalRemoveEventListener.apply(this, arguments)
}

// 除了hash路由，还有浏览器路由
function patchedUpdateState(updateState, methodName) {
  return function () {
    const beforeUrl = window.location.href
    updateState.apply(this, arguments) // 调用切换页面路由的方法
    const afterUrl = window.location.href

    if (beforeUrl !== afterUrl) {
      urlReroute(new PopStateEvent('popstate')) // new PopStateEvent('popstate')  构建一个事件源
    }
  }
}

window.history.pushState = patchedUpdateState(
  window.history.pushState,
  'pushState'
)

window.history.replaceState = patchedUpdateState(
  window.history.replaceState,
  'replaceState'
)
