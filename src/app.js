import React from 'react';
import {Route} from 'react-router';
import Helmet from 'react-helmet';

import {Select, Action, connects} from '@gisatcz/ptr-state';
import {localesUtils, i18n} from '@gisatcz/ptr-locales';
import config from './config';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/lib/styles/reset.css';
import '@gisatcz/ptr-core/lib/styles/base.scss';
import './styles/index.scss';

import cz from './locales/cz/common';

import {AppContainer} from '@gisatcz/ptr-components';

import App from './components/App';

import {create as createRouter} from './router';
import {
	pageSelector as reduxRouterPageSelector,
	changePage,
} from './redux-router';
import {connect} from '@gisatcz/ptr-state';

const path = process.env.PUBLIC_URL;

let router = null;

/**
 * Converts request taken from router into application specific representation
 * of page in redux store.
 */
function requestToPage(request) {
	if (request.match == null) {
		return null;
	}

	return {
		name: request.match.data.name,
		params: {
			path: request.match.pathParams,
			queryString: request.queryString ?? '',
		},
	};
}

function init(Store, {absPath, isPreloaded, currentUrl}) {
	/**
	 * Creates router instance that can be used to manipulat urls.
	 *
	 * App handler updates store with current page and it's up to views to react to the change.
	 * In case of url change, redux selector possibly retrieves different data and passes them
	 * into some the component.
	 *
	 * Not found handler is same as app handler (takes request), except it doesn't contain request.match
	 * (as no route was matched).
	 */
	router = createRouter({
		rootUrl: absPath,
		currentUrl,
		routes,
		app: (request) => {
			const page = requestToPage(request);
			Store.dispatch(changePage(page.name, page.params));
		},
		notFoundHandler: (request) => {
			Store.dispatch(changePage(null));
		},
	});

	if (isPreloaded) {
		return;
	}

	Store.dispatch(Action.app.updateLocalConfiguration(config));
	localesUtils.addI18nResources('common', {cz});
	Store.dispatch(Action.app.setKey('tacrGeoinvaze'));
	Store.dispatch(Action.app.setBaseUrl(path));
	Store.dispatch(
		Action.components.set(
			'tacrGeoinvaze_CaseSelectContent',
			'showIntro',
			true
		)
	);
	Store.dispatch(
		Action.app.setLocalConfiguration('geometriesAccuracy', 0.001)
	);
	Store.dispatch(Action.app.loadConfiguration()).then(() => {
		let state = Store.getState();
		let actualExpansionTemplateKey = Select.app.getConfiguration(
			state,
			'templates.actualExpansion'
		);
		if (actualExpansionTemplateKey)
			Store.dispatch(
				Action.layerTemplates.setActiveKey(actualExpansionTemplateKey)
			);
	});
	Store.dispatch(
		Action.periods.useIndexed(
			{application: true},
			null,
			[['period', 'descending']],
			1,
			1,
			'tacrGeoinvaze'
		)
	).then(() => {
		let state = Store.getState();
		let latestPeriodInArray = Select.periods.getIndexed(
			state,
			{application: true},
			null,
			[['period', 'descending']],
			1,
			1
		);
		if (latestPeriodInArray && latestPeriodInArray[0])
			Store.dispatch(
				Action.periods.setActiveKey(latestPeriodInArray[0].key)
			);
	});
	Store.dispatch(
		Action.maps.addMap({
			key: 'tacrGeoinvaze',
			data: {
				backgroundLayer: {
					layerTemplateKey: '7fe2f005-b7db-408e-bdc9-a2f928a62ab7',
				},
				layers: [
					{
						key: 'thematicLayer',
						filterByActive: {
							layerTemplate: true,
							period: true,
							case: true,
						},
					},
				],
			},
		})
	);
	Store.dispatch(
		Action.maps.addSet({
			key: 'tacrGeoinvaze',
			data: {
				view: {
					center: {
						lat: 49.7,
						lon: 15.5,
					},
					boxRange: 525000,
				},
			},
		})
	);
	Store.dispatch(Action.maps.addMapToSet('tacrGeoinvaze', 'tacrGeoinvaze'));
	i18n.changeLanguage('cz');
	Store.dispatch(Action.users.apiLoadCurrentUser());
}

