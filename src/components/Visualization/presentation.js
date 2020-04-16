import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {ClientSideComponent} from '../ClientSideComponent';
import './style.scss';

const Visualization = (props) => {
    if (props.isCrayfish) {
        return (
            <iframe
                id="tacrGeoinvaze-visualization-iframe"
                src={props.iframeUrl}
            />
        );
    } else {
        return (
            <ReactResizeDetector
                handleWidth
                handleHeight
                render={({width, height}) => {
                    return (
                        <>
                            {props.activeCase &&
                            props.activePeriodKey &&
                            props.activeLayerTemplateKey ? (
                                <ClientSideComponent
                                    resolve={() => import('../DynamicMapSet')}
                                />
                            ) : null}
                        </>
                    );
                }}
            />
        );
    }
};

export default Visualization;
