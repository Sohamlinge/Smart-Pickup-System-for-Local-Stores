import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux"; // ✅ Redux hook

const apiBase = "http://localhost:8080";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [successMessages, setSuccessMessages] = useState({});

  // ✅ Get shopkeeper ID from Redux
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const sid = loggedInUser?.shopkeeper?.sid;

  useEffect(() => {
    // Wait for Redux data to load
    if (!loggedInUser) return;

    if (!sid) {
      setError("No shopkeeper ID found - please login again.");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${apiBase}/shopkeeper/orders/shopkeeper/${sid}`
        );
        const fetchedOrders = response.data.map((order) => ({
          ...order,
          newShopkeeperDatetime: order.shopkeeper_datetime || "",
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [loggedInUser, sid]);

  const handleDatetimeChange = (orderId, value) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderid === orderId
          ? { ...order, newShopkeeperDatetime: value }
          : order
      )
    );
  };

  const showSuccessMessage = (orderId, field) => {
    const key = `${orderId}-${field}`;
    setSuccessMessages((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSuccessMessages((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleUpdateDatetime = async (orderId, datetime) => {
    if (!datetime) {
      setUpdateError("Date/time cannot be empty.");
      return;
    }
    setUpdateError(null);
    setUpdatingOrderId(orderId);
    try {
      await axios.put(
        `${apiBase}/shopkeeper/orders/${orderId}/shopkeeper-datetime`,
        null,
        { params: { datetime } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.orderid === orderId
            ? { ...order, shopkeeper_datetime: datetime }
            : order
        )
      );
      showSuccessMessage(orderId, "datetime");
    } catch (err) {
      console.error("Failed to update datetime:", err);
      setUpdateError(`Failed to update datetime for order ${orderId}.`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleConfirmStatus = async (orderId) => {
    const order = orders.find((o) => o.orderid === orderId);
    if (!order || order.order_status === "Confirm") return;

    setUpdateError(null);
    setUpdatingOrderId(orderId);

    try {
      await axios.put(
        `${apiBase}/shopkeeper/orders/${orderId}/status`,
        null,
        { params: { status: "Confirm" } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.orderid === orderId ? { ...o, order_status: "Confirm" } : o
        )
      );
      showSuccessMessage(orderId, "status");
    } catch (err) {
      console.error("Failed to update status:", err);
      setUpdateError(`Failed to update status for order ${orderId}.`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Guards
  if (!loggedInUser) return <div>Loading user data...</div>;

  return (
    <div className="container mt-4">
      <Card className="p-4">
        <h2>Order Management</h2>

        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {updateError && (
          <Alert
            variant="danger"
            onClose={() => setUpdateError(null)}
            dismissible
          >
            {updateError}
          </Alert>
        )}

        {!loading && !error && (!orders || orders.length === 0) && (
          <Alert variant="info" className="text-center">
            No orders found.
          </Alert>
        )}

        {!loading && !error && orders.length > 0 && (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Total Price</th>
                <th>Customer Date</th>
                <th>Shopkeeper Date</th>
                <th>Update Shopkeeper Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isUpdating = updatingOrderId === order.orderid;
                return (
                  <tr key={order.orderid}>
                    <td>{order.orderid}</td>
                    <td>{order.customer?.uname}</td>
                    <td>{order.totalprice}</td>
                    <td>{order.customer_datetime}</td>
                    <td>{order.shopkeeper_datetime || "-"}</td>

                    <td>
                      <Form.Control
                        type="datetime-local"
                        value={
                          order.newShopkeeperDatetime
                            ? order.newShopkeeperDatetime.substring(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleDatetimeChange(order.orderid, e.target.value)
                        }
                        disabled={isUpdating}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-1"
                        onClick={() =>
                          handleUpdateDatetime(
                            order.orderid,
                            order.newShopkeeperDatetime
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      {successMessages[`${order.orderid}-datetime`] && (
                        <div style={{ color: "green", marginTop: "5px" }}>
                          Saved!
                        </div>
                      )}
                    </td>

                    <td>{order.order_status}</td>

                    <td>
                      {order.order_status !== "Confirm" ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleConfirmStatus(order.orderid)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      ) : (
                        <span
                          style={{ color: "green", fontWeight: "bold" }}
                        >
                          Confirmed
                        </span>
                      )}

                      {successMessages[`${order.orderid}-status`] && (
                        <div style={{ color: "green", marginTop: "5px" }}>
                          Saved!
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default OrderManagement;
