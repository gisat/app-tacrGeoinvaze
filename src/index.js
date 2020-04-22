import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import createStore from './state/Store';
import {isServer} from './utils';

const {store} = createStore();

const Application = () => (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

function renderApp() {
    const rootEl = document.getElementById('root');
    const render =
        isServer || rootEl.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render;
    render(<Application />, rootEl);
}

renderApp();
