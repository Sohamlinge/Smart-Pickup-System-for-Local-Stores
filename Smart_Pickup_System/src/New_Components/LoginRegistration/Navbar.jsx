// SPSNavbar.js
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaSignOutAlt, FaListUl, FaUserCircle, FaStore } from "react-icons/fa";

const SPSNavbar = ({ cartItems }) => {
  const navigate = useNavigate();
  const [rid, setRid] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loggedInUser = useSelector((store) => store.loggedInUser);

  useEffect(() => {
    const storedRid = localStorage.getItem("rid");
    const token = localStorage.getItem("token");
    if (storedRid && token) {
      setRid(parseInt(storedRid, 10));
      setIsLoggedIn(true);
    }
  }, []);

  const handleGoToCart = () => {
    navigate("/addtocart", { state: { cartItems } });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="top"
      className="shadow-sm px-4 py-3 border-bottom"
    >
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-primary d-flex align-items-center"
          style={{ fontSize: "1.2rem" }}
        >
          <FaStore className="me-2" size={22} />
          SMART PICKUP SYSTEM
        </Navbar.Brand>

        {loggedInUser?.role?.rid === 3 && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              {/* Nav Links */}
              <Nav className="align-items-center me-3">
                <Nav.Link as={Link} to="/shoplist" className="fw-semibold">
                  <FaStore className="me-1" /> Home
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="fw-semibold">
                  <FaUserCircle className="me-1" /> Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/customerorderstatus" className="fw-semibold">
                  <FaListUl className="me-1" /> My Orders
                </Nav.Link>
              </Nav>

              {/* Cart Button */}
              <Button
                variant="primary"
                onClick={handleGoToCart}
                className="me-2 d-flex align-items-center position-relative"
                style={{
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontWeight: "500",
                }}
              >
                <FaShoppingCart size={16} className="me-2" />
                Cart
                {cartItems?.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>

              {/* Logout Button */}
              <Button
                as={Link}
                to="/"
                variant="outline-danger"
                className="ms-1 d-flex align-items-center"
                style={{ borderRadius: "20px", padding: "6px 14px", fontWeight: "500" }}
                onClick={handleLogout}
              >
                <FaSignOutAlt size={16} className="me-2" />
                Logout
              </Button>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default SPSNavbar;
