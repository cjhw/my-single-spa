import { MOUNTED, NOT_MOUNTED, UNMOUNTING } from '../applications/app.helpers'

export async function toUnmountPromise(app) {
  // 如果当前的应用还没挂载，就不处理
  if (app.status !== MOUNTED) {
    return app
  }
  app.status = UNMOUNTING
  await app.unmount(app.customProps)
  app.status = NOT_MOUNTED
  return app
}
