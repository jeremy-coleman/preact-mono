import { IS_NON_DIMENSIONAL } from './constants';
import { options, E } from './options';
export function diffProps(dom, newProps, oldProps, isSvg) {
    for (let i in newProps) {
        if (i !== 'children' && i !== 'key' && (!oldProps || oldProps[i] != newProps[i])) {
            setProperty(dom, i, newProps[i], oldProps[i], isSvg);
        }
    }
    for (let i in oldProps) {
        if (i !== 'children' && i !== 'key' && (!newProps || !(i in newProps))) {
            setProperty(dom, i, null, oldProps[i], isSvg);
        }
    }
}
let CAMEL_REG = /-?(?=[A-Z])/g;
function setProperty(dom, name, value, oldValue, isSvg) {
    let v;
    if (name === 'class' || name === 'className')
        name = isSvg ? 'class' : 'className';
    if (name === 'style') {
        let s = dom.style;
        if (typeof value === 'string') {
            s.cssText = value;
        }
        else {
            if (typeof oldValue === 'string')
                s.cssText = '';
            for (let i in oldValue) {
                if (value == null || !(i in value))
                    s.setProperty(i.replace(CAMEL_REG, '-'), '');
            }
            for (let i in value) {
                v = value[i];
                if (oldValue == null || v !== oldValue[i]) {
                    s.setProperty(i.replace(CAMEL_REG, '-'), typeof v === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? (v + 'px') : v);
                }
            }
        }
    }
    else if (name === 'dangerouslySetInnerHTML') {
        return;
    }
    else if (name[0] === 'o' && name[1] === 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''));
        let nameLower = name.toLowerCase();
        name = (nameLower in dom ? nameLower : name).substring(2);
        if (value) {
            if (!oldValue)
                dom.addEventListener(name, eventProxy, useCapture);
        }
        else {
            dom.removeEventListener(name, eventProxy, useCapture);
        }
        (dom._listeners || (dom._listeners = {}))[name] = value;
    }
    else if (name !== 'list' && !isSvg && (name in dom)) {
        dom[name] = value == null ? '' : value;
    }
    else if (value == null || value === false) {
        dom.removeAttribute(name);
    }
    else if (typeof value !== 'function') {
        dom.setAttribute(name, value);
    }
}

function eventProxy(e: E<any>) {
    return this._listeners[e.type](options.event ? options.event(e) : e);
}
