import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Manage Boardgames</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <label>Max Players:</label>
          <input
            type="number"
            value={maxPlayers}
            onChange={handleMaxPlayersChange}
          />
        </div>
        <button type="submit">Create Boardgame</button>
      </form>
      <div>
        <h2>Existing Boardgames</h2>
        {boardgames.map((boardgame) => (
          <div key={boardgame.id}>
            <p>Title: {boardgame.title}</p>
            <p>Description: {boardgame.description}</p>
            <p>Max Players: {boardgame.maxPlayers}</p>
            <button onClick={() => handleDelete(boardgame.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageGames;