import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import {compose} from 'redux';

import {Action, Select} from '@gisatcz/ptr-state';

import presentation from './presentation';
import {withComponentId} from '../../../../hoc';

let order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, ownProps) => {
	let filter = {
		tagKeys: {
			includes: [ownProps.categoryKey],
		},
	};

	return {
		cases: Select.cases.getIndexed(state, null, filter, order, 1, 100),
		activeCase: Select.cases.getActive(state),
	};
};

const mapDispatchToPropsFactory = () => {
	return (dispatch, ownProps) => {
		let filter = {
			tagKeys: {
				includes: [ownProps.categoryKey],
			},
		};

		return {
			onMount: () => {
				// TODO order
				dispatch(
					Action.cases.useIndexed(
						null,
						filter,
						order,
						1,
						20,
						ownProps.componentId
					)
				);
			},
			onUnmount: () => {
				dispatch(Action.cases.useIndexedClear(ownProps.componentId));
			},
		};
	};
};

export default compose(
	withComponentId('tacrGeoinvaze_CaseList_'),
	connect(mapStateToProps, mapDispatchToPropsFactory)
)(presentation);
