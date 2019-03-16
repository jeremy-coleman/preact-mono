import { commitRoot, diffChildren } from './diff';
import { EMPTY_ARR, EMPTY_OBJ } from './constants';
import { createElement, Fragment } from './create-element';

import {ComponentChild} from './types'

type Parent =  Element | Document | ShadowRoot | DocumentFragment;
type P = Parent & { _prevVNode: any, ownerSVGElement?: any}

export function render(vnode: ComponentChild, parentDom?: P) {
    let oldVNode = parentDom._prevVNode;
    vnode = createElement(Fragment, null, [vnode]);
    let mounts = [];
    diffChildren(parentDom, parentDom._prevVNode = vnode, oldVNode, EMPTY_OBJ, parentDom.ownerSVGElement !== undefined, oldVNode ? null : EMPTY_ARR.slice.call(parentDom.childNodes), mounts, vnode);
    commitRoot(mounts, vnode);
}
export function hydrate(vnode, parentDom) {
    parentDom._prevVNode = null;
    render(vnode, parentDom);
}
