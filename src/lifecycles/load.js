import { LOAD_SOURCE_CODE, NOT_BOOTSTRAPPED } from '../applications/app.helpers'

function flattenFnArray(fns) {
  fns = Array.isArray(fns) ? fns : [fns]
  return (props) =>
    fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
}

export async function toLoadPromise(app) {
  // 避免调用两次 loadApp 缓存机制
  if (app.loadPromise) {
    return app.loadPromise
  }

  return (app.loadPromise = Promise.resolve().then(async () => {
    app.status = LOAD_SOURCE_CODE
    let { bootstrap, mount, unmount } = await app.loadApp(app.customProps)
    app.status = NOT_BOOTSTRAPPED // 此时还没调用 bootstrap 方法

    // 可能传入的 bootstrap, mount, unmount 是数组，所以需要处理，将多个promise组合在一起
    app.bootstrap = flattenFnArray(bootstrap)
    app.mount = flattenFnArray(mount)
    app.unmount = flattenFnArray(unmount)
    delete app.loadPromise
    return app
  }))
}
