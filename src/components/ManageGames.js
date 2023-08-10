import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar'
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/esm/Row'; 
import Col from 'react-bootstrap/esm/Col';


const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";

function ManageGames() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [boardgames, setBoardgames] = useState([]);

  useEffect(() => {
    fetchBoardgames();
  }, []);

  const fetchBoardgames = async () => {
    try {
      const response = await axios.get(API_BOARDGAMES_URL);
      setBoardgames(response.data);
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMaxPlayersChange = (e) => {
    setMaxPlayers(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!title || !description || !maxPlayers) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Create a new boardgame entry
      await axios.post(API_BOARDGAMES_URL, {
        title,
        description,
        maxPlayers: parseInt(maxPlayers),
      });

      // Fetch updated boardgames list after successful creation
      fetchBoardgames();

      // Clear the input fields after successful creation
      setTitle('');
      setDescription('');
      setMaxPlayers('');
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const handleDelete = async (boardgameId) => {
    try {
      // Delete the boardgame with the given ID
      await axios.delete(`${API_BOARDGAMES_URL}/${boardgameId}`);

      // Fetch updated boardgames list after successful deletion
      fetchBoardgames();
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  return (
    <>
      <AdminNavbar/>
      <Container>
      <h3>Insert a new Boardgame</h3>
      <Row className='mb-5'>
        <Col lg={8} xl={6}>
          <Form onSubmit={handleSubmit}>
          <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={handleTitleChange}
            />

            <Form.Label>Description:</Form.Label>
            <Form.Control as="textarea" rows={3}
              value={description}
              onChange={handleDescriptionChange}
            />
            <Form.Label>Max Players:</Form.Label>
            <Form.Control
              type="number"
              value={maxPlayers}
              onChange={handleMaxPlayersChange}
            />
          <Button size="lg" type="submit" className='mt-4'>Create Boardgame</Button>
          </Form>
        </Col>
      </Row>
      
      <div className='mb-4'><h3>Manage Existing Boardgames</h3></div>
        
      <Row>
        {boardgames.map((boardgame) => (
          <Col lg={6} className='mb-4'>
            <Card key={boardgame.id}>
            <Card.Body> 
            <Card.Title>Title: {boardgame.title}</Card.Title>
              <Card.Text>
                Description: {boardgame.description}
                <br/>
                Max Players: {boardgame.maxPlayers}
              </Card.Text>
              <Button variant='danger' size='sm' onClick={() => handleDelete(boardgame.id)}>Delete</Button>
            </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </Container>
    </>
  );
}

export default ManageGames;