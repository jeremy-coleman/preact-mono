//import { cloneElement as preactCloneElement, Component, createContext, createRef, Fragment, h, options, render as preactRender, toChildArray } from './react';

import { render as preactRender } from './render';
import { createElement as h, Fragment, createRef } from './create-element';
import { Component } from './component';
import { cloneElement as preactCloneElement } from './clone-element';
import { createContext } from './create-context';
import { toChildArray } from './children';
import { options } from './options';


const version = '16.8.0';
const REACT_ELEMENT_TYPE = (typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element')) || 0xeac7;
const CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;


let oldEventHook = options.event;


options.event = e => {
    //@ts-ignore
    if (oldEventHook) e = oldEventHook(e);
    e.persist = Object;
    e.nativeEvent = e;
    return e;
};
function createFactory(type) {
    return createElement.bind(null, type);
}
function handleElementVNode(vnode, props) {
    let shouldSanitize, attrs, i;
    for (i in props)
        if ((shouldSanitize = CAMEL_PROPS.test(i)))
            break;
    if (shouldSanitize) {
        attrs = vnode.props = {};
        for (i in props) {
            attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = props[i];
        }
    }
}
function render(vnode, parent, callback?) {
    preactRender(vnode, parent);
    if (typeof callback === 'function')
        callback();
    return vnode != null ? vnode._component : null;
}

class ContextProvider {
    props: any;
    getChildContext() {
        return this.props.context;
    }
    render(props) {
        return props.children;
    }
}

function Portal(props) {
    let wrap = h(ContextProvider, { context: this.context }, props.vnode);
    render(wrap, props.container);
    return null;
}

function createPortal(vnode, container) {
    return h(Portal, { vnode, container });
}
const mapFn = (children, fn) => {
    if (children == null)
        return null;
    children = toChildArray(children);
    return children.map(fn);
};
let Children = {
    map: mapFn,
    forEach: mapFn,
    count(children) {
        return children ? toChildArray(children).length : 0;
    },
    only(children) {
        children = toChildArray(children);
        if (children.length !== 1)
            throw new Error('Children.only() expects only one child.');
        return children[0];
    },
    toArray: toChildArray
};

function createElement(...args) {
    //@ts-ignore
    let vnode = h(...args);
    let type = vnode.type, props = vnode.props;
    if (typeof type != 'function') {
        if (props.defaultValue) {
            if (!props.value && props.value !== 0) {
                props.value = props.defaultValue;
            }
            delete props.defaultValue;
        }
        if (Array.isArray(props.value) && props.multiple && type === 'select') {
            toChildArray(props.children).forEach((child) => {
                if (props.value.indexOf(child.props.value) !== -1) {
                    child.props.selected = true;
                }
            });
            delete props.value;
        }
        handleElementVNode(vnode, props);
    }
    vnode.preactCompatNormalized = false;
    return normalizeVNode(vnode);
}
function normalizeVNode(vnode) {
    vnode.preactCompatNormalized = true;
    applyClassName(vnode);
    applyEventNormalization(vnode);
    return vnode;
}
function cloneElement(element) {
    if (!isValidElement(element))
        return element;
    let vnode = normalizeVNode(preactCloneElement.apply(null, arguments));
    vnode.$$typeof = REACT_ELEMENT_TYPE;
    return vnode;
}
function isValidElement(element) {
    return element != null && element.$$typeof === REACT_ELEMENT_TYPE;
}
function applyEventNormalization({ type, props }) {
    if (!props || typeof type !== 'string')
        return;
    let newProps = {};
    for (let i in props) {
        newProps[i.toLowerCase()] = i;
    }
    //@ts-ignore
    if (newProps.ondoubleclick) {
        //@ts-ignore
        props.ondblclick = props[newProps.ondoubleclick];
        //@ts-ignore
        delete props[newProps.ondoubleclick];
    }
    //@ts-ignore
    if (newProps.onbeforeinput) {
        //@ts-ignore
        props.onbeforeinput = props[newProps.onbeforeinput];
        //@ts-ignore
        delete props[newProps.onbeforeinput];
    }
    //@ts-ignore
    if (newProps.onchange && (type === 'textarea' || (type.toLowerCase() === 'input' && !/^fil|che|rad/i.test(props.type)))) {
        //@ts-ignore
        let normalized = newProps.oninput || 'oninput';
        if (!props[normalized]) {
            //@ts-ignore
            props[normalized] = props[newProps.onchange];
            //@ts-ignore
            delete props[newProps.onchange];
        }
    }
}
function unmountComponentAtNode(container) {
    if (container._prevVNode != null) {
        preactRender(null, container);
        return true;
    }
    return false;
}
function applyClassName(vnode) {
    let a = vnode.props;
    if (a.class || a.className) {
        //@ts-ignore
        classNameDescriptor.enumerable = 'className' in a;
        if (a.className)
            a.class = a.className;
        Object.defineProperty(a, 'className', classNameDescriptor);
    }
}
let classNameDescriptor = {
    configurable: true,
    get() { return this.class; }
};
function shallowDiffers(a, b) {
    for (let i in a)
        if (!(i in b))
            return true;
    for (let i in b)
        if (a[i] !== b[i])
            return true;
    return false;
}
function findDOMNode(component) {
    return component && (component.base || component.nodeType === 1 && component) || null;
}

//@ts-ignore
class PureComponent extends Component {
    constructor(props) {
        super(props);
        //@ts-ignore
        this.isPureReactComponent = true;
    }
    shouldComponentUpdate(props, state) {
        //@ts-ignore
        return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    }
}

Component.prototype.isReactComponent = {};

function memo(c, comparer?) {
    function shouldUpdate(nextProps) {
        let ref = this.props.ref;
        let updateRef = ref == nextProps.ref;
        if (!updateRef) {
            ref.call ? ref(null) : (ref.current = null);
        }
        return (comparer == null
            ? shallowDiffers(this.props, nextProps)
            : !comparer(this.props, nextProps)) || !updateRef;
    }
    function Memoed(props) {
        this.shouldComponentUpdate = shouldUpdate;
        return h(c, { ...props });
    }
    Memoed.displayName = 'Memo(' + (c.displayName || c.name) + ')';
    Memoed._forwarded = true;
    return Memoed;
}

function setUnsafeDescriptor(obj, key) {
    Object.defineProperty(obj.prototype, 'UNSAFE_' + key, {
        configurable: true,
        get() { return this[key]; },
        set(v) { this[key] = v; }
    });
}

setUnsafeDescriptor(Component, 'componentWillMount');
setUnsafeDescriptor(Component, 'componentWillReceiveProps');
setUnsafeDescriptor(Component, 'componentWillUpdate');

function forwardRef(fn) {
    function Forwarded(props) {
        let ref = props.ref;
        delete props.ref;
        return fn(props, ref);
    }
    Forwarded._forwarded = true;
    Forwarded.displayName = 'ForwardRef(' + (fn.displayName || fn.name) + ')';
    return Forwarded;
}

let oldVNodeHook = options.vnode;

options.vnode = vnode => {
    vnode.$$typeof = REACT_ELEMENT_TYPE;
    let type = vnode.type;
    //@ts-ignore
    if (type != null && type._forwarded && vnode.ref != null) {
        vnode.props.ref = vnode.ref;
        vnode.ref = null;
    }
    if (oldVNodeHook)
        oldVNodeHook(vnode);
};
export { version, Children, render, render as hydrate, unmountComponentAtNode, createPortal, createElement, createContext, createFactory, cloneElement, createRef, Fragment, isValidElement, findDOMNode, Component, PureComponent, memo, forwardRef };

