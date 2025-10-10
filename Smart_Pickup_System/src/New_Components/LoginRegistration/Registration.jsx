import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  FaUser,
  FaLock,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:8080";

function RegistrationPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [aadharno, setAadharno] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiBase}/auth/role/all`)
      .then((response) => {
        const filteredRoles = response.data.filter(
          (role) => role.rname.toLowerCase() !== "admin"
        );
        setRoles(filteredRoles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      uname,
      password,
      phoneno: parseInt(phoneno),
      aadharno,
      address,
      role: { rid: parseInt(selectedRole) },
    };

    try {
      const res = await axios.post(`${apiBase}/auth/user/register`, user);
      const savedUser = res.data;

      if (
        roles.find((r) => r.rid == selectedRole)?.rname?.toLowerCase() ===
        "shopkeeper"
      ) {
        navigate("/shop-registration", { state: savedUser });
      } else {
        alert("Customer registered successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
<Container
  fluid
  className="vh-100 d-flex align-items-center justify-content-center"
  style={{ marginTop: "35px" }}
>
  <Form onSubmit={handleSubmit}>
    <Row
      className="shadow p-4 rounded bg-white align-items-center mx-auto"
      style={{ width: "90%", maxWidth: "1000px" }}
    >
      {/* Left Column (Form) */}
      <Col
        md={6}
        className="order-2 order-lg-1 d-flex flex-column"
      >
        <h1 className="text-center fw-bold mb-5 mt-4 w-100">Sign up</h1>

        {/* Role Selection */}
        <div className="d-flex flex-row align-items-center mb-4 w-100">
          <FaUser className="me-3" size={20} />
          <Form.Group className="mb-0 w-100">
            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.rid} value={role.rid}>
                  {role.rname}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Name and Password */}
        <Row className="mb-4 w-100">
          <Col md={6} className="d-flex align-items-center mb-3 mb-md-0">
            <FaUser className="me-3" size={20} />
            <Form.Group className="mb-3 w-100">
              <Form.Control
                type="text"
                placeholder="Your UserName"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <FaLock className="me-3" size={20} />
            <Form.Group className="mb-3 w-100">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Phone and Aadhar */}
        <Row className="mb-4 w-100">
          <Col md={6} className="d-flex align-items-center mb-3 mb-md-0">
            <FaPhone
              className="me-3"
              size={20}
              style={{ transform: "rotate(90deg)" }}
            />
            <Form.Group className="mb-3 w-100">
              <Form.Control
                type="tel"
                placeholder="Your Phone Number"
                maxLength={10}
                value={phoneno}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "");
                  if (input.length <= 10) setPhoneno(input);
                }}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <FaIdCard className="me-3" size={20} />
            <Form.Group className="mb-3 w-100">
              <Form.Control
                type="text"
                placeholder="Aadhar Card Number (xxxx xxxx xxxx)"
                maxLength={14}
                value={aadharno}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");
                  if (input.length > 12) input = input.slice(0, 12);
                  let formatted = input.replace(
                    /(\d{4})(\d{4})(\d{0,4})/,
                    (match, p1, p2, p3) => {
                      return `${p1} ${p2} ${p3}`.trim();
                    }
                  );
                  setAadharno(formatted);
                }}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Address */}
        <div className="d-flex align-items-start mb-4 w-100">
          <FaMapMarkerAlt className="me-3 mt-2" size={20} />
          <Form.Group className="mb-3 w-100">
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            className="mb-2"
          >
            {roles.find((r) => r.rid == selectedRole)?.rname?.toLowerCase() ===
            "shopkeeper"
              ? "Next"
              : "Register"}
          </Button>
          <div>
            <Link to="/">Already have an account?</Link>
          </div>
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

export default RegistrationPage;
