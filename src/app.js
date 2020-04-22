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

const path = process.env.PUBLIC_URL;

function init(Store) {
    return Promise.all([
        Store.dispatch(Action.app.updateLocalConfiguration(config)),
        localesUtils.addI18nResources('common', {cz}),
        Store.dispatch(Action.app.setKey('tacrGeoinvaze')),
        Store.dispatch(Action.app.setBaseUrl(path)),
        Store.dispatch(
            Action.components.set(
                'tacrGeoinvaze_CaseSelectContent',
                'showIntro',
                true
            )
        ),
        Store.dispatch(
            Action.app.setLocalConfiguration('geometriesAccuracy', 0.001)
        ),
        Store.dispatch(Action.app.loadConfiguration()).then(() => {
            let state = Store.getState();
            let actualExpansionTemplateKey = Select.app.getConfiguration(
                state,
                'templates.actualExpansion'
            );
            if (actualExpansionTemplateKey)
                Store.dispatch(
                    Action.layerTemplates.setActiveKey(
                        actualExpansionTemplateKey
                    )
                );
        }),
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
        }),
        Store.dispatch(
            Action.maps.addMap({
                key: 'tacrGeoinvaze',
                data: {
                    backgroundLayer: {
                        layerTemplateKey:
                            '7fe2f005-b7db-408e-bdc9-a2f928a62ab7',
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
        ),
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
        ),
        Store.dispatch(
            Action.maps.addMapToSet('tacrGeoinvaze', 'tacrGeoinvaze')
        ),
        i18n.changeLanguage('cz'),
        Store.dispatch(Action.users.apiLoadCurrentUser()),
    ]);
}

const ConnectedAppContainer = connects.AppContainer(AppContainer);

const AppComponent = () => {
    return (
        <>
            <Helmet defaultTitle="Geoinformační portál biologických invazí" />
            <ConnectedAppContainer appKey="tacrGeoinvaze">
                <Route
                    path={path + '/:caseKey?/:layerTemplateKey?/:periodKey?'}
                    component={App}
                />
            </ConnectedAppContainer>
        </>
    );
};

export {AppComponent as App, init};
