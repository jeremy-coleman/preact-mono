import { enqueueRender } from './component';

export let i = 0;

import {PreactContext, PreactConsumer, PreactProvider, ComponentChildren} from './types'


export function createContext<T>(defaultValue: T) {
    const id = '__cC' + i++;
    let context: PreactContext<T> = {
        _id: id,
        _defaultValue: defaultValue
    };

    function Consumer(props, context): PreactConsumer<T> {
        return props.children(context)
    }

    Consumer.contextType = context;
     //@ts-ignore
    context.Consumer = Consumer;
    let ctx = { [id]: null };
    function initProvider(comp) {
        let subs = [];
        comp.getChildContext = () => {
            ctx[id] = comp;
            return ctx;
        };
        comp.componentDidUpdate = () => {
            let v = comp.props.value;
            subs.map(c => v !== c.context && (c.context = v, enqueueRender(c)));
        };
        comp.sub = (c) => {
            subs.push(c);
            let old = c.componentWillUnmount;
            c.componentWillUnmount = () => {
                subs.splice(subs.indexOf(c), 1);
                old && old();
            };
        };
    }
    function Provider(props): PreactProvider<T> {
        if (!this.getChildContext)
            initProvider(this);
        return props.children
    }
    //@ts-ignore
    context.Provider = Provider;
    return context;
}

// export type PreactConsumer<T> = FunctionalComponent<T> & {
//     children: (value: T) => ComponentChildren;
// }

// export type PreactProvider<T> = FunctionalComponent<T> & {
//     value: T;
//     children: ComponentChildren;
// }


// class CtxValue  {
//     _id: any;
//     _defaultValue: any;
//     getChildContext: any;
//     subs: any[];
//     componentDidUpdate: () => void;
//     sub: (c: any) => void;

//     constructor(id, defaultValue){
//         this._id =id,
//         this._defaultValue = defaultValue

//         this.subs = [];
        
//         this.getChildContext = () => {
//             ctx[id] = comp;
//                 return ctx;
//         };

//         this.componentDidUpdate = () => {
//             let v = comp.props.value;
//             subs.map(c => v !== c.context && (c.context = v, enqueueRender(c)));
//         };

//         this.sub = (c) => {
//             subs.push(c);
//             let old = c.componentWillUnmount;
//             c.componentWillUnmount = () => {
//                 subs.splice(subs.indexOf(c), 1);
//                 old && old();
//             };
//         };

//     }
        

//     Consumer = (props, context) => props.children(context)
        
//  Provider = (props) => {
//             if (!this.getChildContext)
//                 initProvider(this);
//             return props.children as ComponentChildren
//         }
        
// };
