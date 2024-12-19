const form = document.getElementById("setup-form");
const squadSizeSelect = document.getElementById("squad-size");
const playerInputs = document.getElementById("player-inputs");

const icons = [
    { name: "Blue Team Leader", src: "assets/icons/BlueTeamLeader.webp" },
    { name: "Calamity", src: "assets/icons/Calamity.webp" },
    { name: "Chun Li", src: "assets/icons/ChunLi.webp" },
    { name: "Jinx", src: "assets/icons/Jinx.webp" },
    { name: "Juice", src: "assets/icons/juice.webp" },
    { name: "Kratos", src: "assets/icons/Kratos.webp" },
    { name: "LeBron", src: "assets/icons/LeBron.jpg" },
    { name: "Miles", src: "assets/icons/miles.webp" },
    { name: "MrBeast", src: "assets/icons/MrBeast.jpg" },
    { name: "NickEh30", src: "assets/icons/NickEh30.jpg" },
    { name: "Peter Griffin", src: "assets/icons/peter.webp" },
    { name: "Raven Team Leader", src: "assets/icons/RavenTeamLeader.webp" },
    { name: "Renegade Raider", src: "assets/icons/RenegadeRaider.webp" },
    { name: "Skull Trooper", src: "assets/icons/skulltrooper.webp" },
    { name: "Swamp Stalker", src: "assets/icons/SwampStalker.jpg" },
    { name: "Travis Scott", src: "assets/icons/TravisScott.jpg" }
];

// Get the video element
const video = document.getElementById("background-video");

// Load the saved time from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const savedTime = localStorage.getItem("videoTime");
    if (savedTime) {
        video.currentTime = parseFloat(savedTime); // Set the video's time
    }
    video.play(); // Ensure the video plays
});

// Save the current playback time before the page unloads
window.addEventListener("beforeunload", () => {
    localStorage.setItem("videoTime", video.currentTime);
});

// Squad setup logic
squadSizeSelect.addEventListener("change", () => {
    playerInputs.innerHTML = "";
    const squadSize = parseInt(squadSizeSelect.value);

    for (let i = 1; i <= squadSize; i++) {
        playerInputs.innerHTML += `
            <div class="player">
                <label>Player ${i} Gamertag:</label>
                <input type="text" placeholder="Enter Gamertag" required>

                <label>Player ${i} Icon:</label>
                <div class="custom-dropdown" id="dropdown-${i}">
                    <div class="selected-option" onclick="toggleDropdown(${i})">
                        <img src="${icons[0].src}" alt="${icons[0].name}" class="icon-preview">
                        <span>${icons[0].name}</span>
                    </div>
                    <div class="dropdown-options" style="display: none;">
                        ${icons.map(icon => `
                            <div class="option" onclick="selectIcon(${i}, '${icon.name}', '${icon.src}')">
                                <img src="${icon.src}" alt="${icon.name}" class="icon-option">
                                <span>${icon.name}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    }
});

function toggleDropdown(player) {
    const dropdown = document.querySelector(`#dropdown-${player} .dropdown-options`);
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

function selectIcon(player, name, src) {
    const selectedOption = document.querySelector(`#dropdown-${player} .selected-option`);
    selectedOption.innerHTML = `
        <img src="${src}" alt="${name}" class="icon-preview">
        <span>${name}</span>
    `;
    document.querySelector(`#dropdown-${player} .dropdown-options`).style.display = "none";
}

// Form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const gameMode = document.getElementById("game-mode").value;

    // Collect player data
    const players = [];
    playerInputs.querySelectorAll(".player").forEach((playerInput) => {
        const gamertag = playerInput.querySelector("input[type=text]").value;
        const icon = playerInput.querySelector(".selected-option img").src;
        players.push({ gamertag, icon });
    });

    // Save to localStorage
    localStorage.setItem("gameMode", gameMode);
    localStorage.setItem("players", JSON.stringify(players));

    window.location.href = "game.html";
});

// Map Logic for game.html
if (window.location.pathname.includes("game.html")) {
    const landingSpots = {
        Regular: [
            "brutalBoxCars", "Burd", "canyonCrossing", "demonsDojo", "floodedFrogs",
            "foxyfloodgate", "hopefulHeights", "lostLake", "magicMosses", "maskedMeadows",
            "nightshiftForrest", "pumpedPower", "seaportCity", "shiningSpan", "shogunsSolitude",
            "twinkleTerrace", "warriorsWatch", "wiffyWarfs"
        ],
        OG: [
            "anarchyAcres", "dustyDepot", "fatalFields", "flushFactory", "greasyGrove",
            "lonelyLodge", "moistyMire", "pleasantPark", "retailRow", "saltySprings",
            "tomatoTown", "wailingWoods"
        ]
    };

    const gameMode = localStorage.getItem("gameMode") || "Regular";
    const selectedMap = document.getElementById("map-image");
    const mapLocationText = document.getElementById("map-location");

    function displayRandomLocation() {
        const spots = landingSpots[gameMode];
        const randomIndex = Math.floor(Math.random() * spots.length);
        const selectedLocation = spots[randomIndex];

        const mapPath = `assets/maps/${gameMode.toLowerCase()}/${selectedLocation}.png`;
        selectedMap.src = mapPath;

        mapLocationText.textContent = `Landing Spot: ${formatName(selectedLocation)}`;
    }

    function formatName(name) {
        return name.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()).trim();
    }

    const defaultMap = gameMode === "OG" ? "assets/maps/og/ogmap.png" : "assets/maps/regular/regularPlain.png";
    selectedMap.src = defaultMap;

    document.getElementById("spin-button").addEventListener("click", displayRandomLocation);
}
