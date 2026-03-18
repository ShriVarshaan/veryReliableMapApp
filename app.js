async function handleNavigation() {
    const query = document.getElementById('search-input').value;
    let finalData;

    try {
        const realLocation = await searchAddress(query); 
        finalData = applySabotage(realLocation.lat, realLocation.lon);
    } catch (err) {
        console.warn("Search failed, sabotaging current view instead.");
        const fallback = map.getCenter();
        finalData = applySabotage(fallback.lat, fallback.lng);
    }

    // Step 3: Update UI (Outside the try/catch to ensure it always runs)
    if (marker) {
        marker.setLatLng([finalData.lat, finalData.lng]);
        marker.bindPopup(`<b>Arrived-ish!</b><br>${finalData.message}`).openPopup();
        map.flyTo([finalData.lat, finalData.lng], 15);
    }
}