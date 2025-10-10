import React, { useState } from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:8080";

function ShopRegistrationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedUser = location.state; // User data from first page

  const [sname, setSname] = useState("");
  const [gstno, setGstno] = useState("");
  const [sphoneno, setSphoneno] = useState("");
  const [saddress, setSaddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const shopData = {
        sname,
        gstno,
        sphoneno: parseInt(sphoneno),
        saddress,
        user: { uid: savedUser.uid },
      };

      await axios.post(`${apiBase}/auth/registerShopkeeper/register`, shopData);

      alert("Shopkeeper registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Shopkeeper registration failed:", error);
      alert("Failed to register shopkeeper");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
      // style={{ marginTop: "5px" }}
    >
      <Form onSubmit={handleSubmit}>
        <Row
          className="shadow p-4 rounded bg-white align-items-center mx-auto"
          style={{ width: "90%", maxWidth: "1000px" }}
        >
          {/* Left Column (Form) */}
          <Col md={6} className="order-2 order-lg-1 d-flex flex-column">
            <h1 className="text-center fw-bold mb-5 mt-4">Shop Registration</h1>

            {/* Shop Name + GST */}
            <Row className="mb-4">
              <Col md={6} className="d-flex align-items-center mb-3 mb-md-0">
                <FaUser className="me-3" size={20} />
                <Form.Control
                  type="text"
                  placeholder="Shop Name"
                  value={sname}
                  onChange={(e) => setSname(e.target.value)}
                  required
                />
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <FaUser className="me-3" size={20} />
                <Form.Control
                  type="text"
                  placeholder="GST Number"
                  value={gstno}
                  onChange={(e) => setGstno(e.target.value)}
                  required
                />
              </Col>
            </Row>

            {/* Shop Phone + Address */}
            <Row className="mb-4">
              <Col md={6} className="d-flex align-items-center mb-3 mb-md-0">
                <FaPhone
                  className="me-3"
                  size={20}
                  style={{ transform: "rotate(90deg)" }}
                />
                <Form.Control
                  type="tel"
                  placeholder="Shop Phone Number"
                  maxLength={10}
                  value={sphoneno}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, "");
                    if (input.length <= 10) setSphoneno(input);
                  }}
                  required
                />
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-3" size={20} />
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Shop Address"
                  value={saddress}
                  onChange={(e) => setSaddress(e.target.value)}
                  required
                />
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" variant="outline-primary" size="lg" className="w-100">
                Register Shop
              </Button>
            </div>
          </Col>

          {/* Right Column (Image) */}
          <Col
            md={6}
            className="order-1 order-lg-2 d-flex align-items-center justify-content-center"
          >
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
              alt="Illustration"
              className="img-fluid"
              style={{ maxHeight: "340px" }}
            />
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default ShopRegistrationPage;
