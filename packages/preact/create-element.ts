import { options } from './options';
import {VNode, VNodeType, Props, ComponentChildren} from './types'


export function createElement<P>(type, props, children?) {
    if (props == null)
        props = {};
    if (arguments.length > 3) {
        children = [children];
        for (let i = 3; i < arguments.length; i++) {
            children.push(arguments[i]);
        }
    }
    if (children != null) {
        props.children = children;
    }
    if (type != null && type.defaultProps != null) {
        for (let i in type.defaultProps) {
            if (props[i] === undefined)
                props[i] = type.defaultProps[i];
        }
    }
    let ref = props.ref;
    if (ref)
        delete props.ref;
    let key = props.key;
    if (key)
        delete props.key;
    return createVNode<P>(type, props, null, key, ref);
}

export function createVNode<P>(type, props, text, key, ref) {
    const vnode: VNode<P> = {
        type,
        props,
        text,
        key,
        ref,
        _children: null,
        _dom: null,
        _lastDomChild: null,
        _component: null
    };
    if (options.vnode)
        options.vnode(vnode);
    return vnode;
}
export function createRef() {
    return {};
}
export function Fragment() { }
export function coerceToVNode(possibleVNode) {
    if (possibleVNode == null || typeof possibleVNode === 'boolean')
        return null;
    if (typeof possibleVNode === 'string' || typeof possibleVNode === 'number') {
        return createVNode(null, null, possibleVNode, null, null);
    }
    if (Array.isArray(possibleVNode)) {
        //@ts-ignore
        return createElement(Fragment, null, possibleVNode);
    }
    if (possibleVNode._dom != null) {
        return createVNode(possibleVNode.type, possibleVNode.props, possibleVNode.text, possibleVNode.key, null);
    }
    return possibleVNode;
}

export const h = createVNode