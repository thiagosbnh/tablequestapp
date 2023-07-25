import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAllBookings, setShowAllBookings] = useState(false);

  useEffect(() => {
    // Fetch bookings data
    axios.get(API_BOOKINGS_URL)
      .then((response) => setBookings(response.data))
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });

    // Fetch boardgames data
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

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getBoardgameDescription = (boardgameId) => {
    const boardgameDesc = boardgames.find((game) => game.id === boardgameId);
    return boardgameDesc ? boardgameDesc.description : '';
  };

  const getBoardgameTitle = (boardgameId) => {
    const boardgameTitle = boardgames.find((game) => game.id === boardgameId);
    return boardgameTitle ? boardgameTitle.title : '';
  };

  const getBoardgameMaxPlayers = (boardgameId) => {
    const boardgameMaxPlayers = boardgames.find((game) => game.id === boardgameId);
    return boardgameMaxPlayers ? boardgameMaxPlayers.maxPlayers : '';
  };

  const getTableMaxGuests = (tableId) => {
    const tableMaxGuests = tables.find((table) => table.id === tableId);
    return tableMaxGuests ? tableMaxGuests.maxGuests : '';
  };

  const handleDeleteBooking = (bookingId) => {
    // Perform the delete request to remove the booking from the database
    axios.delete(`${API_BOOKINGS_URL}/${bookingId}`)
      .then((response) => {
        // If successful, update the state to remove the deleted booking
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
      })
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });
  };

  // Filter bookings based on the selected date or show all bookings
  const filteredBookings = showAllBookings
    ? bookings
    : selectedDate
    ? bookings.filter((booking) => booking.bookingDate === selectedDate)
    : bookings;

  return (
    <div>
      <AdminNavbar />
      <h1>Admin Bookings</h1>
      <div>
        {/* Date input to filter bookings */}
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setShowAllBookings(false);
          }}
        />
        {/* Show All Bookings button */}
        <span> or </span><button onClick={() => setShowAllBookings(true)}>SHOW ALL BOOKINGS</button>
      </div>
      {filteredBookings.map((booking) => {
        const boardgameDescription = getBoardgameDescription(booking.boardgameId);
        const boardgameTitle = getBoardgameTitle(booking.boardgameId);
        const boardgameMaxPlayers = getBoardgameMaxPlayers(booking.boardgameId);
        const tableMaxGuests = getTableMaxGuests(booking.tableId);

        return (
          <div key={booking.id}>
            <h2>Booking #{booking.id}</h2>
            <h3>User ID: {booking.userId}</h3>
            <p>Table: {booking.tableId} / Maximum {tableMaxGuests} guests</p>
            <p>Boardgame: {boardgameTitle} <br /> {boardgameDescription} <br /> Max Players: {boardgameMaxPlayers}</p>
            <p>Date: {formatDate(booking.bookingDate)}</p>
            <p>
              Start: {formatTime(booking.bookingStart)}
              <br />
              End: {formatTime(booking.bookingFinish)}
            </p>
            <button onClick={() => handleDeleteBooking(booking.id)}>CANCEL THIS BOOKING</button>
          </div>
        );
      })}
    </div>
  );
}

export default AdminBookings;
