// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default map view

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a marker for the user's current location
const marker = L.marker([0, 0]).addTo(map);

// Add a geocoder control (search bar) to the map
const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false // Prevents the default marker from being added
}).addTo(map);

geocoder.on('markgeocode', function(event) {
    const searchedLocation = event.geocode.center;

    // Create a marker for the searched location
    const searchMarker = L.marker(searchedLocation).addTo(map);

    // Center the map to the searched location
    map.setView(searchedLocation, 15);

    // Draw a line between the current location and the searched location
    if (marker.getLatLng()) {
        const currentLocation = marker.getLatLng();
        const polyline = L.polyline([currentLocation, searchedLocation], { color: 'red' }).addTo(map);
    }
});

// Enable high-accuracy mode for geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);

            // Update the marker position and center map to the user's current location
            marker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 15);

            // Remove any existing accuracy circle
            if (window.accuracyCircle) {
                map.removeLayer(window.accuracyCircle);
            }

            // Show accuracy circle around the marker
            window.accuracyCircle = L.circle([latitude, longitude], {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.2,
                radius: accuracy // Use the accuracy radius provided by geolocation
            }).addTo(map);
        },
        (error) => {
            console.error(`Error: ${error.message}`);
            alert(`Error: ${error.message}`);
        },
        {
            enableHighAccuracy: true, // Request high-accuracy location data
            timeout: 10000, // 10-second timeout
            maximumAge: 0 // No caching; always get fresh location data
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}
