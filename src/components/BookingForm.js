import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarUser from './NavbarUser';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';

const API_BOOKINGS_URL = "http://localhost:4000/bookings";
const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";
const API_TABLES_URL = "http://localhost:4000/tables";

function BookingForm() {
  const [boardgames, setBoardgames] = useState([]);
  const [tables, setTables] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    userId: sessionStorage.getItem('userId'),
    tableId: null,
    boardgameId: null,
    bookingDate: '',
    bookingStart: '',
    bookingFinish: '',
    name: sessionStorage.getItem('userName'),
    phone: sessionStorage.getItem('userPhone'),
  });
  const [boardgameDescription, setBoardgameDescription] = useState('');
  const [bookings, setBookings] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextClick = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBackClick = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (event) => {
  event.preventDefault();

  const userData = {
    userId: sessionStorage.getItem('userId'),
    tableId: bookingData.tableId,
    boardgameId: bookingData.boardgameId,
    bookingDate: bookingData.bookingDate,
    bookingStart: bookingData.bookingStart,
    bookingFinish: bookingData.bookingFinish,
    name: sessionStorage.getItem('userName'),
    phone: sessionStorage.getItem('userPhone'),
  };

  // Send the booking data to the API
  axios.post(API_BOOKINGS_URL, userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response.data);
      // Clear the form after successful submission
      setBookingData({
        userId: sessionStorage.getItem('userId'),
        tableId: null,
        boardgameId: null,
        bookingDate: '',
        bookingStart: '',
        bookingFinish: '',
        name: sessionStorage.getItem('userName'),
        phone: sessionStorage.getItem('userPhone'),
      });
    })
    .catch((error) => {
      console.error(error);
      // Handle error if needed
    });
    setCurrentStep(4);
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

  useEffect(() => {
    // Fetch boardgame description whenever boardgameId changes
    if (bookingData.boardgameId) {
      axios.get(`${API_BOARDGAMES_URL}/${bookingData.boardgameId}`)
        .then((response) => {
          // Update the boardgameDescription state with the fetched description
          setBoardgameDescription(response.data.description);
        })
        .catch((error) => {
          console.error(error);
          // Handle error if needed
        });
    } else {
      // If "No boardgame" is selected, clear the boardgameDescription
      setBoardgameDescription('');
    }
  }, [bookingData.boardgameId]);

  useEffect(() => {
    // Fetch bookings data
    axios.get(API_BOOKINGS_URL)
      .then((response) => {
        setBookings(response.data);
      })
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
    const { bookingStart, bookingFinish } = bookingData;
    if (!bookingStart) return []; // Return an empty array if start time is not selected
  
    const [startHour, startMinute] = bookingStart.split(':').map(Number);
    const [finishHour, finishMinute] = bookingFinish.split(':').map(Number);
    const openingHour = 11; // Opening hour (in 24-hour format)
    const closingHour = 23; // Closing hour (in 24-hour format)
    const timeOptions = [];
  
    for (let hour = startHour; hour <= closingHour; hour++) {
      const maxMinute = (hour === startHour ? finishMinute : 45); // Use finishMinute for the maxMinute of the end time
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

  const availableTables = tables.filter((table) => {
    // Filter tables based on availability on the selected date and time range
    const isTableAvailable = !bookings.some((booking) => {
      const bookingStartTime = new Date(booking.bookingStart).getTime();
      console.log(bookingStartTime);
      const bookingEndTime = new Date(booking.bookingFinish).getTime();
      console.log(bookingEndTime);
      const selectedStartTime = new Date(
        `${bookingData.bookingDate}T${bookingData.bookingStart}`
      ).getTime();
      const selectedEndTime = new Date(
        `${bookingData.bookingDate}T${bookingData.bookingFinish}`
      ).getTime();

      return (
        booking.tableId === table.id &&
        ((selectedStartTime >= bookingStartTime && selectedStartTime < bookingEndTime) ||
          (selectedEndTime > bookingStartTime && selectedEndTime <= bookingEndTime))
      );
    });

    return isTableAvailable;
  });

  return (
    <>
    
      {/* <Navbar /> */}
      <NavbarUser/>
      <Container className="BookingForm"> 
        {currentStep === 1 && (
        
        <Form>
          <Form.Group>
            <h3>Enter the date and time of booking:</h3>
            <Form.Label>Booking Date</Form.Label>
            <Form.Control
              type="date"
              name="bookingDate"
              value={bookingData.bookingDate}
              onChange={handleInputChange}
              required
            />
          
            <Row>
              <Col xs={12} md={6}>
                <Form.Label>Select Start Time</Form.Label>
                <Form.Select 
                  name="bookingStart"
                  value={bookingData.bookingStart}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select start time</option>
                  {generateTimeOptions()}
                </Form.Select>
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>Select Finish Time</Form.Label>
                <Form.Select 
                  name="bookingFinish"
                  value={bookingData.bookingFinish}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select end time</option>
                  {generateEndTimeOptions()}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
          <br/>
            <Button size="lg" variant="primary" onClick={handleNextClick}>
              Next
            </Button>
        </Form>
          )}

        {currentStep === 2 && (
            <Form>
              <Form.Group>
                <h3>Select a Table suited for your party size</h3>
                <Form.Label>Select your Table</Form.Label>
                <Form.Select
                  name="tableId"
                  value={bookingData.tableId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table #{table.id} / Max {table.maxGuests} guests
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <br />
              <Button
                type="button"
                size="lg"
                variant="outline-secondary"
                onClick={handleBackClick}
                className="me-2"
              >
                Back
              </Button>
              <Button type="submit" size="lg" variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </Form>
          )}

          {currentStep === 3 && (
            <Form onSubmit={handleFormSubmit}>
              <Form.Group>
                <h3>Select a Boardgame</h3>
                <Form.Label>Include a Boardgame in your booking? (optional)</Form.Label>
                <Form.Select
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
                </Form.Select>
                <p className="mt-1">{boardgameDescription}</p>
              </Form.Group>
              <br/>
              <Button type="button" size="lg" variant="outline-secondary" onClick={handleBackClick} className="me-2">
                Back
              </Button>
              <Button type="submit" size="lg" variant="success">
                Create Booking
              </Button>
            </Form>
          )}

          {currentStep === 4 && (
            <div>
              <h3>Your table has been successfully booked!</h3>
              <p>Thank you for booking with us.</p>
              <Button href="/home" variant="primary" size="lg">
                Back to Homepage
              </Button>
            </div>
          )}
      </Container>
    </>
  );
}

export default BookingForm;
