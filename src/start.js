import { reroute } from './navigation/reroute'

export let started = false
export function start() {
  // start 需要是挂载子应用
  started = true
  reroute()
}
