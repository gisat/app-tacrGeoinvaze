import React from 'react';
import {
    WorldWindMap,
    MapControls,
    MapSet as MapSetPresentation,
} from '@gisatcz/ptr-maps';
import MapPresentation from '@gisatcz/ptr-maps/lib/Map';
import connectMap from '@gisatcz/ptr-state/lib/components/maps/Map';
import connectMapSet from '@gisatcz/ptr-state/lib/components/maps/MapSet';

const Map = connectMap(MapPresentation);
const MapSet = connectMapSet(MapSetPresentation);

export default function DynamicMapSet(props) {
    return (
        <MapSet
            connectedMapComponent={Map}
            stateMapSetKey="tacrGeoinvaze"
            mapComponent={WorldWindMap}
        >
            <MapControls zoomOnly />
        </MapSet>
    );
}
