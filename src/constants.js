export const DrawMode = {
  drawPolygon: 'draw_polygon',
  simpleSelect: 'simple_select',
  drawCreate: 'draw.create',
  draw: 'draw'
};

export const StyleCursor = {
  crosshair: 'crosshair',
  default: 'default'
};

export const drawToolStyleDefault = [
  //polygon fill on drawing
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': 'rgba(9, 53, 72, 0.3)',
      'fill-opacity': 1
    }
  },
  // polygon outline stroke
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    paint: {
      'line-color': '#110f0c',
      'line-width': 2,
      'line-dasharray': [5, 6]
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    type: 'circle',
    paint: {
      'circle-radius': 6,
      'circle-color': '#057982'
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#EEF0F5'
    }
  }
];

export const selectedAreaTheme = {
  paint: {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      'rgba(41, 104, 131, 1)',
      'rgba(0, 0, 0, 0)'
    ]
  }
};

export const emptyGeoGson = {
  type: 'FeatureCollection',
  features: []
};
