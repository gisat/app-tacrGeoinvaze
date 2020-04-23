import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';

import {Action, Select} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {
		introVisible: Select.components.get(
			state,
			'tacrGeoinvaze_CaseSelectContent',
			'showIntro'
		),
		content: Select.components.get(
			state,
			'tacrGeoinvaze_CaseSelectContent',
			'content'
		),
		categories: Select.app.getConfiguration(state, 'categories'),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showIntro: () => {
			dispatch(
				Action.components.set(
					'tacrGeoinvaze_CaseSelectContent',
					'showIntro',
					true
				)
			);
		},
		hideIntro: () => {
			dispatch(
				Action.components.set(
					'tacrGeoinvaze_CaseSelectContent',
					'showIntro',
					false
				)
			);
		},
		changeContent: (key) => {
			dispatch(
				Action.components.set(
					'tacrGeoinvaze_CaseSelectContent',
					'content',
					key
				)
			);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
