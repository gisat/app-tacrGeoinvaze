import {renderToString} from 'react-dom/server';
import {Helmet} from 'react-helmet';

/**
 * Returns function that repeats creating element until there are no more requests pending or if
 * `maxRetries` was exceeded.
 */
export function createRenderFn(requestCounter, createElFn, maxRetries) {
	let remainingRetries = maxRetries;

	const renderFn = function () {
		const el = createElFn();
		if (el == null) {
			return;
		}

		const data = {
			html: renderToString(el),
			helmet: Helmet.renderStatic(),
		};

		if (remainingRetries <= 0) {
			return data; // let's not keep retrying indefinitely
		}

		if (requestCounter.pendingRequests() !== 0) {
			return requestCounter.createReadyP().then(() => {
				remainingRetries -= 1;

				return renderFn();
			});
		}

		return data;
	};

	return renderFn;
}
