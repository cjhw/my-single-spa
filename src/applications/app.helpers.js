export const NOT_LOADED = 'NOT_LOADED' // 未加载，应用初始状态
export const LOAD_SOURCE_CODE = 'LOAD_SOURCE_CODE' // 加载app代码中
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED' // 还没调用 bootstrap 方法
export const BOOTSTRAPPING = 'BOOTSTRAPPING' // 启动中
export const NOT_MOUNTED = 'NOT_MOUNTED' // 还没调用 mount 方法
export const MOUNTING = 'MOUNTING' // 挂载中
export const MOUNTED = 'MOUNTED' // 挂载成功
export const UNMOUNTING = 'UNMOUNTING' // 卸载中
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN' // 加载时参数校验未通过
export const LOAD_ERROR = 'LOAD_ERROR' // 加载时遇到致命错误
export const UPDATING = 'UPDATING' // 更新中

// 判断当前应用是否被激活
export function isActive(app) {
  return app.status === MOUNTED
}

export function isntActive(app) {
  return !isActive(app)
}

// 判断当前应用是否要被激活
export function shouldBeActive(app) {
  try {
    // 如果返回true，则是路径匹配，说明当前应用需要被激活
    // 那么应用应该要开始初始化
    return app.activeWhen(window.location)
  } catch (e) {
    app.status = SKIP_BECAUSE_BROKEN
    throw e
  }
}
