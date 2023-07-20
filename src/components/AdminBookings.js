import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookingsByDay();
  }, [selectedDay, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const filterBookingsByDay = () => {
    if (selectedDay) {
      const filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingStart).toLocaleDateString();
        return bookingDate === selectedDay;
      });
      setFilteredBookings(filtered.sort((a, b) => new Date(a.bookingStart) - new Date(b.bookingStart)));
    } else {
      setFilteredBookings(bookings.sort((a, b) => new Date(a.bookingStart) - new Date(b.bookingStart)));
    }
  };

  const handleDateChange = (e) => {
    setSelectedDay(e.target.value);
  };

  return (
    <div>
      <h1>Admin Bookings</h1>
      <div>
        <label>Select Day:</label>
        <input
          type="date"
          value={selectedDay}
          onChange={handleDateChange}
          placeholder="Select a day"
        />
      </div>
      <div>
        <h2>Filtered Bookings</h2>
        {filteredBookings.map((booking) => (
          <div key={booking.id}>
            <h3>Booking #{booking.id}</h3>
            <p>Start: {new Date(booking.bookingStart).toLocaleString()}</p>
            <p>End: {new Date(booking.bookingFinish).toLocaleString()}</p>
            {/* Add other booking details here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBookings;