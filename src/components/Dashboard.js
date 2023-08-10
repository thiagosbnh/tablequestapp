import React from 'react'
import AdminNavbar from './AdminNavbar'
import Container from 'react-bootstrap/esm/Container'

function Dashboard() {
  return (
    <>
      <AdminNavbar/>
      <Container>
        <h1>Welcome, {sessionStorage.getItem("userName")}!</h1>
        <h3>You are the admin account.</h3>
      </Container>
    </>
  )
}

export default Dashboard
