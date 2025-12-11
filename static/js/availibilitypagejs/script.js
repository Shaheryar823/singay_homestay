let totalPrice = 0;

// ---------------- UTILITY ----------------
const commify = number =>
    typeof number === 'number' ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : String(number);

// ---------------- PRICE FORMATTING ----------------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[id^="price-"]').forEach(span => {
        const value = parseInt(span.textContent.trim(), 10);
        if (!isNaN(value)) span.textContent = commify(value);
    });
    togglePrice("wholeStay"); // default
});

// ---------------- ROOM BOOKING ----------------
function addRoomToBooking(roomId, roomName, price, nights) {
    price = parseInt(price);
    nights = parseInt(nights);
    const roomTotal = price * nights;

    // Disable button
    const btn = document.querySelector(`#room-${roomId} button`);
    if (btn) btn.disabled = true, btn.classList.add('opacity-50', 'cursor-not-allowed');

    // Set rooms left to 0
    const roomsLeftSpan = document.querySelector(`#room-${roomId} .text-yellow-400`);
    if (roomsLeftSpan) roomsLeftSpan.textContent = "0 Rooms Left";

    // Show desktop billing
    document.getElementById("desktopBillingWrapper")?.classList.remove("hidden");
    document.getElementById('mobileBilling')?.classList.remove('hidden');

    // Add room entries
    addDesktopRoom(roomId, roomName, nights, roomTotal);
    addMobileRoom(roomId, roomName, nights, roomTotal);

    // Update totals
    totalPrice += roomTotal;
    updateTotals();
}

let selectedRooms = [];

function addDesktopRoom(roomId, roomName, nights, roomTotal) {
    const billing = document.getElementById("billingContent");
    document.getElementById("emptyBillingBox")?.remove();

    if (!selectedRooms.includes(roomId)) {
        selectedRooms.push(roomId);
    }

    const box = document.createElement("div");
    box.className = "relative border-t pt-2 mt-2";
    box.dataset.roomId = roomId;
    box.innerHTML = `
        <button class="absolute top-0 right-0 text-red-500 text-lg font-bold px-2"
            onclick="removeRoom('${roomId}', ${roomTotal})">×</button>
        <div class="font-bold text-lg">${roomName} x ${nights} nights</div>
        <div class="text-sm text-gray-700">2 Adults • 0 Child • 1 Room</div>
        <div class="flex justify-between text-base font-semibold mt-2">
            <span>Room Price</span>
            <span>PKR ${commify(roomTotal)}</span>
        </div>
    `;
    billing.appendChild(box);
}

function submitBooking() {
    document.getElementById("selectedRoomId").value = JSON.stringify(selectedRooms);
    const form = document.getElementById("bookingForm");
    form.submit(); // submit form via POST
}


function addMobileRoom(roomId, roomName, nights, roomTotal) {
    const details = document.getElementById('mobileBillingDetails');
    if (!selectedRooms.includes(roomId)) {
        selectedRooms.push(roomId);
    }

    // Create room entry
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center py-1 border-b border-gray-700';
    div.dataset.roomId = roomId;
    div.innerHTML = `
        <span>${roomName} x ${nights} nights</span>
        <div class="flex items-center space-x-2">
            <span>PKR ${commify(roomTotal)}</span>
            <button onclick="removeRoom('${roomId}', ${roomTotal})" class="text-red-500 font-bold">×</button>
        </div>
    `;
    details.appendChild(div);

    // Show mobile billing bar
    const mobileBar = document.getElementById('mobileBilling');
    if (mobileBar) {
        mobileBar.classList.remove('hidden');
        details.classList.add('hidden'); // hide details by default
    }

    updateTotals();
}

