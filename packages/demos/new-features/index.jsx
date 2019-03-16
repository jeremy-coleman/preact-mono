
import { createElement, render, hydrate, Component, options, Fragment, h } from 'preact';
import './style.scss';
//import './hot'
import installLogger from './logger';
import { initDevTools } from 'preact/debug/devtools';

import {App} from './app'

import * as React from 'react'
//import * as ReactDOM from 'react-dom'

window.React = React
window.h = h

let isBenchmark = /(\/spiral|\/pythagoras|[#&]bench)/g.test(window.location.href);
if (!isBenchmark) {
	// eslint-disable-next-line no-console
	console.log('Enabling devtools');
	initDevTools();
}


// document.body.innerHTML = renderToString(<App url={location.href.match(/[#&]ssr/) ? undefined : '/'} />);
// document.body.firstChild.setAttribute('is-ssr', 'true');

installLogger(
	String(localStorage.LOG)==='true' || location.href.match(/logger/),
	String(localStorage.CONSOLE)==='true' || location.href.match(/console/)
);


render(<App />, document.body);

//@ts-ignore
if(module.hot){module.hot.accept()}

// const hotLoader = interopDefault(require('react-hot-loader'));
// hotLoader.preact(interopDefault(require('preact')));