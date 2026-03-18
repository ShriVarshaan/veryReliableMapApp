// --- Your Current Variables ---
const searchBtn = document.getElementById('search-btn');
const targetMarker = document.getElementById('target-marker');
const displayDest = document.getElementById('display-dest');
const statusPanel = document.getElementById('status-panel');

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
    currentMarker.bindPopup("<b>Destination locked!</b><br>You are definitely going exactly where you clicked.")
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

    let finalData;

    try {
        const realLocation = await searchAddress(query); 
        finalData = applySabotage(realLocation.lat, realLocation.lon);
    } catch (err) {
        const fallback = map.getCenter();
        finalData = applySabotage(fallback.lat, fallback.lng);
    }

    // Ensure currentMarker exists on the map
    if (!currentMarker) {
        currentMarker = L.marker([finalData.lat, finalData.lng]).addTo(map);
    } else {
        currentMarker.setLatLng([finalData.lat, finalData.lng]);
    }

    // Update Popup and Map
    currentMarker.bindPopup(`<b>Arrived-ish!</b><br>${finalData.message}`).openPopup();
    map.flyTo([finalData.lat, finalData.lng], 15);

    // Synchronize the CSS overlay (targetMarker) if you are using one
    const pixelPoint = map.latLngToContainerPoint([finalData.lat, finalData.lng]);
    targetMarker.classList.remove('hidden');
    targetMarker.style.left = `${pixelPoint.x}px`;
    targetMarker.style.top = `${pixelPoint.y}px`;
}

// --- Your Current Event Listener ---
searchBtn.addEventListener('click', handleNavigation);

document.getElementById('destination').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleNavigation();
});