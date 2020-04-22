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

if (isServer) {
    ReactDOM.hydrate(<Application />, document.getElementById('root'));
} else {
    ReactDOM.render(<Application />, document.getElementById('root'));
}
