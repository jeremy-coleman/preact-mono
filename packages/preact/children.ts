import { diff, unmount } from './diff';
import { coerceToVNode, Fragment } from './create-element';
import { EMPTY_OBJ, EMPTY_ARR } from './constants';
import { removeNode } from './util';



export function diffChildren(parentDom, newParentVNode, oldParentVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent) {
    let childVNode, i, j, p, index, oldVNode, newDom, nextDom, sibDom, focus, childDom;
    let newChildren = newParentVNode._children || toChildArray(newParentVNode.props.children, newParentVNode._children = [], coerceToVNode);
    let oldChildren = oldParentVNode != null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR;
    let oldChildrenLength = oldChildren.length;
    childDom = oldChildrenLength ? oldChildren[0] && oldChildren[0]._dom : null;
    if (excessDomChildren != null) {
        for (i = 0; i < excessDomChildren.length; i++) {
            if (excessDomChildren[i] != null) {
                childDom = excessDomChildren[i];
                break;
            }
        }
    }
    for (i = 0; i < newChildren.length; i++) {
        childVNode = newChildren[i] = coerceToVNode(newChildren[i]);
        oldVNode = index = null;
        p = oldChildren[i];
        if (p != null && (childVNode.key == null && p.key == null ? (childVNode.type === p.type) : (childVNode.key === p.key))) {
            index = i;
        }
        else {
            for (j = 0; j < oldChildrenLength; j++) {
                p = oldChildren[j];
                if (p != null) {
                    if (childVNode.key == null && p.key == null ? (childVNode.type === p.type) : (childVNode.key === p.key)) {
                        index = j;
                        break;
                    }
                }
            }
        }
        if (index != null) {
            oldVNode = oldChildren[index];
            oldChildren[index] = null;
        }
        nextDom = childDom != null && childDom.nextSibling;
        newDom = diff(oldVNode == null ? null : oldVNode._dom, parentDom, childVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent, null);
        if (childVNode != null && newDom != null) {
            focus = document.activeElement;
            if (childVNode._lastDomChild != null) {
                newDom = childVNode._lastDomChild;
            }
            else if (excessDomChildren == oldVNode || newDom != childDom || newDom.parentNode == null) {
                outer: if (childDom == null || childDom.parentNode !== parentDom) {
                    parentDom.appendChild(newDom);
                }
                else {
                    sibDom = childDom;
                    j = 0;
                    while ((sibDom = sibDom.nextSibling) && j++ < oldChildrenLength / 2) {
                        if (sibDom === newDom) {
                            break outer;
                        }
                    }
                    parentDom.insertBefore(newDom, childDom);
                }
            }
            if (focus !== document.activeElement) {
                focus.focus();
            }
            childDom = newDom != null ? newDom.nextSibling : nextDom;
        }
    }
    if (excessDomChildren != null && newParentVNode.type !== Fragment)
        for (i = excessDomChildren.length; i--;)
            if (excessDomChildren[i] != null)
                removeNode(excessDomChildren[i]);
    for (i = oldChildrenLength; i--;)
        if (oldChildren[i] != null)
            unmount(oldChildren[i], ancestorComponent);
}

export function toChildArray(children, flattened?, map?) {
    if (flattened == null)
        flattened = [];
    if (children == null || typeof children === 'boolean') { }
    else if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            toChildArray(children[i], flattened);
        }
    }
    else {
        flattened.push(map ? map(children) : children);
    }
    return flattened;
}
