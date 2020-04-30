import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';

import {Select} from '@gisatcz/ptr-state';

import presentation from './presentation';
import {router} from '../../../../core';

const mapStateToProps = (state, ownProps) => {
	return {
		caseSelectOpen: Select.components.get(
			state,
			'tacrGeoinvaze_CaseSelect',
			'caseSelectOpen'
		),
		activeCase: Select.cases.getActive(state),
	};
};

const mapDispatchToProps = () => {
	return {
		openSelect: () => {
			router.nav(router.pathFor('homepage'));
		},
		closeSelect: (caseKey) => {
			router.nav(router.pathFor('case', {caseKey: caseKey}));
		},
		onMount: () => {},
		onUnmount: () => {},
		selectCase: (key) => {
			router.nav(router.pathFor('case', {caseKey: key}));
		},
	};
};

function mergeProps(stateProps, dispatchProps, ownProps) {
	const overrides = {
		closeSelect: () =>
			dispatchProps.closeSelect(stateProps.activeCase?.key),
	};

	return {...ownProps, ...stateProps, ...dispatchProps, ...overrides};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(presentation);
