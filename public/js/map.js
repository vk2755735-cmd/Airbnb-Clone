document.addEventListener("DOMContentLoaded", function () {

  // 🛑 safety check
  if (typeof coordinates === "undefined" || !document.getElementById("map")) {
    return;
  }

  const lat = coordinates[1];
  const lng = coordinates[0];

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Listing Location 📍")
    .openPopup();

  // 🔥 force proper rendering
  setTimeout(() => {
    map.invalidateSize(true);
  }, 300);

});

