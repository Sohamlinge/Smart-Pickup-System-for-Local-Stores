import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProfileWrapper = ({ children }) => (
  <div
    className="profile-wrapper d-flex justify-content-center align-items-center"
    style={{ minHeight: "70vh", padding: "2rem" }}
  >
    {children}
  </div>
);

const titleStyle1 = {
  textAlign: "center",
  fontWeight: "700",
  fontSize: "2.2rem",
  color: "#2c3e50",
  letterSpacing: "0.05rem",
  marginBottom: "1.5rem",
};

const ProfileCard = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  if (!loggedInUser || !loggedInUser.uname) {
    return (
      <ProfileWrapper>
        <Card
          className="profile-card shadow border-0 p-4 text-center"
          style={{ borderRadius: "12px", maxWidth: 400, width: "100%" }}
        >
          <div
            className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
            style={{ width: 72, height: 72 }}
            aria-hidden="true"
          >
            <svg
              width="48"
              height="48"
              fill="#adb5bd"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12a5.978 5.978 0 0 0 4.546-2.084C12.466 10.24 10.513 9.5 8 9.5s-4.466.74-4.546 1.416A5.978 5.978 0 0 0 8 13z"
              />
            </svg>
          </div>
          <Card.Title className="user-profile-title" style={titleStyle1}>
            Profile
          </Card.Title>
          <Card.Text className="text-muted fs-5">No user logged in.</Card.Text>
        </Card>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <Card
        className="profile-card shadow-lg border-0"
        style={{ borderRadius: "16px", maxWidth: 420, width: "100%", transition: "box-shadow 0.3s ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 123, 255, 0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
      >
        <Card.Header
          className="profile-card-header text-center"
          style={{
            backgroundColor: "#f8f9fa",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            padding: "1.5rem 1rem",
          }}
        >
          <h2 style={titleStyle1}>Profile</h2>
        </Card.Header>
        <Card.Body>
          <div
            className="text-center mb-4 p-3 rounded-circle bg-light mx-auto"
            style={{ width: 96, height: 96 }}
            aria-label="User icon"
          >
            <svg
              width="64"
              height="64"
              fill="#6c757d"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12a5.978 5.978 0 0 0 4.546-2.084C12.466 10.24 10.513 9.5 8 9.5s-4.466.74-4.546 1.416A5.978 5.978 0 0 0 8 13z"
              />
            </svg>
          </div>
          <ListGroup variant="flush" style={{ fontSize: 18, maxWidth: 360, margin: "auto" }}>
            <ListGroup.Item style={{ background: "transparent", paddingLeft: 0, paddingRight: 0 }}>
              <strong>Username:</strong>{" "}
              <span className="text-primary">{loggedInUser.uname}</span>
            </ListGroup.Item>
            <ListGroup.Item style={{ background: "transparent", paddingLeft: 0, paddingRight: 0 }}>
              <strong>Phone:</strong>{" "}
              <span className="text-secondary">{loggedInUser.phoneno}</span>
            </ListGroup.Item>
            <ListGroup.Item style={{ background: "transparent", paddingLeft: 0, paddingRight: 0 }}>
              <strong>Address:</strong>{" "}
              <span className="text-muted">{loggedInUser.address}</span>
            </ListGroup.Item>
            <ListGroup.Item style={{ background: "transparent", paddingLeft: 0, paddingRight: 0 }}>
              <strong>Aadhaar No:</strong>{" "}
              <span className="text-dark">{loggedInUser.aadharno}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </ProfileWrapper>
  );
};

export default ProfileCard;
