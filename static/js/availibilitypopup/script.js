function openPopup(roomType) {
    document.getElementById("roomTypeInput").value = roomType;
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup").classList.add("flex");
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
    document.getElementById("popup").classList.remove("flex");
}