import path from 'path';
import React from 'react';
import {createReactAppExpress} from '@cra-express/core';
import {StaticRouter} from 'react-router-dom';
import {Provider} from '@gisatcz/ptr-state';
import createStore from '../src/state/Store';
import {UIDReset} from 'react-uid';
import {createRenderFn} from './utils';

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
	universalRender: handleUniversalRender,
	handleRender(req, res, data, rawTemplateHtml, options) {
		const state = req.store.getState();

		const templateHtml = rawTemplateHtml.replace(
			'<title>Loading...</title>',
			data.helmet.title.toString()
		);

		const [beginHtml, endHtml] = templateHtml.split(
			`<div id="root"></div>`
		);
		const preloadedStateHtml = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
			state
		).replace(/</g, '\\u003c')};</script>`;

		const finalHtml = `${beginHtml}<div id="root">${data.html}</div>${preloadedStateHtml}${endHtml}`;

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
