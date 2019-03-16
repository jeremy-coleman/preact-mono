export { diffChildren, toChildArray } from "./children";
export { cloneElement } from "./clone-element";
export { Component, enqueueRender } from "./component";
export { EMPTY_ARR, EMPTY_OBJ, IS_NON_DIMENSIONAL } from "./constants";
export { createContext, i } from "./create-context";
export { coerceToVNode, createElement, createRef, createVNode, createElement as h, Fragment} from "./create-element";
export { applyRef, commitRoot, diff, unmount } from "./diff";
export { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "./hooks";
export { options } from "./options";
export { diffProps } from "./props";
export { hydrate, render } from "./render";
export { Cleanup, ComponentChild, ComponentChildren, ComponentConstructor, ComponentHooks, Effect, EffectHookState, ForwardFn, FunctionalComponent, H, Hook, HookArgs, HookReturnValue, HookState, MemoHookState, PreactConsumer, PreactContext, PreactElement, PreactProvider, Reducer, ReducerHookState, Ref, StateUpdater, VNode } from "./types";
export { assign, removeNode } from "./util";

export * from './types'
import * as React from './compat'
export {React}