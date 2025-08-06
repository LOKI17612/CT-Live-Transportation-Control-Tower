let map;
let truckMarkers = {}; // Store truck markers

// Initialize Leaflet Map
function initLeafletMap() {
  map = L.map("leafletMap").setView([17.385044, 78.486671], 6); // Center: India

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Initial Trucks
  updateTruck("Truck 1", 17.4, 78.5);
  updateTruck("Truck 2", 16.5, 80.6);
  updateTruck("Truck 3", 15.8, 78.0);
}

// Add or Update Truck Marker
function updateTruck(truckName, lat, lng) {
  if (truckMarkers[truckName]) {
    truckMarkers[truckName].setLatLng([lat, lng]);
    truckMarkers[truckName].bindPopup(`<b>${truckName}</b><br>📍 Updated Location: ${lat}, ${lng}`);
  } else {
    const marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`<b>${truckName}</b><br>📍 Location: ${lat}, ${lng}`);
    truckMarkers[truckName] = marker;
  }
}

// Trip Sheet Submission
document.getElementById("tripForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("✅ Trip Sheet Submitted Successfully!");
  e.target.reset();
});

// Admin Dashboard - Delay Report with Cancel
const delayForm = document.getElementById("delayForm");
const reportTable = document.querySelector("#reportTable tbody");

delayForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const driver = document.getElementById("delayDriver").value;
  const reason = document.getElementById("delayReason").value;
  const remarks = document.getElementById("delayRemarks").value;
  const time = new Date().toLocaleString();

  addReportRow(driver, reason, remarks, time);
  saveToLocalStorage(driver, reason, remarks, time);

  alert("📩 Delay Report Submitted!");
  delayForm.reset();
});

// Add a Row with Cancel Button
function addReportRow(driver, reason, remarks, time) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${driver}</td>
    <td>${reason}</td>
    <td>${remarks}</td>
    <td>${time}</td>
    <td><button class="cancelBtn">❌ Cancel</button></td>
  `;
  reportTable.appendChild(row);

  // Cancel Button Functionality
  row.querySelector(".cancelBtn").addEventListener("click", () => {
    row.remove();
    removeFromLocalStorage(driver, time);
  });
}

// Save Reports in LocalStorage
function saveToLocalStorage(driver, reason, remarks, time) {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.push({ driver, reason, remarks, time });
  localStorage.setItem("reports", JSON.stringify(reports));
}

// Remove Report from LocalStorage
function removeFromLocalStorage(driver, time) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports = reports.filter(r => !(r.driver === driver && r.time === time));
  localStorage.setItem("reports", JSON.stringify(reports));
}

// Load Reports on Page Load
window.addEventListener("load", () => {
  initLeafletMap();
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.forEach(r => addReportRow(r.driver, r.reason, r.remarks, r.time));
});

// Export to Excel
document.getElementById("exportExcel").addEventListener("click", () => {
  let table = document.getElementById("reportTable").outerHTML;
  let file = new Blob([table], { type: "application/vnd.ms-excel" });
  let url = URL.createObjectURL(file);
  let a = document.createElement("a");
  a.href = url;
  a.download = "Reports.xls";
  a.click();
});
