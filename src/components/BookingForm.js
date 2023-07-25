import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function BookingForm() {
  const [boardgames, setBoardgames] = useState([]);
  const [tables, setTables] = useState([]);
  const [bookingData, setBookingData] = useState({
    userId: sessionStorage.getItem('userId'),
    tableId: null,
    boardgameId: null,
    bookingDate: '',
    bookingStart: '',
    bookingFinish: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Send the booking data to the API
    axios.post(API_BOOKINGS_URL, bookingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response.data);
        // Clear the form after successful submission
        setBookingData({
          userId: 1,
          tableId: null,
          boardgameId: null,
          bookingDate: '',
          bookingStart: '',
          bookingFinish: '',
        });
      })
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });
  };

  useEffect(() => {
    // Fetch boardgame data
    axios.get(API_BOARDGAMES_URL)
      .then((response) => setBoardgames(response.data))
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });

    // Fetch table data
    axios.get(API_TABLES_URL)
      .then((response) => setTables(response.data))
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });
  }, []);

   // Generate time options for the select menu based on opening and closing hours
  const generateTimeOptions = () => {
    const openingHour = 11; // Opening hour (in 24-hour format)
    const closingHour = 23; // Closing hour (in 24-hour format)
    const timeOptions = [];

    for (let hour = openingHour; hour <= closingHour; hour++) {
      for (let minute = 0; minute <= 45; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        timeOptions.push(
          <option value={time} key={time}>
            {time}
          </option>
        );
      }
    }

    return timeOptions;
  };

  // Generate end time options based on the selected start time
  const generateEndTimeOptions = () => {
    const { bookingStart } = bookingData;
    if (!bookingStart) return []; // Return an empty array if start time is not selected
  
    const [startHour, startMinute] = bookingStart.split(':').map(Number);
    const openingHour = 11; // Opening hour (in 24-hour format)
    const closingHour = 23; // Closing hour (in 24-hour format)
    const timeOptions = [];
  
    for (let hour = startHour; hour <= closingHour; hour++) {
      const maxMinute = (hour === startHour ? 45 : 45); // Update maxMinute to 45 for all hours
      for (let minute = (hour === startHour ? startMinute : 0); minute <= maxMinute; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        timeOptions.push(
          <option value={time} key={time}>
            {time}
          </option>
        );
      }
    }
  
    return timeOptions;
  };

  return (
    <div className="BookingForm">
      <Navbar />
      <h1>Create Booking</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Table:
          <select
            name="tableId"
            value={bookingData.tableId || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Table #{table.id} / Max {table.maxGuests} guests
              </option>
            ))}
          </select>
        </label>
        <br />
        
        <label>
          Booking Date:
          <input
            type="date"
            name="bookingDate"
            value={bookingData.bookingDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Booking Start Time:
          <select
            name="bookingStart"
            value={bookingData.bookingStart}
            onChange={handleInputChange}
            required
          >
            <option value="">Select start time</option>
            {generateTimeOptions()}
          </select>
        </label>
        <br />
        <label>
          Booking End Time:
          <select
            name="bookingFinish"
            value={bookingData.bookingFinish}
            onChange={handleInputChange}
            required
          >
            <option value="">Select end time</option>
            {generateEndTimeOptions()}
          </select>
        </label>
        <br />
        <br />
        <label>
          Want to include a Boardgame in your booking? (optional)
          <select
            name="boardgameId"
            value={bookingData.boardgameId || ''}
            onChange={handleInputChange}
          >
            <option value="">No boardgame</option>
            {boardgames.map((boardgame) => (
              <option key={boardgame.id} value={boardgame.id}>
                {boardgame.title} / Max Players: {boardgame.maxPlayers}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <button type="submit">Create Booking</button>
      </form>
    </div>
  );
}

export default BookingForm;
