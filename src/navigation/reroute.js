import { getAppChanges } from '../applications/app'
import { started } from '../start'
import { toLoadPromise } from '../lifecycles/load'
import { toUnmountPromise } from '../lifecycles/unmount'
import { toBootstrapPromise } from '../lifecycles/bootstrap'
import { toMountPromise } from '../lifecycles/mount'

// 处理应用的核心方法
export function reroute() {
  // 需要知道哪些应用要加载
  // 需要知道哪些应用要挂载
  // 需要知道哪些应该要卸载
  const { appToLoad, appToMount, appToUnmount } = getAppChanges()

  console.log(appToLoad, appToMount, appToUnmount)

  if (started) {
    // app装载
    return performAppChanges()
  } else {
    // 注册应用需要预先加载
    return loadApps()
  }

  // 根据路径来挂载应用
  async function performAppChanges(app) {
    // 先卸载不需要的应用
    let unmountPromises = appToUnmount.map(toUnmountPromise)

    // 去加载需要的应用
    appToLoad.map(async (app) => {
      // 加载 => 启动 => 挂载
      app = await toLoadPromise(app)
      app = await toBootstrapPromise(app)
      return await toMountPromise(app)
    })
    appToMount.map(async (app) => {
      app = await toBootstrapPromise(app)
      return await toMountPromise(app)
    })
  }

  // 预加载应用
  async function loadApps() {
    // 获取到 传进来的 bootstrap，mount，unmount，然后放到 app 上
    let apps = await Promise.all(appToLoad.map(toLoadPromise))
  }
}
