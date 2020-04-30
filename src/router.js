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

function createHandler(app, name) {
	return function () {
		const [params, query] =
			arguments.length === 1 ? [null, arguments[0]] : arguments;
		console.log('handler', name);
		const request = {};

		if (name != null) {
			request.match = {
				data: {name: name},
				pathParams: params == null ? {} : params,
			};
		}

		if (query != null) {
			request.queryString = query;
		}

		app(request);
	};
}

/**
 * @param {Object} options
 * @param {Object} options.routes Keys are paths in format `/path/:param`, values are names
 * @param {Function} options.app Function accepting request called when route is matched
 * @param {Function} options.notFoundHandler Function accepting request called when no route is matched
 *
 * Request is map with optional keys:
 * - `match`
 *   - matched route. It is object with keys `data` (object with key `name`), `pathParams`
 * - `queryString`
 */
export function create({routes, app, notFoundHandler}) {
	const navigoRoutes = Object.fromEntries(
		Object.entries(routes).map(([url, name]) => {
			return [url, {as: name, uses: createHandler(app, name)}];
		})
	);

	const navigo = new Navigo('http://localhost:3000');
	navigo.on(navigoRoutes);
	navigo.notFound(createHandler(notFoundHandler));
	navigo.resolve();

	return {
		nav: (url) => {
			navigo.navigate(url);
		},
		redirect: (url) => {
			navigo.pause();
			navigo.navigate(url);
			navigo.resume();
		},
		refresh: () => {
			navigo.resolve();
		},
		pathFor: (page, params) => {
			return navigo.generate(page, params);
		},
	};
}
