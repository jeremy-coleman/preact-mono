import { EMPTY_OBJ, EMPTY_ARR } from './constants';
import { Component, enqueueRender } from './component';
import { coerceToVNode, Fragment } from './create-element';
import { diffChildren, toChildArray } from './children';
import { diffProps } from './props';
import { assign, removeNode } from './util';
import { options } from './options';
export { toChildArray, diffChildren };
export function diff(dom, parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent, force) {
    if (oldVNode == null || newVNode == null || oldVNode.type !== newVNode.type) {
        if (oldVNode != null)
            unmount(oldVNode, ancestorComponent);
        if (newVNode == null)
            return null;
        dom = null;
        oldVNode = EMPTY_OBJ;
    }
    if (options.diff)
        options.diff(newVNode);
    let c, p, isNew = false, oldProps, oldState, oldContext, newType = newVNode.type;
    let clearProcessingException;
    try {
        outer: if (oldVNode.type === Fragment || newType === Fragment) {
            diffChildren(parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, c);
            if (newVNode._children.length) {
                dom = newVNode._children[0]._dom;
                newVNode._lastDomChild = newVNode._children[newVNode._children.length - 1]._dom;
            }
        }
        else if (typeof newType === 'function') {
            let cxType = newType.contextType;
            let provider = cxType && context[cxType._id];
            let cctx = cxType != null ? (provider ? provider.props.value : cxType._defaultValue) : context;
            if (oldVNode._component) {
                c = newVNode._component = oldVNode._component;
                clearProcessingException = c._processingException;
            }
            else {
                isNew = true;
                if (newType.prototype && newType.prototype.render) {
                    newVNode._component = c = new newType(newVNode.props, cctx);
                }
                else {
                    newVNode._component = c = new Component(newVNode.props, cctx);
                    c.constructor = newType;
                    c.render = doRender;
                }
                c._ancestorComponent = ancestorComponent;
                if (provider)
                    provider.sub(c);
                c.props = newVNode.props;
                if (!c.state)
                    c.state = {};
                c.context = cctx;
                c._context = context;
                c._dirty = true;
                c._renderCallbacks = [];
            }
            c._vnode = newVNode;
            let s = c._nextState || c.state;
            if (newType.getDerivedStateFromProps != null) {
                oldState = assign({}, c.state);
                if (s === c.state)
                    s = assign({}, s);
                assign(s, newType.getDerivedStateFromProps(newVNode.props, s));
            }
            if (isNew) {
                if (newType.getDerivedStateFromProps == null && c.componentWillMount != null)
                    c.componentWillMount();
                if (c.componentDidMount != null)
                    mounts.push(c);
            }
            else {
                if (newType.getDerivedStateFromProps == null && force == null && c.componentWillReceiveProps != null) {
                    c.componentWillReceiveProps(newVNode.props, cctx);
                    s = c._nextState || c.state;
                }
                if (!force && c.shouldComponentUpdate != null && c.shouldComponentUpdate(newVNode.props, s, cctx) === false) {
                    c.props = newVNode.props;
                    c.state = s;
                    c._dirty = false;
                    break outer;
                }
                if (c.componentWillUpdate != null) {
                    c.componentWillUpdate(newVNode.props, s, cctx);
                }
            }
            oldProps = c.props;
            if (!oldState)
                oldState = c.state;
            oldContext = c.context = cctx;
            c.props = newVNode.props;
            c.state = s;
            if (options.render)
                options.render(newVNode);
            let prev = c._prevVNode;
            let vnode = c._prevVNode = coerceToVNode(c.render(c.props, c.state, c.context));
            c._dirty = false;
            if (c.getChildContext != null) {
                context = assign(assign({}, context), c.getChildContext());
            }
            if (!isNew && c.getSnapshotBeforeUpdate != null) {
                oldContext = c.getSnapshotBeforeUpdate(oldProps, oldState);
            }
            c.base = dom = diff(dom, parentDom, vnode, prev, context, isSvg, excessDomChildren, mounts, c, null);
            if (vnode != null) {
                newVNode._lastDomChild = vnode._lastDomChild;
            }
            c._parentDom = parentDom;
            if (newVNode.ref)
                applyRef(newVNode.ref, c, ancestorComponent);
        }
        else {
            dom = diffElementNodes(dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent);
            if (newVNode.ref && (oldVNode.ref !== newVNode.ref)) {
                applyRef(newVNode.ref, dom, ancestorComponent);
            }
        }
        newVNode._dom = dom;
        if (c != null) {
            while (p = c._renderCallbacks.pop())
                p.call(c);
            if (!isNew && oldProps != null && c.componentDidUpdate != null) {
                c.componentDidUpdate(oldProps, oldState, oldContext);
            }
        }
        if (clearProcessingException) {
            c._processingException = null;
        }
        if (options.diffed)
            options.diffed(newVNode);
    }
    catch (e) {
        catchErrorInComponent(e, ancestorComponent);
    }
    return dom;
}
export function commitRoot(mounts, root) {
    let c;
    while ((c = mounts.pop())) {
        try {
            c.componentDidMount();
        }
        catch (e) {
            catchErrorInComponent(e, c._ancestorComponent);
        }
    }
    if (options.commit)
        options.commit(root);
}
function diffElementNodes(dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent) {
    let d = dom;
    isSvg = newVNode.type === 'svg' || isSvg;
    if (dom == null && excessDomChildren != null) {
        for (let i = 0; i < excessDomChildren.length; i++) {
            const child = excessDomChildren[i];
            if (child != null && (newVNode.type === null ? child.nodeType === 3 : child.localName === newVNode.type)) {
                dom = child;
                excessDomChildren[i] = null;
                break;
            }
        }
    }
    if (dom == null) {
        dom = newVNode.type === null ? document.createTextNode(newVNode.text) : isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type) : document.createElement(newVNode.type);
        excessDomChildren = null;
    }
    newVNode._dom = dom;
    if (newVNode.type === null) {
        if ((d === null || dom === d) && newVNode.text !== oldVNode.text) {
            dom.data = newVNode.text;
        }
    }
    else {
        if (excessDomChildren != null && dom.childNodes != null) {
            excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
        }
        if (newVNode !== oldVNode) {
            let oldProps = oldVNode.props;
            if (oldProps == null) {
                oldProps = {};
                if (excessDomChildren != null) {
                    for (let i = 0; i < dom.attributes.length; i++) {
                        oldProps[dom.attributes[i].name] = dom.attributes[i].value;
                    }
                }
            }
            let oldHtml = oldProps.dangerouslySetInnerHTML;
            let newHtml = newVNode.props.dangerouslySetInnerHTML;
            if (newHtml || oldHtml) {
                if (!newHtml || !oldHtml || newHtml.__html != oldHtml.__html) {
                    dom.innerHTML = newHtml && newHtml.__html || '';
                }
            }
            if (newVNode.props.multiple) {
                dom.multiple = newVNode.props.multiple;
            }
            diffChildren(dom, newVNode, oldVNode, context, newVNode.type === 'foreignObject' ? false : isSvg, excessDomChildren, mounts, ancestorComponent);
            diffProps(dom, newVNode.props, oldProps, isSvg);
        }
    }
    return dom;
}
export function applyRef(ref, value, ancestorComponent) {
    try {
        if (typeof ref == 'function')
            ref(value);
        else
            ref.current = value;
    }
    catch (e) {
        catchErrorInComponent(e, ancestorComponent);
    }
}
export function unmount(vnode, ancestorComponent, skipRemove?) {
    let r;
    if (options.unmount)
        options.unmount(vnode);
    if (r = vnode.ref) {
        applyRef(r, null, ancestorComponent);
    }
    if (!skipRemove && vnode._lastDomChild == null && (skipRemove = ((r = vnode._dom) != null)))
        removeNode(r);
    vnode._dom = vnode._lastDomChild = null;
    if ((r = vnode._component) != null) {
        if (r.componentWillUnmount) {
            try {
                r.componentWillUnmount();
            }
            catch (e) {
                catchErrorInComponent(e, ancestorComponent);
            }
        }
        r.base = r._parentDom = null;
        if (r = r._prevVNode)
            unmount(r, ancestorComponent, skipRemove);
    }
    else if (r = vnode._children) {
        for (let i = 0; i < r.length; i++) {
            unmount(r[i], ancestorComponent, skipRemove);
        }
    }
}
function doRender(props, state, context) {
    return this.constructor(props, context);
}
function catchErrorInComponent(error, component) {
    for (; component; component = component._ancestorComponent) {
        if (!component._processingException) {
            try {
                if (component.constructor.getDerivedStateFromError != null) {
                    component.setState(component.constructor.getDerivedStateFromError(error));
                }
                else if (component.componentDidCatch != null) {
                    component.componentDidCatch(error);
                }
                else {
                    continue;
                }
                return enqueueRender(component._processingException = component);
            }
            catch (e) {
                error = e;
            }
        }
    }
    throw error;
}
