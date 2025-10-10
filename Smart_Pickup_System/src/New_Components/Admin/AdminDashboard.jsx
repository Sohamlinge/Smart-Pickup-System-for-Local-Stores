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
} from "react-icons/fa";

import "./AdminDashboard.css";
import ProfileCard from "./ProfileCard";
import CategoryMaster from "./CategoryMaster";
import ProductMaster from "./ProductMaster";
import UserShopkeeperTable from "./UserShopkeeperTable";
import ReportCharts from "./ReportCharts";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("profile");
  const [showSidebar, setShowSidebar] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <ProfileCard />;
      case "categoryMaster":
        return <CategoryMaster />;
      case "productMaster":
        return <ProductMaster />;
      case "userShopkeeper":
        return <UserShopkeeperTable />;
      case "reports":
        return <ReportCharts />;
      default:
        return <div>Select an option</div>;
    }
  };

  const SidebarContent = (
    <div className="sidebar-menu">
      <h5 className="sidebar-title mb-4">Admin Menu</h5>
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
            setActiveView("categoryMaster");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "categoryMaster" ? "active" : ""
          }`}
        >
          <FaPlus className="me-2" /> Category Master
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            setActiveView("productMaster");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "productMaster" ? "active" : ""
          }`}
        >
          <FaPlus className="me-2" /> Product Master
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            setActiveView("userShopkeeper");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "userShopkeeper" ? "active" : ""
          }`}
        >
          <FaUsers className="me-2" /> Users & Shopkeepers
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            setActiveView("reports");
            setShowSidebar(false);
          }}
          className={`nav-link-custom ${
            activeView === "reports" ? "active" : ""
          }`}
        >
          <FaChartBar className="me-2" /> Reports
        </Nav.Link>
        <Nav.Link as={Link} to="/" className="nav-link-custom mt-3">
          <FaSignOutAlt className="me-2" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );

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

export default AdminDashboard;
