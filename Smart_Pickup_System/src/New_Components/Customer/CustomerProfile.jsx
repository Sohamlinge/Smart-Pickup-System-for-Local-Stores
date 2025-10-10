import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

const apiBase = "http://localhost:8080";

const CustomerProfile = () => {
  // Get logged-in user's info from Redux store, fallback to localStorage
  const reduxUser = useSelector((state) => state.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = reduxUser || localUser || null;
  const userId = loggedInUser?.uid;

  // Use all user fields
  const [profile, setProfile] = useState(
    loggedInUser
      ? {
          uid: loggedInUser.uid || "",
          uname: loggedInUser.uname || "",
          password: loggedInUser.password || "",
          phoneno: loggedInUser.phoneno || "",
          address: loggedInUser.address || "",
          aadharno: loggedInUser.aadharno || "",
        }
      : {
          uid: "",
          uname: "",
          password: "",
          phoneno: "",
          address: "",
          aadharno: "",
        }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile from backend if logged in
  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${apiBase}/customer/CustomerProfile/${userId}`
        );
        setProfile(res.data);
      } catch {
        setError("Failed to load profile data.");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiBase}/customer/CustomerProfile/${userId}`, profile);
      setSuccess("Profile updated successfully!");
      setError(null);
      setIsEditing(false);
    } catch {
      setError("Failed to update profile.");
    }
  };

  // If not logged in
  if (!userId) {
    return (
      <Container style={{ marginTop: "90px" }}>
        <Alert variant="warning">
          Please login to view your customer profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "90px" }} className="mb-5">
      <h4 className="text-center mb-4">Customer Profile</h4>
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="uname"
                  value={profile.uname}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneno"
                  value={profile.phoneno}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadharno"
                  value={profile.aadharno}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default CustomerProfile;
