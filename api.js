/**
 * api.js
 * Geocoding logic to turn text addresses into coordinates.
 */
async function searchAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            // Return the first result
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        } else {
            throw new Error("Location not found.");
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        throw error;
    }
}