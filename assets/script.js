document.addEventListener('DOMContentLoaded', () => {
    const tripForm = document.getElementById('trip-form');
    const myTripsTableBody = document.querySelector('#my-trips tbody');

    // Function to calculate the number of days between two dates
    function calculateDays(arrivalDate, departureDate) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const arrival = new Date(arrivalDate);
        const departure = new Date(departureDate);
        return Math.round(Math.abs((arrival - departure) / oneDay));
    }

    // Function to calculate total cost based on accommodation type and number of days
    function calculateTotal(accommodation, days) {
        if (accommodation === 'single') {
            return 10000 * days;
        } else if (accommodation === 'double') {
            return 13000 * days;
        } else {
            return 0; // If accommodation type is invalid, return 0
        }
    }

    // Function to populate the table with captured trip data
    function populateTripsTable(trips) {
        myTripsTableBody.innerHTML = '';
        trips.forEach(trip => {
            const days = calculateDays(trip.arrivalDate, trip.departureDate);
            const total = calculateTotal(trip.accommodation, days);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trip.destination}</td>
                <td>${trip.arrivalDate}</td>
                <td>${trip.departureDate}</td>
                <td>${days}</td>
                <td>${trip.accommodation}</td>
                <td>${total}</td>
            `;
            myTripsTableBody.appendChild(row);
        });
    }

    // Function to handle form submission
    tripForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission

        // Extract form data
        const formData = new FormData(tripForm);
        const arrivalDate = formData.get('arrival-date');
        const departureDate = formData.get('departure-date');
        const accommodation = formData.get('accommodation');

        // Calculate the number of days
        const days = calculateDays(arrivalDate, departureDate);

        // Calculate the total cost based on accommodation type and number of days
        const total = calculateTotal(accommodation, days);

        // You can now handle this data as needed, such as saving it to the database and updating the table
        const trip = {
            destination: 'Paris', // Assuming fixed destination for now
            arrivalDate,
            departureDate,
            accommodation,
            total,
        };

        // Add trip to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.destination}</td>
            <td>${trip.arrivalDate}</td>
            <td>${trip.departureDate}</td>
            <td>${days}</td>
            <td>${trip.accommodation}</td>
            <td>${trip.total}</td>
        `;
        myTripsTableBody.appendChild(row);

        // Reset the form after submission
        tripForm.reset();
    });

    // Initial function call to populate the table with existing trip data (if any)
    const sampleTripData = [
        {
            destination: 'Paris',
            arrivalDate: '2024-05-10',
            departureDate: '2024-05-15',
            accommodation: 'double',
            total: 12000,
        }
    ];
    populateTripsTable(sampleTripData);
});
