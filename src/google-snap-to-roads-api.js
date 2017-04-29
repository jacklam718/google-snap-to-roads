import queryStringify from './query-stringify';

const MAX_POINTS_PER_REQUEST = 100;
const API_URL = 'https://roads.googleapis.com/v1/snapToRoads';
const API_KEY = 'GOOGLE_ROADS_ACCESS_TOKEN';

const fetchSnapPoints = async (params) => {
  const qs = queryStringify(params);
  try {
    return await (await fetch(`${API_URL}?${qs}&key=${API_KEY}`)).json();
  } catch (error) {
    return error;
  }
};

const snapToRoads = (params) => {
  const coordinates = params.path.split('|');

  if (coordinates.length <= MAX_POINTS_PER_REQUEST) {
    return fetchSnapPoints({ ...params, path: coordinates.join('|') });
  }

  const snapToRoadsPromises = [];
  // 100 coordinates per segment
  let segmentedCoordinates = [];

  coordinates.forEach((coordinate) => {
    segmentedCoordinates.push(coordinate);

    if (segmentedCoordinates.length >= MAX_POINTS_PER_REQUEST) {
      const path = segmentedCoordinates.join('|');
      segmentedCoordinates = [];
      snapToRoadsPromises.push(fetchSnapPoints({ ...params, path }));
    }
  });
  if (segmentedCoordinates.length !== 0) {
    const path = segmentedCoordinates.join('|');
    snapToRoadsPromises.push(fetchSnapPoints({ ...params, path }));
  }

  return Promise.all(snapToRoadsPromises).then((results) => {
    const allSnappedPoints = [];
    results.forEach(({ snappedPoints }) => {
      allSnappedPoints.push(...snappedPoints);
    });
    return { snappedPoints: allSnappedPoints };
  });
};

export { fetchSnapPoints };
export default snapToRoads;
