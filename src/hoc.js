import React from 'react';
import {useUID} from 'react-uid';

export function withComponentId(prefix) {
	return function (Component) {
		return function (props) {
			const componentId = prefix + useUID();
			const newProps = {...props, ...{componentId: componentId}};

			return <Component {...newProps} />;
		};
	};
}
