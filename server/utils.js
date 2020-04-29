import {renderToString} from 'react-dom/server';

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

		const html = renderToString(el);

		if (remainingRetries <= 0) {
			return html; // let's not keep retrying indefinitely
		}

		if (requestCounter.pendingRequests() !== 0) {
			return requestCounter.createReadyP().then(() => {
				remainingRetries -= 1;

				return renderFn();
			});
		}

		return html;
	};

	return renderFn;
}

/**
 * Replacement for `handleRender` function from `cra-universal` package.
 *
 * Original deals with react element, this one deals with html to prevent one redundant rendering.
 */
export function handleRenderHtml(req, res, html, htmlData, options) {
	const segments = htmlData.split(`<div id="root">`);
	if (options.onEndReplace) {
		segments[1] = options.onEndReplace(segments[1]);
	}

	const finalStr = `${segments[0]}<div id="root">${html}${segments[1]}`;
	if (options.onFinish) {
		options.onFinish(req, res, finalStr);
		return;
	}

	res.send(finalStr);
}
