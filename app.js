// --- Your Current Variables ---
const searchBtn = document.getElementById('search-btn');
const targetMarker = document.getElementById('target-marker');
const displayDest = document.getElementById('display-dest');
const statusPanel = document.getElementById('status-panel');

// --- Your Current Sabotage Logic (Adapted for the function) ---
function applySabotage(lat, lon) {
    const offsetRadius = 150; 
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * offsetRadius;

    return {
        lat: lat + Math.cos(angle) * distance,
        lng: lon + Math.sin(angle) * distance,
        message: "You have arrived-ish."
    };
}

// --- The Incoming Function (Integrated) ---
async function handleNavigation() {
    // Maps 'search-input' from incoming code to your 'destination' ID
    const query = document.getElementById('destination').value;
    if (!query) return;

    // UI Updates from your current file
    displayDest.innerText = query;
    statusPanel.classList.remove('hidden');

    let finalData;

    try {
        const realLocation = await searchAddress(query); 
        finalData = applySabotage(realLocation.lat, realLocation.lon);
    } catch (err) {
        console.warn("Search failed, sabotaging current view instead.");
        // Fallback using map center if available, otherwise screen center
        const fallback = (typeof map !== 'undefined') ? map.getCenter() : { lat: window.innerWidth / 2, lng: window.innerHeight / 2 };
        finalData = applySabotage(fallback.lat, fallback.lng);
    }

    // Step 3: Update UI (The merged UI updates)
    
    // 1. Update the CSS marker from your current file
    targetMarker.classList.remove('hidden');
    targetMarker.style.left = `${finalData.lat}px`;
    targetMarker.style.top = `${finalData.lng}px`;

    // 2. Update the Map marker from the incoming code
    if (typeof marker !== 'undefined' && marker !== null) {
        marker.setLatLng([finalData.lat, finalData.lng]);
        marker.bindPopup(`<b>Arrived-ish!</b><br>${finalData.message}`).openPopup();
        if (typeof map !== 'undefined') map.flyTo([finalData.lat, finalData.lng], 15);
    }

    console.log(`User wants to go to: ${query}`);
    console.log(`Sending them to: ${finalData.lat}, ${finalData.lng}`);
}

// --- Your Current Event Listener ---
searchBtn.addEventListener('click', handleNavigation);