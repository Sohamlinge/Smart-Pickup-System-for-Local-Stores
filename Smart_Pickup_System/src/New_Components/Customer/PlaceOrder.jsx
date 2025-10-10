// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Button,
//   Alert,
//   Row,
//   Col,
//   Card,
//   Spinner,
//   Modal,
//   Table,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const apiBase = "http://localhost:8080/customer";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const loggedInUser = useSelector((state) => state.user);
//   const uid = loggedInUser?.uid;

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [orderResult, setOrderResult] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);

//   useEffect(() => {
//     const fetchCartFromDatabase = async () => {
//       if (!uid) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       try {
//         const res = await axios.get(`${apiBase}/Cart/user/${uid}`);
//         const cartItems = res.data.map((item) => ({
//           cartId: item.cartId,
//           spid: item.spid,
//           quantity: item.quantity,
//           pname: item.productName,
//           description: item.productDescription,
//           price: item.price,
//           stockStatus: item.stockStatus,
//         }));
//         setItems(cartItems);
//       } catch (error) {
//         console.error("Error fetching cart from database", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCartFromDatabase();
//   }, [uid]);

//   // Calculate total price
//   const totalPrice = items.reduce(
//     (total, item) => total + (item.price || 0) * item.quantity,
//     0
//   );

//   // Place order API call
//   const handlePlaceOrder = async () => {
//     if (!uid) return;
//     try {
//       const orderData = {
//         custId: uid,
//         items: items.map((item) => ({
//           spid: item.spid,
//           quantity: item.quantity,
//         })),
//       };

//       const response = await axios.post(`${apiBase}/Order/place`, orderData);
//       if (response.status === 200) {
//         setOrderResult(response.data);
//         setShowOrderModal(true);
//         setItems([]); // clear cart after placing order
//       }
//     } catch (error) {
//       console.error("Error placing order", error);
//       alert("Failed to place order. Please try again.");
//     }
//   };

//   const closeModal = () => {
//     setShowOrderModal(false);
//     navigate("/"); // redirect to homepage or order history page
//   };

//   if (loading) {
//     return (
//       <Container className="text-center" style={{ marginTop: "70px" }}>
//         <Spinner animation="border" />
//         <p>Loading cart...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container style={{ marginTop: "90px" }} className="mb-5">
//       <h4 className="text-center mb-4">Your Cart</h4>
//       {items.length === 0 ? (
//         <Alert variant="info" className="text-center">
//           Your cart is empty.
//         </Alert>
//       ) : (
//         <Row xs={1} md={2} lg={3} className="g-4">
//           {items.map((item) => (
//             <Col key={item.spid}>
//               <Card className="h-100 shadow-sm rounded-4 border-0">
//                 <Card.Body>
//                   <Card.Title className="fs-6 text-truncate">
//                     {item.pname}
//                   </Card.Title>
//                   <Card.Text className="text-primary fw-bold">
//                     ₹{item.price}
//                   </Card.Text>
//                   <Card.Text>{item.description}</Card.Text>
//                   <Card.Text>Quantity: {item.quantity}</Card.Text>
//                   <Card.Text>
//                     Stock Status:{" "}
//                     <span
//                       style={{
//                         color:
//                           item.stockStatus === "In Stock" ? "green" : "red",
//                       }}
//                     >
//                       {item.stockStatus}
//                     </span>
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       {items.length > 0 && (
//         <div className="text-center mt-4">
//           <h5>Total Price: ₹{totalPrice.toFixed(2)}</h5>
//           <Button variant="primary" onClick={handlePlaceOrder}>
//             Place Order
//           </Button>
//         </div>
//       )}

//       {/* Modal to show order details after placing order */}
//       <Modal show={showOrderModal} onHide={closeModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Order Placed Successfully</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {orderResult && orderResult.orders && orderResult.orders.length > 0 ? (
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Placed At</th>
//                   <th>Shopkeeper Time</th>
//                   <th>Status</th>
//                   <th>Total Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderResult.orders.map((order) => (
//                   <tr key={order.orderId}>
//                     <td>{order.orderId}</td>
//                     <td>
//                       {new Date(order.customerDatetime).toLocaleString()}
//                     </td>
//                     <td>
//                       {order.shopkeeperDatetime
//                         ? new Date(order.shopkeeperDatetime).toLocaleString()
//                         : "Pending"}
//                     </td>
//                     <td>{order.orderStatus}</td>
//                     <td>₹{order.totalPrice.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>Order details are not available.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={closeModal}>
//             OK
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default PlaceOrder;

import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Spinner,
  Modal,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const apiBase = "http://localhost:8080/customer";

const PlaceOrder = () => {
  const navigate = useNavigate();

  // ✅ Get user from Redux, fallback to localStorage
  const reduxUser = useSelector((state) => state.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = reduxUser || localUser || null;
  const uid = loggedInUser?.uid;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderResult, setOrderResult] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // 🔹 Fetch cart from backend
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

  // 🔹 Place order API call
  const handlePlaceOrder = async () => {
    if (!uid) return;
    try {
      const orderData = {
        custId: uid, // ✅ Always send custId for backend
        items: items.map((item) => ({
          spid: item.spid,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(`${apiBase}/Order/place`, orderData);
      if (response.status === 200) {
        alert(response.data.message || "Order placed successfully!");
        setOrderResult(response.data);
        setShowOrderModal(true);
        setItems([]); // clear cart after placing order
      }
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const closeModal = () => {
    setShowOrderModal(false);
    navigate("/"); // redirect after closing modal
  };

  // 🚫 Not logged in
  if (!uid) {
    return (
      <Container className="text-center" style={{ marginTop: "70px" }}>
        <Alert variant="warning">Please login to place an order.</Alert>
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

  // ✅ UI
  return (
    <Container style={{ marginTop: "90px" }} className="mb-5">
      <h4 className="text-center mb-4">Your Cart</h4>
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
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <Card.Text>
                    Stock Status:{" "}
                    <span
                      style={{
                        color:
                          item.stockStatus === "In Stock" ? "green" : "red",
                      }}
                    >
                      {item.stockStatus}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {items.length > 0 && (
        <div className="text-center mt-4">
          <h5>Total Price: ₹{totalPrice.toFixed(2)}</h5>
          <Button variant="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      )}

      {/* Modal to show order details */}
      <Modal show={showOrderModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderResult &&
          orderResult.orders &&
          orderResult.orders.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Placed At</th>
                  <th>Shopkeeper Time</th>
                  <th>Status</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderResult.orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>
                      {new Date(order.customerDatetime).toLocaleString()}
                    </td>
                    <td>
                      {order.shopkeeperDatetime
                        ? new Date(order.shopkeeperDatetime).toLocaleString()
                        : "Pending"}
                    </td>
                    <td>{order.orderStatus}</td>
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Order details are not available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlaceOrder;
