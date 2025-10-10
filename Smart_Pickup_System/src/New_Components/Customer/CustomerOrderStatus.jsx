import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";

const apiBase = "http://localhost:8080";

function CustomerOrderStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux + localStorage fallback
  const reduxUser = useSelector((state) => state.loggedInUser);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = reduxUser || localUser || null;
  const custId = loggedInUser?.customer?.custId ||
    loggedInUser?.custId ||
    loggedInUser?.uid ||
    null;

  useEffect(() => {
    if (!loggedInUser) {
      setLoading(false);
      return;
    }
    if (!custId) {
      setLoading(false);
      setError("Customer ID missing - please login again.");
      return;
    }
    fetch(`${apiBase}/customer/Order/by-customer/${custId}`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [loggedInUser, custId]);

  if (!custId) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Alert variant="warning">Please login to view your orders.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Spinner animation="border" />
        <p>Loading orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Alert variant="info">No orders found.</Alert>
      </Container>
    );
  }

  // Helper for colored status
  const statusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "confirm": return "success";
      case "pending": return "warning";
      case "cancel": return "danger";
      case "delivered": return "info";
      default: return "secondary";
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <h4 className="text-center mb-4">My Orders</h4>
      <Row xs={1} md={2} lg={3} className="g-4">
        {orders.map(order => (
          <Col key={order.orderId}>
            <Card className="h-100 shadow-sm rounded-4 border-0">
              <Card.Body>
                <Card.Title className="fs-6">
                  Order #{order.orderId}
                </Card.Title>
                <Card.Text>
                  <b>Total Price:</b> ₹{order.totalPrice}
                </Card.Text>
                <Card.Text>
                  <b>Shopkeeper Name:</b> {order.sname}
                </Card.Text>
                <Card.Text>
                  <b>Shopkeeper Phone:</b>{" "}
                  <a href={`tel:${order.sphoneNo}`}>{order.sphoneNo}</a>
                </Card.Text>
                <Card.Text>
                  <b>Shopkeeper Date-Time:</b>{" "}
                  {order.shopkeeperDatetime
                    ? new Date(order.shopkeeperDatetime).toLocaleString()
                    : "-"}
                </Card.Text>
                <Card.Text>
                  <b>Status: </b>
                  <Badge pill bg={statusVariant(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CustomerOrderStatus;
