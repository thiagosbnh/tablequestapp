import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Navbar from './Navbar';
import NavbarUser from './NavbarUser';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancellationResult, setCancellationResult] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  

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

  const handleCancelBooking = (bookingId) => {
    axios.delete(`${API_BOOKINGS_URL}/${bookingId}`)
      .then(() => {
        setCancellationResult({ success: true });
        setSelectedBookingId(bookingId); // Set the selected booking ID for Modal display
        // Fetch updated bookings data
        axios.get(API_BOOKINGS_URL)
          .then((response) => setBookings(response.data))
          .catch((error) => {
            console.error(error);
            // Handle error if needed
          });
      })
      .catch((error) => {
        setCancellationResult({ success: false });
        setSelectedBookingId(bookingId); // Set the selected booking ID for Modal display
        console.error(error);
        // Handle error if needed
      });
  
    openModal(); // Open the modal after initiating the cancellation
  };  

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);


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
    return boardgameDesc ? boardgameDesc.description : 'N/A';
  };

  const getBoardgameTitle = (boardgameId) => {
    const boardgameTitle = boardgames.find((game) => game.id === boardgameId);
    return boardgameTitle ? boardgameTitle.title : 'None selected';
  };

  const getBoardgameMaxPlayers = (boardgameId) => {
    const boardgameMaxPlayers = boardgames.find((game) => game.id === boardgameId);
    return boardgameMaxPlayers ? boardgameMaxPlayers.maxPlayers : 'N/A';
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
      <>
      {/* <Navbar /> */}
      <NavbarUser/>
      <Container>
      <div className='mb-5'><h3>Your bookings</h3></div>
      {sortedBookings.map((booking) => {
        const boardgameDescription = getBoardgameDescription(booking.boardgameId);
        const boardgameTitle = getBoardgameTitle(booking.boardgameId);
        const boardgameMaxPlayers = getBoardgameMaxPlayers(booking.boardgameId);
        const tableMaxGuests = getTableMaxGuests(booking.tableId);

        return (
          <>
          <Row>
            <Col lg={8} xl={6}>
              <Card className='mb-4'>
                <Card.Header>Booking #{booking.id}</Card.Header>
                <Card.Body key={booking.id}>
                  <Card.Title>Date: {formatDate(booking.bookingDate)}</Card.Title>
                  <Card.Text>
                    Start: {formatTime(booking.bookingStart)} <br />
                    End: {formatTime(booking.bookingFinish)} <br /><br />
                    Table: {booking.tableId} / Maximum {tableMaxGuests} guests <br /><br />
                    <Card.Subtitle>Boardgame: {boardgameTitle} </Card.Subtitle>
                    <span style={{fontSize:'14px',color:'grey'}}>Description: {boardgameDescription} <br />
                    Max Players: {boardgameMaxPlayers}</span>
                  </Card.Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      handleCancelBooking(booking.id);
                    }}
                    className="mt-3"
                  >
                    Cancel this Booking
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          </>
        );
      })}
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {cancellationResult && cancellationResult.success
                ? 'Booking Successfully Cancelled'
                : 'Error Cancelling Booking'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cancellationResult && cancellationResult.success
              ? 'Your booking has been successfully cancelled.'
              : 'An error occurred while cancelling the booking.'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
    </>
  );
}

export default UserBookings;
