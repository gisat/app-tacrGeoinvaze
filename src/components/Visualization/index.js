import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import {Action, Select} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state) => {
	return {
		activeCase: Select.cases.getActive(state),
		activeLayerTemplateKey: Select.layerTemplates.getActiveKey(state),
		activePeriodKey: Select.periods.getActiveKey(state),
	};
};

export default connect(mapStateToProps)(presentation);
