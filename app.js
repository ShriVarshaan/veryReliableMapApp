async function handleNavigation() {
    const query = document.getElementById('search-input').value;
    
    // Step 1: Get real location (from Dev B's api.js)
    const realLocation = await searchAddress(query); 

    // Step 2: Run the sabotage!
    const sabotagedData = applySabotage(realLocation.lat, realLocation.lon);

    // Step 3: Update the Map (Leaflet syntax)
    // Move the marker to the WRONG place
    marker.setLatLng([sabotagedData.lat, sabotagedData.lng]);
    
    // Show the funny excuse in the popup
    marker.bindPopup(`<b>Arrived-ish!</b><br>${sabotagedData.message}`).openPopup();

    // Pan the map to the wrong location
    map.flyTo([sabotagedData.lat, sabotagedData.lng], 15);
}