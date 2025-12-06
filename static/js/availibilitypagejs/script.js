    let totalPrice = 0;

    function commify(number) {
        if (typeof number !== 'number') return String(number);
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatPrices() {
        document.querySelectorAll('[id^="price-"]').forEach(span => {
            const priceValue = parseInt(span.textContent.trim(), 10);
            if (!isNaN(priceValue)) {
                span.textContent = commify(priceValue);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', formatPrices);

    function addRoomToBooking(roomId, roomName, price, nights) {
        price = parseInt(price);
        nights = parseInt(nights);

        const roomTotal = price * nights;

        // ------------ DISABLE THIS BUTTON ONLY ------------
        const btn = document.querySelector(`#room-${roomId} button`);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        // ------------ UPDATE ROOMS LEFT TO 0 ------------
        const roomsLeftSpan = document.querySelector(`#room-${roomId} .text-yellow-400`);
        if (roomsLeftSpan) {
            roomsLeftSpan.textContent = "0 Rooms Left";
        }
        // ------------ SHOW MAIN BILLING DIV (DESKTOP) ------------
        const billingWrapper = document.getElementById("desktopBillingWrapper");
        if (billingWrapper) {
            billingWrapper.classList.remove("hidden");
        }


        // ------------ MOBILE BILLING ------------
        const mobileBar = document.getElementById("mobileBilling");
        mobileBar.classList.remove("hidden");

        let r = document.getElementById("mobileRooms");
        let t = document.getElementById("mobileTotal");

        r.textContent = parseInt(r.textContent) + 1;
        totalPrice += roomTotal;
        t.textContent = commify(totalPrice);

        // ------------ DESKTOP BILLING ------------
        const billing = document.getElementById("billingContent");

        // Remove empty state
        const emptyBox = document.getElementById("emptyBillingBox");
        if (emptyBox) emptyBox.remove();

        // Build box
        const box = document.createElement("div");
        box.className = "relative border-t pt-2 mt-2";
        box.dataset.roomId = roomId;

        box.innerHTML = `
            <button 
                class="absolute top-0 right-0 text-red-500 text-lg font-bold px-2"
                onclick="removeBillingBox('${roomId}', ${roomTotal})">
                ×
            </button>

            <div class="font-bold text-lg">${roomName} x ${nights} nights</div>
            <div class="text-sm text-gray-700">
                2 Adults • 0 Child • 1 Room
            </div>
            <div class="flex justify-between text-base font-semibold mt-2">
                <span>Room Price</span>
                <span>PKR ${commify(roomTotal)}</span>
            </div>
        `;

        billing.appendChild(box);

        // Update desktop total
        const desktopTotal = billing.parentNode.querySelector("div.border-t.my-2.flex.justify-between.text-lg.font-bold span:last-child");
        if (desktopTotal) desktopTotal.textContent = "PKR " + commify(totalPrice);
    }

    function removeBillingBox(roomId, roomTotal) {
        // Remove the box
        const box = document.querySelector(`#billingContent > div[data-room-id="${roomId}"]`);
        if (box) box.remove();

        // ------------ ENABLE ONLY THIS BUTTON ------------
        const btn = document.querySelector(`#room-${roomId} button`);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        // ------------ RESTORE ROOMS LEFT TO 1 ------------
        const roomsLeftSpan = document.querySelector(`#room-${roomId} .text-yellow-400`);
        if (roomsLeftSpan) {
            roomsLeftSpan.textContent = "1 Rooms Left";
        }

        // Update totals
        totalPrice -= roomTotal;

        const desktopTotal = document.getElementById("billingContent").parentNode.querySelector("div.border-t.my-2.flex.justify-between.text-lg.font-bold span:last-child");
        if (desktopTotal) desktopTotal.textContent = "PKR " + commify(totalPrice);

        const t = document.getElementById("mobileTotal");
        t.textContent = commify(totalPrice);

        let r = document.getElementById("mobileRooms");
        r.textContent = Math.max(0, parseInt(r.textContent) - 1);

        // Show empty state if no rooms left
        if (document.querySelectorAll("#billingContent > div").length === 0) {
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
            document.getElementById("mobileTotal").textContent = "0";
            document.getElementById("mobileRooms").textContent = "0";
            const billingWrapper = document.getElementById("desktopBillingWrapper");
            billingWrapper.classList.add("hidden");
        }
    }

    function openRatePopup(basePrice, nights) {

        const tbody = document.getElementById("rateTableBody");
        tbody.innerHTML = "";

        for (let i = 1; i <= nights; i++) {
            const row = `
                <tr class="border-b">
                    <td class="py-2">${i}</td>
                    <td class="py-2">PKR ${commify(basePrice * i)}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        }

        document.getElementById("ratePopup").classList.remove("hidden");
    }
    function closeRatePopup() {
        document.getElementById("ratePopup").classList.add("hidden");
    }