import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

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
    <div>
      <AdminNavbar/>
      <h1>Manage Tables</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Max Guests:</label>
          <input
            type="number"
            value={maxGuests}
            onChange={handleMaxGuestsChange}
          />
        </div>
        <div>
          <label>Table Number:</label>
          <input
            type="number"
            value={tableNumber}
            onChange={handleTableNumberChange}
          />
        </div>
        <button type="submit">Create Table</button>
      </form>
      <div>
        <h2>Existing Tables</h2>
        {tables.map((table) => (
          <div key={table.id}>
            <p>Table Number: {table.tableNumber}</p>
            <p>Max Guests: {table.maxGuests}</p>
            <button onClick={() => handleDelete(table.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageTables;