import * as turf from '@turf/turf';

export const drawCreate = (map, layer, event, polygonBuffer, selectedAreaLayer) => {
  try {
    const selectedArea = event.features[0];
    const features = map.queryRenderedFeatures(
      event.point,
      { layers: [layer] }
    );

    if(map.getZoom() > 15.7){
      throw  Error( 'Zoom level too big' );
    }
    let selectedPolygons = [];
    const intersectedPolygonsWithBuffer = features.reduce((acc, feature) => {
      const selfIntersection = turf.kinks(selectedArea);
      const polygonInSelectedArea = turf.intersect(feature, selectedArea);

      if (!selfIntersection.features[0] && polygonInSelectedArea) {
        acc.push(turf.buffer(feature, polygonBuffer, { units: 'kilometers' }));

        selectedPolygons.push(feature)
        map.setFeatureState(
          { source: selectedAreaLayer, id: feature.id },
          { selected: true }
        );


      }
      if(selfIntersection.features[0]) {
        throw  Error('Polygon is self intersected');
      }
      return acc;
    }, []);


    map.getSource(selectedAreaLayer).setData({
      type: "FeatureCollection",
      features: selectedPolygons
    });

    return {
      intersectedPolygonsWithBuffer,
      selectedPolygons
    }

  } catch (error) {
    return { error }
  }
};
