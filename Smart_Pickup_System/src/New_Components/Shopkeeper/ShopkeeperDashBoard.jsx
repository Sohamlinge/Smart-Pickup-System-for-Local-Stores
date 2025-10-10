import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, Button } from "react-bootstrap";
import {
  FaUserCircle,
  FaPlus,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaShoppingCart,
  FaClipboardList,
  FaBoxOpen,
  FaReceipt,
} from "react-icons/fa";

import "./ShopkeeperDashBoard.css";
import Profile from "./Profile";
import ProductManager from "./ProductManager";
import OrderManagement from "./OrderManager"; // import your new component
import OrderDetails from "./OrderDetails";

const ShopkeeperDashboard = () => {
  const [activeView, setActiveView] = useState("profile");
  const [showSidebar, setShowSidebar] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <Profile />;
      case "productManager":
        return <ProductManager />;
      case "orderdetails":
        return <OrderDetails />;
      case "orderManagement":
        return <OrderManagement />;
      default:
        return <div>Select an option</div>;
    }
  };

  const SidebarContent = (
    <div className="sidebar-menu">
      <h5 className="sidebar-title mb-4">Shopkeeper Menu</h5>
      <Nav className="flex-column">
        <Nav.Link
          onClick={() => {
            setActiveView("profile");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "profile" ? "active" : ""
          }`}
        >
          <FaUserCircle className="me-2" /> Profile
        </Nav.Link>

        <Nav.Link
          onClick={() => {
            setActiveView("productManager");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "productManager" ? "active" : ""
          }`}
        >
          <FaClipboardList className="me-2" /> Product Manager
        </Nav.Link>

        <Nav.Link
          onClick={() => {
            setActiveView("orderdetails");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "orderdetails" ? "active" : ""
          }`}
        >
          <FaBoxOpen className="me-2" /> Order Details
        </Nav.Link>

        <Nav.Link
          onClick={() => {
            setActiveView("orderManagement");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "orderManagement" ? "active" : ""
          }`}
        >
          <FaReceipt className="me-2" /> Order Manager
        </Nav.Link>

        <Nav.Link as={Link} to="/" className="nav-link-custom mt-3">
          <FaSignOutAlt className="me-2" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );

  // ... rest of your component (Navbar, Offcanvas, rendering sidebar and content) remains unchanged

  return (
    <div className="admin-dashboard">
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container fluid className="d-flex align-items-center">
          <Button
            variant="outline-light"
            className="d-md-none me-2"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </Button>
          <Navbar.Brand className="fw-bold text-white">
            SMART PICKUP SYSTEM
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="d-flex" style={{ marginTop: "70px" }}>
        {/* Desktop Sidebar */}
        <div className="sidebar d-none d-md-block">{SidebarContent}</div>

        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          responsive="md"
          placement="start"
          className="offcanvas-custom"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Admin Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{SidebarContent}</Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className="content-wrapper">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
