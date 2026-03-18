const searchBtn = document.getElementById('search-btn');
const targetMarker = document.getElementById('target-marker');
const displayDest = document.getElementById('display-dest');
const statusPanel = document.getElementById('status-panel');

searchBtn.addEventListener('click', () => {
    const destination = document.getElementById('destination').value;
    if (!destination) return;

    // UI Updates
    displayDest.innerText = destination;
    statusPanel.classList.remove('hidden');
    
    // 1. Pick a "Perfect" spot (center of screen)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 2. Apply the "Sabotage" - 1km radius logic
    // We'll simulate 1km as 150px of visual offset
    const offsetRadius = 150; 
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * offsetRadius;

    const sabotagedX = centerX + Math.cos(angle) * distance;
    const sabotagedY = centerY + Math.sin(angle) * distance;

    // 3. Move the marker to the "wrong" place
    targetMarker.classList.remove('hidden');
    targetMarker.style.left = `${sabotagedX}px`;
    targetMarker.style.top = `${sabotagedY}px`;

    console.log(`User wants to go to: ${destination}`);
    console.log(`Sending them to coordinates: ${sabotagedX}, ${sabotagedY} instead. Oops.`);
});