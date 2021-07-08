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


export const unifyPolygons = ( selectedArea,  initialState, polygonBuffer) => {
  let unifiedPolygon = {};

  if (selectedArea.length) {
    let unifiedCityAreas = turf.union(...selectedArea);
    if (unifiedCityAreas.geometry.type === 'MultiPolygon') return null;
    // Check if unified city areas intersects with a partner area polygon
    const isMultiIntersected = initialState._data && initialState._data.features.reduce((acc, partnerArea) => {
      if (
        partnerArea.geometry.type !== 'Point' &&
        turf.intersect(unifiedCityAreas, partnerArea)
      ) {
        acc.push(partnerArea);
      }
      return acc;
    }, []);

    // We must remove the existing city areas from the initial state, to avoid duplicate layer rendering
    const removeMergedPartnerAreas = initialState._data && initialState._data.features.filter(
      feature => ![...isMultiIntersected].includes(feature)
    ) || [];

    unifiedPolygon = {
      ...unifiedPolygon,
      features: [{ ...turf.buffer(unifiedCityAreas, -polygonBuffer, { units: 'kilometers' }) }, ...removeMergedPartnerAreas]
    };

    return {
      type: 'FeatureCollection',
      ...unifiedPolygon
    };
  }
};

