import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';

const API_TABLES_URL = "http://localhost:4000/tables";

function ManageTables() {
  const [maxGuests, setMaxGuests] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(API_TABLES_URL);
      setTables(response.data);
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const handleMaxGuestsChange = (e) => {
    setMaxGuests(e.target.value);
  };

  const handleTableNumberChange = (e) => {
    setTableNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!maxGuests || !tableNumber) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Create a new table entry
      await axios.post(API_TABLES_URL, {
        maxGuests: parseInt(maxGuests),
        tableNumber: parseInt(tableNumber),
      });

      // Fetch updated tables list after successful creation
      fetchTables();

      // Clear the input fields after successful creation
      setMaxGuests('');
      setTableNumber('');
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const handleDelete = async (tableId) => {
    try {
      // Delete the table with the given ID
      await axios.delete(`${API_TABLES_URL}/${tableId}`);

      // Fetch updated tables list after successful deletion
      fetchTables();
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  return (
    <>
      <AdminNavbar/>
      <Container>
      <h3>Insert a new Table</h3>
      <Row className='mb-5'>
        <Col lg={8} xl={6}>
          <Form onSubmit={handleSubmit}>
              <Form.Label>Max Guests:</Form.Label>
              <Form.Control
                type="number"
                value={maxGuests}
                onChange={handleMaxGuestsChange}
              />
              <Form.Label>Table Number:</Form.Label>
              <Form.Control
                type="number"
                value={tableNumber}
                onChange={handleTableNumberChange}
              />
            <Button size='lg' className='mt-4' type="submit">Create Table</Button>
          </Form>
        </Col>
      </Row>
      <div className='mb-4'><h3>Manage Existing Tables</h3> </div>
      <Row>
        {tables.map((table) => (
          <Col md={6} lg={4} xl={3} className='mb-4'>
            <Card key={table.id}>
              <Card.Body>
                <Card.Title>Table Number: {table.tableNumber}</Card.Title>
                <Card.Text>Max Guests: {table.maxGuests}</Card.Text>
                <Button variant="danger" size="sm" onClick={() => handleDelete(table.id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      </Container>
    </>
  );
}

export default ManageTables;