const ConnectedAppContainer = connects.AppContainer(AppContainer);

const selectPage = (state) => reduxRouterPageSelector(state, 'router2');

function UserList() {
	return <div>User list</div>;
}

function UserView() {
	return <div>User View</div>;
}

function PrintPage() {
	return <div>Print page</div>;
}

function NotFound() {
	return <div>Page not found</div>;
}

/**
 * Normal navigation that just opens different page in browser.
 * No redux involved.
 */
function Nav() {
	return (
		<ul>
			<li>
				<a href="/user/list">UserList</a>
			</li>
			<li>
				<a href="/user/5/view">UserView</a>
			</li>
			<li>
				<a href="/print-page/p1/p2?q1=2&q2=3">PrintPage</a>
			</li>
		</ul>
	);
}

/**
 * Navigation that when clicked on link changes url without reloading page.
 * It's up to the app alone to handle that change. There is also fallback
 * in case `onClick` wouldn't be called (disabled js) or user wanted to e.g.
 * open link in new tab.
 */
function _NavUsingRouter({dispatch}) {
	const data = [
		{
			name: 'UserList',
			url: router.pathFor('user-list'),
		},
		{
			name: 'UserView',
			url: router.pathFor('user-view', {id: 5}),
		},
		{
			name: 'PrintPage',
			url:
				router.pathFor('print-page', {
					routeParam1: 'p1',
					routeParam2: 'p2',
				}) + '?&q1=2&q2=3',
		},
	];

	return (
		<ul>
			{data.map((link) => (
				<li key={link.name}>
					<a
						href={link.url}
						onClick={(e) => {
							e.preventDefault();
							router.nav(link.url);
						}}
					>
						{link.name}
					</a>
				</li>
			))}
		</ul>
	);
}

const NavUsingRouter = connect(null, (dispatch, ownProps) => ({
	dispatch,
}))(_NavUsingRouter);

/**
 * App specific data structure for description of individual pages.
 *
 * It contains page data keyed by route name/page name. We convert it to routes
 * using our function `pagesToRoutes` and pass it to router.
 */
const pages = {
	'user-list': {
		path: '/user/list',
		view: UserList,
	},
	'user-view': {
		path: '/user/:id/view',
		view: UserView,
	},
	'print-page': {
		path: '/print-page/:routeParam1/:routeParam2',
		view: PrintPage,
	},
};

const pagesToRoutes = (pages) =>
	Object.fromEntries(
		Object.entries(pages).map(([name, data]) => [data.path, name])
	);

const routes = pagesToRoutes(pages);
// const routes = {
// 	'/user/list': 'user-list',
// 	'/user/:id/view': 'user-view',
// 	'/print-page/:routeParam1/:routeParam2': 'print-page',
// };

function _PageContent(props) {
	/**
	 * Let's take page from app specific data structure and render `NotFound` view
	 * if view was not specified in the data.
	 */
	const View = pages[props.page?.name]?.view ?? NotFound;

	return (
		<div>
			page data: {JSON.stringify(props.page)}
			<br />
			<br />
			<View />
		</div>
	);
}

const PageContent = connect((state, ownProps) => ({
	page: selectPage(state),
}))(_PageContent);

const AppComponent = () => {
	return (
		<>
			<Helmet defaultTitle="Geoinformační portál biologických invazí" />
			<ConnectedAppContainer appKey="tacrGeoinvaze">
				<Nav />
				<br />
				Nav using router with href fallback:
				<NavUsingRouter />
				<br />
				<PageContent />
				<Route
					path={path + '/:caseKey?/:layerTemplateKey?/:periodKey?'}
					component={App}
				/>
			</ConnectedAppContainer>
		</>
	);
};

export {AppComponent as App, init};
