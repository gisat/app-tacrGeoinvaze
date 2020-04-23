import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state) => {
	return {
		activeCase: Select.cases.getActive(state),
	};
};

export default connect(mapStateToProps)(presentation);
