export default query => (
  Object.keys(query).map(queryKey => (
    `${queryKey}=${query[queryKey]}`
  )).join('&')
);
