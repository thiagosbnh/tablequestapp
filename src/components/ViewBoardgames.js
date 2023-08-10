import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import NavbarUser from './NavbarUser';

const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";

function ViewBoardgames() {
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

  // Sort the boardgames array based on title in alphabetical order
  const sortedBoardgames = boardgames.slice().sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <NavbarUser/>
      <Container>
        <div className='mb-4'><h2>Our Boardgames</h2></div>
        <Row>
          {sortedBoardgames.map((boardgame) => (
            <Col xs={12} className='mb-4' key={boardgame.id}>
              <Card>
                <Card.Body> 
                  <Card.Title style={{color:'#007BFF', fontWeight:700, fontSize:26}}>{boardgame.title}</Card.Title>
                  <Card.Text>
                    <br/>
                    {boardgame.description}
                    <br/>
                    <br/>
                    <span style={{fontWeight:600 , fontSize:18}}>Max Players: {boardgame.maxPlayers}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default ViewBoardgames;
