/**
 * Should be populated on app initialization.
 *
 * Alternatively, we could pass it via react context.
 */
let _router = null;
export {_router as router};

export function init({router}) {
	_router = router;
}
