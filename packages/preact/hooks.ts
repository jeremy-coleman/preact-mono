import { options } from './options';
import {VNode} from './types'

import { PreactContext } from './types';

type Inputs = ReadonlyArray<unknown>;
export type StateUpdater<S> = (value: S | ((prevState: S) => S)) => void;
export type Reducer<S,A> = (prevState: S, action: A) => S;
type EffectCallback = () => (void | (() => void));

let currentIndex;
let currentComponent;
let afterPaintEffects = [];

let oldBeforeRender = options.render;

options.render = (vnode: VNode) => {
    if (oldBeforeRender)
        oldBeforeRender(vnode);
    currentComponent = vnode._component;
    currentIndex = 0;
    if (!currentComponent.__hooks)
        return;
    currentComponent.__hooks._pendingEffects.forEach(invokeEffect);
    currentComponent.__hooks._pendingEffects = [];
};

let oldAfterDiff = options.diffed;

options.diffed = vnode => {
    if (oldAfterDiff)
        oldAfterDiff(vnode);
    const c = vnode._component;
    if (!c)
        return;
    const hooks = c.__hooks;
    if (!hooks)
        return;
    hooks._pendingLayoutEffects.forEach(invokeEffect);
    hooks._pendingLayoutEffects = [];
};

let oldBeforeUnmount = options.unmount;

options.unmount = vnode => {
    if (oldBeforeUnmount)
        oldBeforeUnmount(vnode);
    const c = vnode._component;
    if (!c)
        return;
    const hooks = c.__hooks;
    if (!hooks)
        return;
    hooks._list.forEach(hook => hook._cleanup && hook._cleanup());
};

function getHookState(index) {
    const hooks = currentComponent.__hooks || (currentComponent.__hooks = { _list: [], _pendingEffects: [], _pendingLayoutEffects: [] });
    if (index >= hooks._list.length) {
        hooks._list.push({});
    }
    return hooks._list[index];
}

export function useState<T =  any>(initialState: T): [T, StateUpdater<T>] {
    return useReducer(invokeOrReturn, initialState);
}


export function useReducer<S, A, I>(reducer:Reducer<S,A>, initialState:I, init?:(arg: I)=> S): [S, (action: A) => void] {
    const hookState = getHookState(currentIndex++);
    if (hookState._component == null) {
        hookState._component = currentComponent;
        hookState._value = [
            init && init(initialState) || invokeOrReturn(null, initialState),
            //init == null ? invokeOrReturn(null, initialState) : init(initialState),
            action => {
                hookState._value[0] = reducer(hookState._value[0], action);
                hookState._component.setState({});
            }
        ];
    }
    return hookState._value;
}

export function useEffect(callback: EffectCallback, args?: Inputs) {
    const state = getHookState(currentIndex++);
    if (argsChanged(state._args, args)) {
        state._value = callback;
        state._args = args;
        currentComponent.__hooks._pendingEffects.push(state);
        afterPaint(currentComponent);
    }
}

export function useLayoutEffect(callback: EffectCallback, args?: Inputs) {
    const state = getHookState(currentIndex++);
    if (argsChanged(state._args, args)) {
        state._value = callback;
        state._args = args;
        currentComponent.__hooks._pendingLayoutEffects.push(state);
    }
}

type RefClosure<T = unknown> = ({ current: T } | { readonly current?: T})
export function useRef<T>(initialValue): RefClosure<T> {
    const state = getHookState(currentIndex++);
    if (state._value == null) {
        state._value = { current: initialValue };
    }
    return state._value;
}

export function useMemo<T>(callback: () => T, inputs?: Inputs): T {
    const state = getHookState(currentIndex++);
    if (argsChanged(state._args, inputs)) {
        state._args = inputs;
        state._callback = callback;
        return state._value = callback();
    }
    return state._value;
}



export function useCallback<T extends Function>(callback: T, args: Inputs): T {
    return useMemo(() => callback, args);
}

export function useContext<T>(context: PreactContext<T>): T {
    const provider = currentComponent.context[context._id];
    if (provider == null)
        return context._defaultValue;
    const state = getHookState(currentIndex++);
    if (state._value == null) {
        state._value = true;
        provider.sub(currentComponent);
    }
    return provider.props.value;
}

let afterPaint = (c?) => {};

function flushAfterPaintEffects() {
    afterPaintEffects.forEach(component => {
        component._afterPaintQueued = false;
        if (!component._parentDom)
            return;
        component.__hooks._pendingEffects.forEach(invokeEffect);
        component.__hooks._pendingEffects = [];
    });
    afterPaintEffects = [];
}

function scheduleFlushAfterPaint() {
    setTimeout(flushAfterPaintEffects, 0);
}


if (typeof window !== 'undefined') {
    afterPaint = (component?) => {
        if (!component._afterPaintQueued && (component._afterPaintQueued = true) && afterPaintEffects.push(component) === 1) {
            if (options.requestAnimationFrame) {
                options.requestAnimationFrame(flushAfterPaintEffects);
            }
            else {
                requestAnimationFrame(scheduleFlushAfterPaint);
            }
        }
    };
}
function invokeEffect(hook) {
    if (hook._cleanup)
        hook._cleanup();
    const result = hook._value();
    if (typeof result === 'function')
        hook._cleanup = result;
}
function argsChanged(oldArgs, newArgs) {
    return oldArgs == null || newArgs.some((arg, index) => arg !== oldArgs[index]);
}
function invokeOrReturn(arg, f) {
    return typeof f === 'function' ? f(arg) : f;
}
