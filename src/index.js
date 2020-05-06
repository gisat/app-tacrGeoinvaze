import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
import {Provider} from '@gisatcz/ptr-state';
import createStore from './state/Store';
import {isServer} from './utils';

const {store} = createStore();

const Application = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

function renderApp() {
	const rootEl = document.getElementById('root');
	const render =
		isServer || rootEl.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render;
	render(<Application />, rootEl);
}

renderApp();
