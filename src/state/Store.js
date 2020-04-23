import {
	createStore,
	combineReducers,
	applyMiddleware,
	compose,
	thunk,
	logger,
	reduxBatch,
} from '@gisatcz/ptr-state';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory, createMemoryHistory} from 'history';
import {init as initApp} from '../app';
import {isServer, createAsyncMiddleware, createRequestCounter} from '../utils';

// base types
import { baseStores } from '@gisatcz/ptr-state';

export const history = isServer
	? createMemoryHistory()
	: createBrowserHistory();

function createMiddleware(requestCounter) {
	const middlewares = [
		createAsyncMiddleware(requestCounter),
		thunk,
		// process.env.NODE_ENV === 'development' && !isServer && logger,
		routerMiddleware(history),
	];

	return applyMiddleware(...middlewares.filter((v) => v !== false));
}

function createReducer() {
	return combineReducers({
		...baseStores,
		router: connectRouter(history),
	});
}

const composeEnhancers =
	(!isServer && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

function createEnhancer(requestCounter) {
	return composeEnhancers(
		reduxBatch,
		createMiddleware(requestCounter),
		reduxBatch
	);
}

/**
 * Returns object with keys `store`, `readyP`.
 * - `readyP` - Promise that resolves once the app is initialized (helpful with SSR).
 * - `store` - Redux store.
 */
function createAppStore() {
	const isPreloaded = !isServer && window.__PRELOADED_STATE__ != null;
	const initialState = isPreloaded ? window.__PRELOADED_STATE__ : {};
	if (isPreloaded) {
		delete window.__PRELOADED_STATE__;
	}

	const requestCounter = createRequestCounter();
	const store = createStore(
		createReducer(),
		initialState,
		createEnhancer(requestCounter)
	);

	if (!isPreloaded) {
		initApp(store);
	}

	return {
		store: store,
		requestCounter: requestCounter,
	};
}

export default createAppStore;
