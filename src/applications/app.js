import {
  BOOTSTRAPPING,
  LOAD_SOURCE_CODE,
  MOUNTED,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  shouldBeActive,
} from './app.helpers'
import { reroute } from '../navigation/reroute'

/**
 * @param {*} appName     应用名称
 * @param {*} loadApp     加载的应用
 * @param {*} activeWhen  当激活的是会调用 loadApp
 * @param {*} customProps 自定义的属性
 */
const apps = []

export function registerApplication(appName, loadApp, activeWhen, customProps) {
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
  })
  reroute()
}

export function getAppChanges() {
  const appToLoad = [] // 需要加载的应用
  const appToMount = [] // 需要挂载的应用
  const appToUnmount = [] // 需要卸载的应用
  apps.forEach((app) => {
    const appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      case NOT_LOADED:
      case LOAD_SOURCE_CODE:
        if (appShouldBeActive) {
          appToLoad.push(app)
        }
        break
      case NOT_BOOTSTRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appToMount.push(app)
        }
        break
      case MOUNTED:
        if (!appShouldBeActive) {
          appToUnmount.push(app)
        }
        break
    }
  })

  return {
    appToLoad,
    appToMount,
    appToUnmount,
  }
}