// ---------------- REMOVE ROOM ----------------
function removeRoom(roomId, roomTotal) {
    // Remove desktop and mobile entries
    document.querySelector(`#billingContent > div[data-room-id="${roomId}"]`)?.remove();
    document.querySelector(`#mobileBillingDetails > div[data-room-id='${roomId}']`)?.remove();
    
    // Remove from selectedRooms list
    const index = selectedRooms.indexOf(roomId);
    if (index !== -1) {
        selectedRooms.splice(index, 1);
    }

    // Enable button
    const btn = document.querySelector(`#room-${roomId} button`);
    if (btn) btn.disabled = false, btn.classList.remove('opacity-50', 'cursor-not-allowed');

    // Restore rooms left
    const roomsLeftSpan = document.querySelector(`#room-${roomId} .text-yellow-400`);
    if (roomsLeftSpan) roomsLeftSpan.textContent = "1 Rooms Left";

    // Update totals
    totalPrice -= roomTotal;
    updateTotals();

    // Hide mobile bar if no rooms left
    if (document.querySelectorAll("#mobileBillingDetails > div").length === 0) {
        document.getElementById('mobileBilling')?.classList.add('hidden');
        showEmptyBilling();
    }
}


function updateTotals() {
    const desktopTotal = document.getElementById("desktopTotalPrice"); 
    if (desktopTotal) desktopTotal.textContent = "PKR " + commify(totalPrice);

    const mobileTotal = document.getElementById("mobileTotal");
    if (mobileTotal) mobileTotal.textContent = commify(totalPrice);

    const mobileRooms = document.getElementById("mobileRooms");
    if (mobileRooms) mobileRooms.textContent = document.querySelectorAll("#mobileBillingDetails > div").length;
}

function showEmptyBilling() {
    const emptyBox = document.createElement("div");
    emptyBox.id = "emptyBillingBox";
    emptyBox.className = "flex flex-col items-center justify-center h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500";
    emptyBox.innerHTML = `
        <i class="fas fa-bed text-yellow-600 text-5xl mb-3 opacity-80"></i>
        <p class="text-lg font-semibold">No Room(s)</p>
        <p class="text-sm">Selected</p>
    `;
    document.getElementById("billingContent").appendChild(emptyBox);

    totalPrice = 0;
    updateTotals();
    document.getElementById("desktopBillingWrapper")?.classList.add("hidden");
    document.getElementById('mobileBilling')?.classList.add('hidden');
}

// ---------------- RATE POPUP ----------------
function openRatePopup(basePrice, nights) {
    const tbody = document.getElementById("rateTableBody");
    tbody.innerHTML = "";
    for (let i = 1; i <= nights; i++) {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="py-2">${i} night(s)</td>
                <td class="py-2">PKR ${commify(basePrice * i)}</td>
            </tr>
        `;
    }
    document.getElementById("ratePopup")?.classList.remove("hidden");
}

function closeRatePopup() {
    document.getElementById("ratePopup")?.classList.add("hidden");
}

// ---------------- TOGGLE PRICES ----------------
function togglePrice(mode) {
    const showWhole = mode === "wholeStay";
    document.querySelectorAll(".wholeprice").forEach(el => el.style.display = showWhole ? "inline" : "none");
    document.querySelectorAll(".wholepricesent").forEach(el => el.style.display = showWhole ? "block" : "none");
    document.querySelectorAll(".nightprice").forEach(el => el.style.display = showWhole ? "none" : "inline");
    document.querySelectorAll(".nightpricesent").forEach(el => el.style.display = showWhole ? "none" : "block");

    const perNightBtn = document.querySelector(".per-night-btn");
    const wholeStayBtn = document.querySelector(".whole-stay-btn");

    wholeStayBtn.className = showWhole
        ? "whole-stay-btn py-2 px-3 text-yellow-400 font-semibold border-b-2 border-yellow-400"
        : "whole-stay-btn py-2 px-3 text-gray-400";

    perNightBtn.className = showWhole
        ? "per-night-btn py-2 px-3 text-gray-400"
        : "per-night-btn py-2 px-3 text-yellow-400 font-semibold border-b-2 border-yellow-400";
}
// Toggle mobile billing details on top summary click
function toggleMobileBilling() {
    const details = document.getElementById('mobileBillingDetails');
    if (details) details.classList.toggle('hidden');
}
