import React from 'react';
import Helmet from 'react-helmet';
import _ from 'lodash';

import {AdjustableColumns} from '@gisatcz/ptr-atoms';

import ReactResizeDetector from 'react-resize-detector';
import {
	HoverHandler,
	WindowsContainer,
	MapSet,
	MapControls,
	MapTools,
} from '@gisatcz/ptr-core';
import Header from '../Header';
import LayerControls from '../LayerControls';
import CaseDetail from '../CaseDetail';
import Visualization from '../Visualization';

class TacrGeoinvazeApp extends React.PureComponent {
	render() {
		const props = this.props;

		let isCrayfish = false;
		if (
			props.crayfishConfig &&
			props.activeCase &&
			props.crayfishConfig.tagKey &&
			props.activeCase.data.tagKeys
		) {
			if (
				_.includes(
					props.activeCase.data.tagKeys,
					props.crayfishConfig.tagKey
				)
			) {
				isCrayfish = true;
			}
		}

		return (
			<>
				<Header categories={props.categories} />
				<AdjustableColumns
					fixed
					content={[
						{
							width: '30rem',
							minWidth: '20rem',
							maxWidth: '35rem',
							render: (props) => (
								<div className="tacrGeoinvaze-sidebar">
									<LayerControls isCrayfish={isCrayfish} />
									<CaseDetail />
								</div>
							),
						},
						{
							component: Visualization,
							props: {
								isCrayfish,
								iframeUrl:
									props.crayfishConfig &&
									props.crayfishConfig.url,
							},
							className: 'tacrGeoinvaze-column-visualization',
						},
					]}
				/>
			</>
		);
	}
}

export default TacrGeoinvazeApp;
