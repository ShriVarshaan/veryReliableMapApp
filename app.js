// --- Your Current Variables ---
const searchBtn = document.getElementById('search-btn');
const targetMarker = document.getElementById('target-marker');
const displayDest = document.getElementById('display-dest');
const statusPanel = document.getElementById('status-panel');

let routingControl = null;

// app.js

// Initialize the map, centering on Birmingham
const map = L.map('map').setView([52.4862, -1.8904], 13);

// Load the standard OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentMarker = null;

// Intercept user clicks
map.on('click', function(e) {
    const intendedLat = e.latlng.lat;
    const intendedLng = e.latlng.lng;

    // Pass the intended destination to our sabotage function
    const sabotagedPos = applySabotage(intendedLat, intendedLng);

    // Remove the previous marker if it exists
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Place the marker at the WRONG location
    currentMarker = L.marker([sabotagedPos.lat, sabotagedPos.lng]).addTo(map);

    // Gaslight the user with a confident popup
    currentMarker.bindPopup(`<b>Destination locked!</b>${sabotagedPos.message}`)
        .openPopup();

    // Smoothly pan to the incorrect location to sell the illusion
    map.flyTo([sabotagedPos.lat, sabotagedPos.lng], 15);
   
    console.log(`Intended: ${intendedLat}, ${intendedLng}`);
    console.log(`Actual: ${sabotagedPos.lat}, ${sabotagedPos.lng}`);
});

// --- Fixed Sabotage Logic ---
function applySabotage(lat, lon) {
    const kmInDegrees = 0.009; // 1km roughly
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * kmInDegrees;

    return {
        lat: lat + Math.cos(angle) * distance,
        lng: lon + Math.sin(angle) * distance,
        message: "Rerouted to avoid a very judgmental pigeon."
    };
}

// --- Fixed Handle Navigation ---


async function handleNavigation() {
    const query = document.getElementById('destination').value;
    if (!query) return;

    displayDest.innerText = query;
    statusPanel.classList.remove('hidden');

    // 1. Get the User's Real Source Location
    navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        try {
            // 2. Get the Intended Destination
            const realLocation = await searchAddress(query); 
            
            // 3. Sabotage it
            const finalData = applySabotage(realLocation.lat, realLocation.lon);

            // 4. Clear old route if it exists
            if (routingControl) {
                map.removeControl(routingControl);
            }

            // 5. Draw the "Reliable" Route
            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLon),
                    L.latLng(finalData.lat, finalData.lng)
                ],
                lineOptions: {
                    styles: [{ color: '#ff4757', weight: 4 }] // Red line for the "sabotage"
                },
                addWaypoints: false,
                draggableWaypoints: false,
                createMarker: function(i, wp) {
                    if (i === 1) { // Only create a marker for the destination
                        return L.marker(wp.latLng).bindPopup(`<b>Arrived-ish!</b><br>${finalData.message}`).openPopup();
                    }
                    return L.marker(wp.latLng).bindPopup("Your Real Location");
                }
            }).addTo(map);

            map.flyTo([finalData.lat, finalData.lng], 14);

        } catch (err) {
            console.error("Navigation failed", err);
        }
    }, (error) => {
        alert("Please enable location services to use the source-to-destination routing.");
    });
}

searchBtn.addEventListener('click', handleNavigation);