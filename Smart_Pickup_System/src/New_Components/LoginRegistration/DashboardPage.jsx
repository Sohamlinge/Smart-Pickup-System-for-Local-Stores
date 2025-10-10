import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login token if used (e.g. localStorage)
    localStorage.removeItem('token');
    navigate('/'); // Go back to login
  };

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Smart Pickup System </h1>
      <p>You have successfully logged in.</p>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default DashboardPage;
