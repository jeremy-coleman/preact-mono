
import {VNode} from './types'

//const x = document.dispatchEvent

export type E<T = any> = (Event | CustomEvent<T>) & {
  persist: Object,
  nativeEvent: any
}

type Options = {
      vnode?(vnode: VNode): void;
      commit?(vnode: VNode): void;
      unmount?(vnode: VNode): void;
      diff?(vnode: VNode): void;
      render?(vnode: VNode): void;
      diffed?(vnode: VNode): void;
      event?<T = any>(e: E<T>): void;
      debounceRendering?: unknown
      requestAnimationFrame?(callback): void
  }

export const options: Partial<Options> = {};

export default options;
