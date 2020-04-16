const path = require('path');
const React = require('react');
import {createReactAppExpress} from '@cra-express/core';
import {StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import createStore from '../src/state/Store';

const App = require('../src/app').App;
const clientBuildPath = path.resolve(__dirname, '../client');

function handleUniversalRender(req, res) {
    const context = {};
    const store = createStore();

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

    req.store = store;

    return appEl;
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
