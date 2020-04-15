/**
 * CONFIG LOGIC - NOT FOR CONFIGURATION VALUES
 */

import _ from 'lodash';

/**
 * COMMON DEFAULT VALUES (fallback)
 * Used if not specified in rewrites.
 */
import {configDefaults} from '@gisatcz/ptr-core';

/**
 * APP SPECIFIC DEFAULT VALUES
 */
import appDefaults from "./appDefaults";

/**
 * CONFIG PROPER
 * Per-instance values, development values & features.
 */
import rewrites from './rewrites';

export default _.merge({}, configDefaults, appDefaults, rewrites);
