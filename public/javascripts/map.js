mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/navigation-night-v1", // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});
// Create a new marker.
const marker = new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.addTo(map);
