import * as React from "preact";
import {observable, action} from 'mobx'
import {useRef, useEffect, useCallback, useState, useLayoutEffect, h, Fragment} from "preact";
import {useObservable, useObserver} from 'preact-mobx-lite/src'

class CounterStore {
  @observable count
  constructor(){this.count = 1}
  @action inc = () => this.count ++ && console.log('got inc', this.count)
  @action dec = () => this.count --
}
const counterStore = new CounterStore()

// const MobxCounter = () => {
//   var counter = counterStore
//   useLayoutEffect(() => {
//     counter = counterStore
//   })

//   return (
//     <div className="counter">
//     <p>Mobx: You clicked {counter.count} times</p>
//     <button onClick={counter.inc}>Click me</button> 
//     </div>
//   );
// };

const MobxCounter = () => {
  //var counter = useRef(counterStore)
  return useObserver(() => (
    <div className="counter">
    <p>Mobx: You clicked {counterStore.count} times</p>
    <button onClick={counterStore.inc}>Click me</button> 
    </div>
  ));
};

const BaseCounter = () => {
  const [count, setCount] = React.useState(0);
  const inc = () => setCount(count + 1)
  return (
    <div className="counter">
      <p>You clicked {count} times</p>
      <button onClick={inc}>Click me</button>
    </div>
  );
};


const Counter = () => {
 return (
 <Fragment>
  <BaseCounter/>
  <MobxCounter/>
  </Fragment>)
}

export default Counter;
