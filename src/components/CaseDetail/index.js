import {connect} from 'react-redux';
import _ from 'lodash';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state) => {
    return {
        activeCase: Select.cases.getActive(state),
    };
};

export default connect(mapStateToProps)(presentation);
