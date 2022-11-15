import { getAppChanges } from '../applications/app'
import { started } from '../start'

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
  async function performAppChanges(app) {}

  // 预加载应用
  async function loadApps() {}
}
