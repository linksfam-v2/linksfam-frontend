const getLocationDetails = (latitude:number, longitude:number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  return fetch(url)
    .then(response => response.json());
}
export {
  getLocationDetails
}