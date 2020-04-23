const path = require('path');
const React = require('react');
import {createReactAppExpress} from '@cra-express/core';
import {StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import createStore from '../src/state/Store';
import {renderToString} from 'react-dom/server';

const App = require('../src/app').App;
const clientBuildPath = path.resolve(__dirname, '../client');

/**
 * Returns function that repeats creating element until there are no more requests pending or if
 * `maxRetries` was exceeded.
 */
function createRenderFn(requestCounter, createElFn, maxRetries) {
	let remainingRetries = maxRetries;

	const renderFn = function () {
		const el = createElFn();

		if (remainingRetries <= 0) {
			return el; // let's not keep retrying indefinitely
		}

		// render component to find out if there are any pending requests
		// triggered by rendered components
		renderToString(el);

		if (requestCounter.pendingRequests() !== 0) {
			return requestCounter.createReadyP().then(() => {
				remainingRetries -= 1;

				return renderFn();
			});
		}

		return el;
	};

	return renderFn;
}

function handleUniversalRender(req, res) {
	const context = {};
	const {store, requestCounter} = createStore();
	req.store = store;

	const createEl = () => {
		const appEl = (
			<Provider store={store}>
				<StaticRouter location={req.url} context={context}>
					<App />
				</StaticRouter>
			</Provider>
		);

		if (context.url) {
			res.redirect(301, context.url);
			return;
		}

		return appEl;
	};

	const renderFn = createRenderFn(requestCounter, createEl, 5);

	return requestCounter.createReadyP().then(() => renderFn());
}

function resolveHtmlFilenameByRequest(req) {
	return 'gisat/app-tacrGeoinvaze';
}

const app = createReactAppExpress({
	clientBuildPath,
	resolveHtmlFilenameByRequest,
	universalRender: handleUniversalRender,
	onFinish(req, res, html) {
		const state = req.store.getState();
		const finalHtml = html.replace(
			'<!--{{SCRIPT}}-->',
			`<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(
			/</g,
			'\\u003c'
		)};
    </script>`
		);
		res.send(finalHtml);
	},
});

if (module.hot) {
	module.hot.accept('../src/app', () => {
		App = require('../src/app').App;
		console.log('✅ Server hot reloaded App');
	});
}

export default app;
