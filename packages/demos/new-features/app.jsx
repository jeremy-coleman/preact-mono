import { Component, Fragment, h } from 'preact';
import { initDevTools } from 'preact/debug/devtools';
//import { hot } from 'react-hot-loader';
import Context from './context';
import DevtoolsDemo from './devtools';
import Fragments from './fragments';
import KeyBug from './key_bug';
import ProfilerDemo from './profiler';
import Pythagoras from './pythagoras';
import Reorder from './reorder';
import { Link, Router } from './router';
import Spiral from './spiral';
import Counters from './counters/App'
import StyledPage from './styled'
// import renderToString from 'preact-render-to-string';
import './style.scss';
import Todo from './todo';

let isBenchmark = /(\/spiral|\/pythagoras|[#&]bench)/g.test(window.location.href);
if (!isBenchmark) {
	// eslint-disable-next-line no-console
	console.log('Enabling devtools');
	initDevTools();
}

class Home extends Component {
	a = 1;
	render() {
		return (
			<div>
				<h1>Hello</h1>
			</div>
		);
	}
}

class DevtoolsWarning extends Component {
	onClick = () => {
		window.location.reload();
	}

	render() {
		return (
			<button onClick={this.onClick}>Start Benchmark (disables devtools)</button>
		);
	}
}

export const App = ({ url }) => {
		return (
			<div class="app">
				<header>
					<nav>
						<Link href="/" activeClassName="active">Home</Link>
						<Link href="/reorder" activeClassName="active">Reorder</Link>
						<Link href="/spiral" activeClassName="active">Spiral</Link>
						<Link href="/pythagoras" activeClassName="active">Pythagoras</Link>
						<Link href="/todo" activeClassName="active">ToDo</Link>
						<Link href="/fragments" activeClassName="active">Fragments</Link>
						<Link href="/key_bug" activeClassName="active">Key Bug</Link>
						<Link href="/profiler" activeClassName="active">Profiler</Link>
						<Link href="/context" activeClassName="active">Context</Link>
						<Link href="/devtools" activeClassName="active">Devtools</Link>
						<Link href="/empty-fragment" activeClassName="active">Empty Fragment</Link>
						<Link href="/counters" activeClassName="active">Counters</Link>
						<Link href="/styled" activeClassName="active">Styled</Link>
					</nav>
				</header>
				<main>
					<Router url={url}>
						<Home path="/" />
						<Reorder path="/reorder" />
						<div path="/spiral">
							{!isBenchmark
								? <DevtoolsWarning />
								: <Spiral />
							}
						</div>
						<div path="/pythagoras">
							{!isBenchmark
								? <DevtoolsWarning />
								: <Pythagoras />
							}
						</div>
						<Todo path="/todo" />
						<Fragments path="/fragments" />
						<ProfilerDemo path="/profiler" />
						<KeyBug path="/key_bug" />
						<Context path="/context" />
						<DevtoolsDemo path="/devtools" />
						<EmptyFragment path="/empty-fragment" />
						<Counters path="/counters" />
						<StyledPage path="/styled" />
					</Router>
				</main>
			</div>
		);
	}


function EmptyFragment() {
	return <Fragment />;
}

//export let App = hot(module)(AppRoot)