import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const apiBase = "http://localhost:8080/customer";

const AddToCart = () => {
  const navigate = useNavigate();

  // ✅ Get user from Redux, fallback to localStorage
  const reduxUser = useSelector((state) => state.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = reduxUser || localUser || null;
  const uid = loggedInUser?.uid;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart items from backend
  useEffect(() => {
    const fetchCartFromDatabase = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/Cart/user/${uid}`);
        const cartItems = res.data.map((item) => ({
          cartId: item.cartId,
          spid: item.spid,
          quantity: item.quantity,
          pname: item.productName,
          description: item.productDescription,
          price: item.price,
          stockStatus: item.stockStatus,
        }));
        setItems(cartItems);
      } catch (error) {
        console.error("Error fetching cart from database", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartFromDatabase();
  }, [uid]);

  // 🔹 Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  // 🔹 Update quantity for a cart item
  const handleUpdateQuantity = async (spid, newQuantity) => {
    if (newQuantity < 0) return;
    try {
      const currentItem = items.find((item) => item.spid === spid);
      if (!currentItem) return;
      const currentQty = currentItem.quantity;

      if (newQuantity < currentQty) {
        const reduceBy = currentQty - newQuantity;
        if (reduceBy <= 0) return;
        await axios.post(`${apiBase}/Cart/reduce`, {
          uid,
          spid,
          quantity: reduceBy,
        });
        if (newQuantity === 0) {
          setItems(items.filter((item) => item.spid !== spid));
        } else {
          setItems(
            items.map((item) =>
              item.spid === spid ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      } else if (newQuantity > currentQty) {
        const increaseBy = newQuantity - currentQty;
        await axios.post(`${apiBase}/Cart/add/by-spid`, {
          uid,
          spid,
          quantity: increaseBy,
        });
        setItems(
          items.map((item) =>
            item.spid === spid ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  // 🔹 Remove item from cart
  const handleRemoveFromCart = async (spid) => {
    try {
      const itemToRemove = items.find((item) => item.spid === spid);
      if (!itemToRemove) return;
      await axios.delete(`${apiBase}/Cart/remove/${itemToRemove.cartId}`);
      setItems(items.filter((item) => item.spid !== spid));
    } catch (error) {
      console.error("Error removing cart item", error);
    }
  };

  // 🔹 Place order
  const handlePlaceOrder = async () => {
    if (!uid) return;
    try {
      const orderData = {
        uid,
        items: items.map((item) => ({
          spid: item.spid,
          quantity: item.quantity,
        })),
      };
      const response = await axios.post(`${apiBase}/Cart/place`, orderData);
      if (response.status === 200) {
        alert("Order placed successfully!");
        setItems([]);
        navigate("/");
      }
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // 🚫 Show not logged in state
  if (!uid) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Alert variant="warning">Please login to view your cart.</Alert>
      </Container>
    );
  }

  // ⏳ Loading state
  if (loading) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Spinner animation="border" />
        <p>Loading cart...</p>
      </Container>
    );
  }

  // ✅ Main cart UI
  return (
    <Container style={{ marginTop: "100px" }}>
      <h4 className="text-center mb-4">Shopping Cart</h4>
      {items.length === 0 ? (
        <Alert variant="info" className="text-center">
          Your cart is empty.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {items.map((item) => (
            <Col key={item.spid}>
              <Card className="h-100 shadow-sm rounded-4 border-0">
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate">
                    {item.pname}
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    ₹{item.price}
                  </Card.Text>
                  <div className="mb-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.spid, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>{" "}
                    <span className="fw-bold">{item.quantity}</span>{" "}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.spid, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.spid)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {items.length > 0 && (
        <div className="text-center mt-4">
          <h5>Total: ₹{totalPrice}</h5>
          <Button
            variant="primary"
            onClick={() =>
              navigate("/placeorder", { state: { cartItems: items } })
            }
          >
            Place Order
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AddToCart;
