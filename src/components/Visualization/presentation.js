import React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import {
    WorldWindMap,
    MapControls,
    MapSet as MapSetPresentation,
} from '@gisatcz/ptr-maps';
import MapPresentation from '@gisatcz/ptr-maps/lib/Map';
import connectMap from '@gisatcz/ptr-state/lib/components/maps/Map';
import connectMapSet from '@gisatcz/ptr-state/lib/components/maps/MapSet';

import './style.scss';

const Map = connectMap(MapPresentation);
const MapSet = connectMapSet(MapSetPresentation);

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
                                <MapSet
                                    connectedMapComponent={Map}
                                    stateMapSetKey="tacrGeoinvaze"
                                    mapComponent={WorldWindMap}
                                >
                                    <MapControls zoomOnly />
                                </MapSet>
                            ) : null}
                        </>
                    );
                }}
            />
        );
    }
};

export default Visualization;
