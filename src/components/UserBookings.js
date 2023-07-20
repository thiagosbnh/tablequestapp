import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [boardgames, setBoardgames] = useState([]);

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
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  // Retrieve the user ID from sessionStorage
  const userId = sessionStorage.getItem('userId');

  // Filter bookings based on the logged-in user's ID
  const userBookings = bookings.filter((booking) => booking.userId === parseInt(userId));

  // Sort bookings by the booking date in descending order
  const sortedBookings = [...userBookings].sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

  return (
    <div>
      <Navbar />
      <h1>Your bookings</h1>
      {sortedBookings.map((booking) => {
        const boardgameDescription = getBoardgameDescription(booking.boardgameId);
        const boardgameTitle = getBoardgameTitle(booking.boardgameId);
        const boardgameMaxPlayers = getBoardgameMaxPlayers(booking.boardgameId);
        const tableMaxGuests = getTableMaxGuests(booking.tableId);

        return (
          <div key={booking.id}>
            <h2>Booking #{booking.id}</h2>
            <h3>User ID: {booking.userId}</h3>
            <p>Table: {booking.tableId} / Maximum {tableMaxGuests} guests</p>
            <p>
              Boardgame: {boardgameTitle}
              <br />
              {boardgameDescription}
              <br />
              Max Players: {boardgameMaxPlayers}
            </p>
            <p>Date: {formatDate(booking.bookingDate)}</p>
            <p>
              Start: {formatTime(booking.bookingStart)}
              <br />
              End: {formatTime(booking.bookingFinish)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default UserBookings;
