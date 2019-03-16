import { h, Component } from 'preact/react';

export default class Base extends Component {
	state = {
		state: 'initialized',
	};

	render() {
		return <div>Base</div>;
	}
}
