import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const apiBase = "http://localhost:8080";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get logged-in user from Redux
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const sid = loggedInUser?.shopkeeper?.sid;

  useEffect(() => {
    // Wait until Redux is populated
    if (!loggedInUser) return;

    if (!sid) {
      setLoading(false);
      setError("Shopkeeper ID missing - please login again.");
      return;
    }

    fetch(`${apiBase}/shopkeeper/orderdetails/shopkeeper/${sid}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [loggedInUser, sid]);

  if (!loggedInUser) return <div>Loading user data...</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orders || orders.length === 0) return <div>No orders found.</div>;

  return (
    <>
      <h2>Order Details</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Phone No</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(
            ({ orderdetailsid, uname, uphoneno, productname, qty, price }) => (
              <tr key={orderdetailsid}>
                <td>{orderdetailsid}</td>
                <td>{uname}</td>
                <td>{uphoneno}</td>
                <td>{productname}</td>
                <td>{qty === null ? "-" : qty}</td>
                <td>{price}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}

export default OrderDetails;