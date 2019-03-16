import { assign } from './util';
import { diff, commitRoot } from './diff';
import { options } from './options';
import { Fragment } from './create-element';

export function Component<P>(props: P, context) {
    this.props = props;
    this.context = context;
}

Component.prototype.setState = function (update, callback) {
    let s = (this._nextState !== this.state && this._nextState) || (this._nextState = assign({}, this.state));
    if (typeof update !== 'function' || (update = update(s, this.props))) {
        assign(s, update);
    }
    if (update == null)
        return;
    if (callback)
        this._renderCallbacks.push(callback);
    enqueueRender(this);
};

Component.prototype.forceUpdate = function (callback) {
    let vnode = this._vnode, dom = this._vnode._dom, parentDom = this._parentDom;
    if (parentDom) {
        const force = callback !== false;
        let mounts = [];
        dom = diff(dom, parentDom, vnode, vnode, this._context, parentDom.ownerSVGElement !== undefined, null, mounts, this._ancestorComponent, force);
        if (dom != null && dom.parentNode !== parentDom) {
            parentDom.appendChild(dom);
        }
        commitRoot(mounts, vnode);
    }
    if (callback)
        callback();
};

Component.prototype.render = Fragment;
let q = [];
const defer = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
export function enqueueRender(c) {
    if (!c._dirty && (c._dirty = true) && q.push(c) === 1) {
        (options.debounceRendering || defer)(process);
    }
}

function process() {
    let p;
    while ((p = q.pop())) {
        if (p._dirty)
            p.forceUpdate(false);
    }
}
