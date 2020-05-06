import React from 'react';
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
import {changePage} from './redux-router';
import {init as initCore, router} from './core';

const path = process.env.PUBLIC_URL;

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

function createRoutes(Store) {
	const setCase = (key) => {
		Store.dispatch(Action.cases.setActiveKey(key));
		Store.dispatch(
			Action.components.set(
				'tacrGeoinvaze_CaseSelect',
				'caseSelectOpen',
				false
			)
		);
	};

	const setLayer = (template) => {
		Store.dispatch(Action.layerTemplates.setActiveKey(template));
	};

	const setPeriod = (period) => {
		Store.dispatch(Action.periods.setActiveKey(period));
	};

	return {
		'': {
			name: 'homepage',
			handler: function (request) {
				Store.dispatch(
					Action.components.set(
						'tacrGeoinvaze_CaseSelect',
						'caseSelectOpen',
						true
					)
				);
			},
		},
		'/:caseKey': {
			name: 'case',
			handler: function (request) {
				const state = Store.getState();

				const caseKey = request.match.pathParams.caseKey;
				const periodKey = Select.periods.getActiveKey(state);
				const layerTemplate = Select.layerTemplates.getActiveKey(state);

				if (periodKey != null && layerTemplate != null) {
					router.redirect(
						router.pathFor('period', {
							caseKey,
							periodKey,
							layerTemplate,
						})
					);
				} else {
					setCase(caseKey);
				}
			},
		},
		'/:caseKey/:layerTemplate/:periodKey': {
			name: 'period',
			handler: function (request) {
				const {
					caseKey,
					layerTemplate,
					periodKey,
				} = request.match.pathParams;
				setCase(caseKey);
				setLayer(layerTemplate);
				setPeriod(periodKey);
			},
		},
	};
}

function getDefaultTemplate(state) {
	const current = Select.layerTemplates.getActiveKey(state);
	if (current != null) {
		return current;
	}

	const actualExpansionTemplateKey = Select.app.getConfiguration(
		state,
		'templates.actualExpansion'
	);
	if (
		actualExpansionTemplateKey &&
		Select.layerTemplates.getActiveKey(state) == null
	) {
		return actualExpansionTemplateKey;
	}
}

function getDefaultPeriod(state) {
	const current = Select.periods.getActiveKey(state);
	if (current != null) {
		return current;
	}

	const latestPeriodInArray = Select.periods.getIndexed(
		state,
		{application: true},
		null,
		[['period', 'descending']],
		1,
		1
	);
	if (
		latestPeriodInArray &&
		latestPeriodInArray[0] &&
		Select.periods.getActiveKey(state) == null
	) {
		return latestPeriodInArray[0].key;
	}
}

function init(Store, {absPath, isPreloaded, currentUrl, navHandler}) {
	/**
	 * Creates router instance that can be used to manipulat urls.
	 *
	 * App handler updates store with current page and it's up to views to react to the change.
	 * In case of url change, redux selector possibly retrieves different data and passes them
	 * into some the component.
	 *
	 */
	const router = createRouter({
		rootUrl: absPath,
		currentUrl,
		routes: createRoutes(Store),
		navHandler,
		app: (request) => {
			const page = requestToPage(request);
			Store.dispatch(changePage(page.name, page.params));

			const handler = request.match.data.handler;
			if (handler != null) {
				handler(request);
			}
		},
	});

	initCore({router});

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
	const configurationP = Store.dispatch(Action.app.loadConfiguration());
	const periodsP = Store.dispatch(
		Action.periods.useIndexed(
			{application: true},
			null,
			[['period', 'descending']],
			1,
			1,
			'tacrGeoinvaze'
		)
	);
	Promise.all([configurationP, periodsP]).then(() => {
		const state = Store.getState();

		const pathParams = {
			caseKey: Select.cases.getActiveKey(state),
			layerTemplate: getDefaultTemplate(state),
			periodKey: getDefaultPeriod(state),
		};

		if (
			pathParams.caseKey != null &&
			pathParams.layerTemplate != null &&
			pathParams.periodKey != null
		) {
			router.redirect(router.pathFor('period', pathParams));

			return;
		}

		if (pathParams.periodKey != null) {
			Store.dispatch(Action.periods.setActiveKey(pathParams.periodKey));
		}

		if (pathParams.layerTemplate != null) {
			Store.dispatch(
				Action.layerTemplates.setActiveKey(pathParams.layerTemplate)
			);
		}
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

const AppComponent = () => {
	return (
		<>
			<Helmet defaultTitle="Geoinformační portál biologických invazí" />
			<ConnectedAppContainer appKey="tacrGeoinvaze">
				<App />
			</ConnectedAppContainer>
		</>
	);
};

export {AppComponent as App, init};
