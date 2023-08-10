import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours();
    const minutes = time.getMinutes();
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

  const handleDeleteBooking = (bookingId) => {
    axios.delete(`${API_BOOKINGS_URL}/${bookingId}`)
      .then((response) => {
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
      })
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });

    closeDeleteModal();
  };

  const openDeleteModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedBookingId(null);
    setShowDeleteModal(false);
  };

  // Filter bookings based on the selected date or show all bookings
  const filteredBookings = showAllBookings
    ? bookings
    : selectedDate
    ? bookings.filter((booking) => booking.bookingDate === selectedDate)
    : bookings;

  return (
    <>
    <AdminNavbar />
    <Container>
      <h3>Bookings Manager</h3><br/>
      <h5>Select a date below:</h5>
        <Row className='mb-5'>
          <Col>
            <Form>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowAllBookings(false);
                } }
              />
            </Form>
          </Col>
          <Col>
            or <Button size='md' onClick={() => setShowAllBookings(true)}> Show ALL Bookings</Button>
          </Col>
          </Row>
          <Row>
      {filteredBookings.map((booking) => {
        const boardgameDescription = getBoardgameDescription(booking.boardgameId);
        const boardgameTitle = getBoardgameTitle(booking.boardgameId);
        const boardgameMaxPlayers = getBoardgameMaxPlayers(booking.boardgameId);
        const tableMaxGuests = getTableMaxGuests(booking.tableId);

        return (
          <>
          <Col md={6}>
          <Card className='mb-4' key={booking.id}>
            <Card.Header>Booking #{booking.id}</Card.Header>
            <Card.Body >
              <Card.Title>Customer: {booking.name}</Card.Title>
              <Card.Text>
                Phone: {booking.phone}<br/>
                User ID: #{booking.userId}<br/>
                Table: {booking.tableId} / Maximum {tableMaxGuests} guests
              </Card.Text>
              <Card.Title>Date: {formatDate(booking.bookingDate)}</Card.Title>
              <Card.Text>
                Start: {formatTime(booking.bookingStart)} <br />
                End: {formatTime(booking.bookingFinish)} <br /><br />
                <Card.Subtitle>Boardgame: {boardgameTitle} </Card.Subtitle>
                <span style={{fontSize:'14px',color:'grey'}}>Description: {boardgameDescription} <br />
                Max Players: {boardgameMaxPlayers}</span>
              </Card.Text>
              <Button variant="danger" size="sm" onClick={() => openDeleteModal(booking.id)}>Cancel this Booking</Button>
            </Card.Body>
          </Card>
          </Col>
          </>
        );
      })}
      </Row>
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this booking?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDeleteBooking(selectedBookingId)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
    </>
  );
}

export default AdminBookings;
