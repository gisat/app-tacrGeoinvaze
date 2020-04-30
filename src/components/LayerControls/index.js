import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import {compose} from 'redux';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';
import {withComponentId} from '../../hoc';
import {router} from '../../core';

const filterByActive = {application: true};
const periodsOrder = [['period', 'descending']];

const mapStateToProps = (state) => {
	return {
		templateKeys: Select.app.getConfiguration(state, 'templates'),
		periods: Select.periods.getIndexed(
			state,
			filterByActive,
			null,
			periodsOrder,
			1,
			200
		),
		layerTemplates: Select.layerTemplates.getIndexed(
			state,
			filterByActive,
			null,
			null,
			1,
			20
		),
		activeLayerTemplateKey: Select.layerTemplates.getActiveKey(state),
		activePeriodKey: Select.periods.getActiveKey(state),
		activeCase: Select.cases.getActive(state),
	};
};

const mapDispatchToPropsFactory = (dispatch, {componentId}) => {
	return {
		onMount: () => {
			// TODO order
			dispatch(
				Action.periods.useIndexed(
					filterByActive,
					null,
					periodsOrder,
					1,
					200,
					componentId
				)
			);
			dispatch(
				Action.layerTemplates.useIndexed(
					filterByActive,
					null,
					null,
					1,
					20,
					componentId
				)
			);
		},
		onUnmount: () => {
			dispatch(Action.periods.useIndexedClear(componentId));
			dispatch(Action.layerTemplates.useIndexedClear(componentId));
		},
		setActive: (caseKey, layerTemplate, period) => {
			router.nav(
				router.pathFor('period', {
					caseKey,
					layerTemplate,
					periodKey: period,
				})
			);
		},
	};
};

function mergeProps(stateProps, dispatchProps, ownProps) {
	const overrides = {
		setActive: (layerTemplate, period) =>
			dispatchProps.setActive(
				stateProps.activeCase.key,
				layerTemplate,
				period
			),
	};

	return {...ownProps, ...stateProps, ...dispatchProps, ...overrides};
}

export default compose(
	withComponentId('tacrGeoinvaze_CaseDetail_'),
	connect(mapStateToProps, mapDispatchToPropsFactory, mergeProps)
)(presentation);
