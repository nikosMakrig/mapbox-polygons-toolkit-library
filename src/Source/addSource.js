export const addSource = (map, id, data, layer) => {
  map.on('load', function () {
    map.addSource(id, {
      type: 'geojson',
      lineMetrics: true,
      data
    });

    map.addLayer({
      'id': id,
      'type': 'fill',
      'source': id,
      'layout': {},
      ...layer
    });
  });
};
