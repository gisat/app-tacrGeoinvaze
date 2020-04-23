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
import {
	appReducers,
	areasReducers,
	areaRelationsReducers,
	attributeRelationsReducers,
	attributesReducers,
	attributeSetsReducers,
	attributeDataReducers,
	attributeDataSourcesReducers,
	casesReducers,
	chartsReducers,
	componentsReducers,
	layerPeriodsReducers,
	layerTemplatesReducers,
	layersTreesReducers,
	mapsReducers,
	periodsReducers,
	placesReducers,
	scenariosReducers,
	scopesReducers,
	screensReducers,
	selectionsReducers,
	snapshotsReducers,
	spatialDataReducers,
	spatialDataSourcesReducers,
	spatialVectorDataSourcesReducers,
	spatialRelationsReducers,
	stylesReducers,
	attributeStatisticsReducers,
	tagsReducers,
	usersReducers,
	viewsReducers,
	windowsReducers,
} from '@gisatcz/ptr-state';

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
		app: appReducers,
		areas: areasReducers,
		areaRelations: areaRelationsReducers,
		attributes: attributesReducers,
		attributeRelations: attributeRelationsReducers,
		attributeStatistics: attributeStatisticsReducers,
		attributeSets: attributeSetsReducers,
		attributeData: attributeDataReducers,
		attributeDataSources: attributeDataSourcesReducers,
		cases: casesReducers,
		charts: chartsReducers,
		components: componentsReducers,
		layerPeriods: layerPeriodsReducers,
		layerTemplates: layerTemplatesReducers,
		layersTrees: layersTreesReducers,
		maps: mapsReducers,
		periods: periodsReducers,
		places: placesReducers,
		router: connectRouter(history),
		scenarios: scenariosReducers,
		scopes: scopesReducers,
		screens: screensReducers,
		selections: selectionsReducers,
		snapshots: snapshotsReducers,
		spatialData: spatialDataReducers,
		spatialDataSources: spatialDataSourcesReducers,
		spatialVectorDataSources: spatialVectorDataSourcesReducers,
		spatialRelations: spatialRelationsReducers,
		styles: stylesReducers,
		tags: tagsReducers,
		users: usersReducers,
		views: viewsReducers,
		windows: windowsReducers,
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
