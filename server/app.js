const path = require('path');
const React = require('react');
import {createReactAppExpress} from '@cra-express/core';
import {StaticRouter} from 'react-router-dom';
import {Provider} from '@gisatcz/ptr-state';
import createStore from '../src/state/Store';
import {UIDReset} from 'react-uid';
import {createRenderFn, handleRenderHtml} from './utils';

const App = require('../src/app').App;
const clientBuildPath = path.resolve(__dirname, '../client');

function handleUniversalRender(req, res) {
	const context = {};
	const {store, requestCounter} = createStore();
	req.store = store;

	const createEl = () => {
		const appEl = (
			<UIDReset>
				<Provider store={store}>
					<StaticRouter location={req.url} context={context}>
						<App />
					</StaticRouter>
				</Provider>
			</UIDReset>
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
	return process.env.PUBLIC_URL;
}

const app = createReactAppExpress({
	clientBuildPath,
	resolveHtmlFilenameByRequest,
	handleRender: handleRenderHtml,
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
