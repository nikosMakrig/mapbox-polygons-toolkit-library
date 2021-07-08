import * as turf from "@turf/turf";


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

