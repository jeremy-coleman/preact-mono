import { assign } from './util';
import { EMPTY_ARR } from './constants';
import { createVNode } from './create-element';

export function cloneElement(vnode, props) {
    props = assign(assign({}, vnode.props), props);
    if (arguments.length > 2)
        props.children = EMPTY_ARR.slice.call(arguments, 2);
    return createVNode(vnode.type, props, null, props.key || vnode.key, props.ref || vnode.ref);
}
