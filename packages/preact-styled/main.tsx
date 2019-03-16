import {h} from 'preact'
import { CSSProperties , JSX} from 'preact';


//new CSSRuleList() //items, length
//let r = new CSSStyleRule

//was using this like this, jus took context out though idk, deal later
//{theme: defined(context.theme, props.theme, pallete: 'none')}
const defined = (...args) => {
  for (var i = 0; i < args.length; i++) {
    if (args[i] !== undefined) return args[i]
  }
}

let cache = {}
let prefix = 'x'

let gettableRules: CSSRuleList
let rules: CSSStyleRule[] = []
let insert = (rule: CSSStyleRule) => void rules.push(rule)

const hyph = s => s.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
const mx = (rule, media) => (media ? `${media}{${rule}}` : rule)
const rx = (cn, prop, val) => `.${cn}{${hyph(prop)}:${val}}`
const noAnd = s => s.replace(/&/g, '')
const parse = (obj, child = '', media?) =>
  Object.keys(obj)
    .map(key => {
      const val = obj[key]
      if (val === null) return ''
      if (typeof val === 'object') {
        const m2 = /^@/.test(key) ? key : null
        const c2 = m2 ? child : child + key
        return parse(val, c2, m2 || media)
      }
      const _key = key + val + child + media
      if (cache[_key]) return cache[_key]
      const className = prefix + rules.length.toString(36)
      insert(mx(rx(className + noAnd(child), key, val), media))
      cache[_key] = className
      return className
    })
    .join(' ')


const cxs = (...styles) => styles.map(style => parse(style)).join(' ').trim();

cxs.css = () => rules.sort().join('')

cxs.reset = () => {
  cache = {}
  while (rules.length) rules.pop()
}

cxs.prefix = val => (prefix = val)

if (typeof document !== 'undefined') {
  const sheet = document.head.appendChild(document.createElement('style')).sheet as CSSStyleSheet
  insert = (rule: CSSStyleRule & string) => {
    rules.push(rule as CSSStyleRule)
    sheet.insertRule(rule, sheet.cssRules.length)
  }
}

type DomProps = Partial<JSX.HTMLAttributes>
type CSX = { css?: CSSProperties }
type StyledCSX = DomProps & CSX

type Proptional<P> = CSSProperties | ((...args: P[]) => CSSProperties)

function styled<P>(C) {
  return (...args: Proptional<P>[]) => {
    const Comp = (props: P & StyledCSX) => {
      const stylePropKeys = [...Object.keys({}), 'css']
      //const styleProps = Object.assign({ theme: defined(context.theme, props.theme, {}) }, props)

      const next: any = {}
      for (let key in props) {
        if (stylePropKeys.includes(key)) continue
        next[key] = props[key]
      }

      next.className = [
        next.className,
        ...args
          .map(proptional => (typeof proptional === 'function' ? proptional(props) : proptional))
          .filter(s => !!s)
          .map(s => cxs(s)),
        cxs(props.css || {}),
      ]
        .join(' ')
        .trim()

      return h(C, next)
    }

    return Comp
  }
}


export { cxs }
export { styled }
export default styled


// type StyledComponent = {
//   children,
//   css,
//   className,
//   clone,
//   component
// }

// function omit(input, fields, output = {}) {
//   Object.keys(input).forEach(prop => {
//     if (fields.indexOf(prop) === -1) {
//       output[prop] = input[prop];
//     }
//   })
//   return output
// }

// export function styledMaybe<P>(C) {
//   return (...args: Proptional<P>[]) => {
//     const StyledComponent = (props: P & StyledCSX) => {
//       //const stylePropKeys = [...Object.keys({}), 'css']
//       //const styleProps = Object.assign({ theme: defined(context.theme, props.theme, {}) }, props)

//       const next: any = {}
//       for (let key in props) {
//         if ([...Object.keys({}), 'css'].includes(key)) continue
//         next[key] = props[key]
//       }
      
//       next.className = [
//         next.className,
//         ...args
//           .map(proptional => (typeof proptional === 'function' ? proptional(props) : proptional))
//           .filter(s => !!s)
//           .map(s => cxs(s)),
//         cxs(props.css || {}),
//       ].join(' ').trim()

//       return h(C, next)
//     }

//     return StyledComponent
//   }
// }

