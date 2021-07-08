import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // ES6

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './map.css';

import { DrawMode, drawToolStyleDefault, emptyGeoGson, selectedAreaTheme, StyleCursor } from "./constants";

import { SelectArea } from "./SelectArea";
import { addSource } from "./Source/addSource";
import { drawCreate } from "./functions/index";

export const MapGLToolKit = ({ map, drawToolStyle, returnToUser, polygonBuffer, layer, selectedAreaLayer }) => {
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [draw, setDraw] = useState(null);

  const drawPolygon = event => {
    const data = drawCreate(map, layer, event, polygonBuffer, selectedAreaLayer);
    returnToUser(data);
    setDrawEnabled(false)
  };


  useEffect(() => {
    if (map && draw) {
      if (drawEnabled) {
        map.getSource('selectedArea').setData(emptyGeoGson);
        draw.changeMode(DrawMode.drawPolygon);
        map.getCanvas().style.cursor = StyleCursor.crosshair;
      } else {
        draw.changeMode(DrawMode.simpleSelect);
        map.getCanvas().style.cursor = StyleCursor.default;
        draw.deleteAll();
      }
    }
  }, [map, drawEnabled, draw]);

  useEffect(() => {
    if (map) {
      map.on(DrawMode.drawCreate, event => drawPolygon(event));

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        styles: drawToolStyle
      });

      map.addControl(draw);
      setDraw(draw);
      addSource(map, selectedAreaLayer, emptyGeoGson, selectedAreaTheme);

      map.on('load',()=>{
        map.moveLayer('selectedArea', 'gl-draw-polygon-stroke-active.cold');
      });

      return () => map.off(DrawMode.draw, drawPolygon);
    }
  }, [map, drawToolStyle]);


  return <SelectArea handleClick={() => setDrawEnabled(!drawEnabled)}/>
};

MapGLToolKit.defaultProps = {
  map: null,
  drawToolStyle: drawToolStyleDefault,
  "returnToUser": () => {},
  selectedAreaLayer: 'selectedArea',
  polygonBuffer: 0.05
};

MapGLToolKit.propTypes = {
  map: PropTypes.object,
  drawToolStyle: PropTypes.array,
  returnToUser: PropTypes.func,
  selectedAreaLayer: PropTypes.string,
  polygonBuffer: PropTypes.number
};


