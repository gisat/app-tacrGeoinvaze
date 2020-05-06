/**
 * Wrapper of `navigo` router. It's not clear which router is going to be used in the end, so we have
 * wrapper to make switch easier.
 *
 * Format of request in handlers is based on ring spec: https://github.com/ring-clojure/ring/blob/master/SPEC
 * and reitit: https://github.com/metosin/reitit (`match` key).
 *
 * Current route syntax is just map with path as key and name as value. If we needed more, we could take
 * inspiration from reitit wich supports attaching arbitrary data to routes: https://metosin.github.io/reitit/basics/route_syntax.html
 * More sytaxes can be supported if needed.
 */

import Navigo from 'navigo';

import {isServer} from './utils';

function createHandler(app, data) {
	return function () {
		const [params, query] =
			arguments.length === 1 ? [null, arguments[0]] : arguments;

		const request = {};

		if (data != null) {
			request.match = {
				data,
				pathParams: params == null ? {} : params,
			};
		}

		if (query != null) {
			request.queryString = query;
		}

		app(request);
	};
}

function normalizeData(data) {
	if (typeof data === 'string') {
		return {name: data};
	}

	return data;
}
/**
 * @param {Object} options
 * @param {Object} options.routes Keys are paths in format `/path/:param`, values are route data (object with key 'name' or string)
 * @param {Function} options.app Function accepting request called when route is matched
 * @param {Function=} options.notFoundHandler Function accepting request called when no route is matched
 * @param {Function=} options.navHandler Function called instead of `nav` and `redirect` (useful for SSR)
 * @param {string} options.rootUrl
 * @param {string=} options.currentUrl Useful when doing SSR
 *
 * Request is map with optional keys:
 * - `match`
 *   - matched route. It is object with keys `data` (route data object), `pathParams`
 * - `queryString`
 */
export function create({
	routes,
	app,
	notFoundHandler,
	rootUrl,
	currentUrl,
	navHandler,
}) {
	const navigoRoutes = Object.fromEntries(
		Object.entries(routes).map(([url, providedData]) => {
			const data = normalizeData(providedData);

			return [url, {as: data.name, uses: createHandler(app, data)}];
		})
	);

	const navigo = new Navigo(rootUrl);
	navigo.on(navigoRoutes);
	if (notFoundHandler) {
		navigo.notFound(createHandler(notFoundHandler));
	}
	navigo.resolve(currentUrl);

	return navHandler
		? {
				nav: (url) => {
					navHandler(url);
				},
				redirect: (url) => {
					navHandler(url);
				},
				refresh: () => {
					navigo.resolve();
				},
				pathFor: (page, params) => {
					return navigo.generate(page, params);
				},
		  }
		: {
				nav: (url) => {
					navigo.navigate(url);
				},
				redirect: (url) => {
					navigo.historyAPIUpdateMethod('replaceState');
					navigo.navigate(url);
					navigo.historyAPIUpdateMethod('pushState');
				},
				refresh: () => {
					navigo.resolve();
				},
				pathFor: (page, params) => {
					return navigo.generate(page, params);
				},
		  };
}
