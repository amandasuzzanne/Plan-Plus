document.addEventListener('DOMContentLoaded', () => {
    const destinationsList = document.getElementById('destinations');
    const tripForm = document.getElementById('trip-form');
    const myTripsTableBody = document.querySelector('#my-trips tbody');

    // Function to fetch destinations from the server and populate the destinations list
    function fetchDestinations() {
        fetch('http://localhost:3000/destinations')
            .then(response => response.json())
            .then(destinations => {
                destinations.forEach((destination, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'trip item';
                    listItem.textContent = destination.name;
                    listItem.dataset.id = destination.id;

                    if (index === 0) {
                        document.getElementById('poster').src = destination.photo;
                        document.getElementById('description').textContent = destination.description;
                        listItem.classList.add('selected');
                    }

                    listItem.addEventListener('click', () => {
                        document.getElementById('poster').src = destination.photo;
                        document.getElementById('description').textContent = destination.description;

                        document.querySelectorAll('.trip.item').forEach(item => item.classList.remove('selected'));
                        listItem.classList.add('selected');
                    });

                    destinationsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching destinations:', error));
    }

    // Function to fetch trips from the server and populate my trips table
    function fetchTrips() {
        fetch('http://localhost:3000/trips')
            .then(response => response.json())
            .then(trips => {
                tripsData = trips;
                populateTripsTable(trips);
            })
            .catch(error => console.error('Error fetching trips:', error));
    }

    function populateTripsTable(trips) {
        myTripsTableBody.innerHTML = '';
        trips.forEach(trip => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trip.destination}</td>
                <td>${trip.arrivalDate}</td>
                <td>${trip.departureDate}</td>
                <td>${trip.days}</td>
                <td>${trip.accommodation}</td>
                <td>${trip.total}</td>
                <td>
                    <button class="ui red button delete-btn" data-id="${trip.id}">Delete</button>
                </td>
            `;
            myTripsTableBody.appendChild(row);
        });

        // Add event listeners for delete and update buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTrip);
        });

    }

    function deleteTrip(event) {
        const tripId = event.target.dataset.id;
        fetch(`http://localhost:3000/trips/${tripId}`, {
            method: 'DELETE',
        })
        .then(() => {
            fetchTrips();
        })
        .catch(error => console.error('Error deleting trip:', error));
    }

    tripForm.addEventListener('submit', e => {
        // Prevent default form submission
        e.preventDefault();

        const formData = new FormData(tripForm);
        const arrivalDate = formData.get('arrival-date');
        const departureDate = formData.get('departure-date');
        const accommodation = formData.get('accommodation');

        const oneDay = 24 * 60 * 60 * 1000;
        const days = Math.round(Math.abs((new Date(arrivalDate) - new Date(departureDate)) / oneDay));

        const trip = {
            destination: destinationsList.querySelector('.selected').textContent,
            arrivalDate,
            departureDate,
            accommodation,
            days,
            total: accommodation === 'single' ? days * 10000 : days * 13000,
        };

        fetch('http://localhost:3000/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip),
        })
        .then(response => response.json())
        .then(() => {
            fetchTrips();
        })
        .catch(error => console.error('Error adding trip:', error));

        tripForm.reset();
    });

    fetchDestinations();
    fetchTrips();
});
