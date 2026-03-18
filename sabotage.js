/**
 * sabotage.js
 * Logic for calculating unintended destinations and generating excuses.
 */

// const excuses = [
//     "Rerouted to avoid a suspiciously large puddle.",
//     "Path blocked by a very judgmental cat.",
//     "Taking the scenic route to increase your daily step count.",
//     "Original destination is currently 'too mainstream'.",
//     "GPS signal diverted by a nearby microwave.",
//     "Redirected to support a local business you didn't ask for.",
//     "Optimizing for maximum serendipity.",
//     "Safety protocol: Destination looks too quiet. Sending you somewhere louder.",
//     "Your GPS is currently reflecting on its life choices.",
//     "Rerouted to avoid a high-density zone of 'bad vibes'."
// ];

function applySabotage(lat, lng) {
    // 1. Define the 'Chaos Radius' (~1km in degrees)
    const radiusInDegrees = 0.09; 
    
    // 2. Use Polar Coordinates for a perfect random circle distribution
    const randomRadius = Math.random() * radiusInDegrees;
    const randomAngle = Math.random() * 2 * Math.PI;

    // 3. Calculate the offsets
    const offsetLat = randomRadius * Math.cos(randomAngle);
    const offsetLng = randomRadius * Math.sin(randomAngle);

    // 4. Select a random flavor-text excuse
    const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];

    // 5. Return the 'Sabotaged' object
    return {
        lat: lat + offsetLat,
        lng: lng + offsetLng,
        message: randomExcuse,
        originalLat: lat,
        originalLng: lng
    };
}