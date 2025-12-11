document.addEventListener('DOMContentLoaded', function () {

    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    const today = checkinInput.getAttribute('data-today');
    const tomorrow = checkoutInput.getAttribute('data-tomorrow');

    const checkout = flatpickr("#checkout", {
        dateFormat: "Y-m-d",
        defaultDate: tomorrow,
        minDate: tomorrow
    });

    const checkin = flatpickr("#checkin", {
        dateFormat: "Y-m-d",
        defaultDate: today,
        minDate: today,
        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                const nextDay = new Date(selectedDates[0].getTime() + 86400000);
                checkout.set("minDate", nextDay);
            }
        }
    });

});
