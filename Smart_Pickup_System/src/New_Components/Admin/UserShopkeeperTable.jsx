import React, { useEffect, useState } from "react";
import { Table, Card, Button, Form, Pagination } from "react-bootstrap";
import axios from "axios";

const UserShopkeeperTable = () => {
  const [users, setUsers] = useState([]);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingShopkeeperId, setEditingShopkeeperId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [editedShopkeeper, setEditedShopkeeper] = useState({});

   const API_BASE = "http://localhost:8080/admin";
  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [shopkeeperPage, setShopkeeperPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchUsers();
    fetchShopkeepers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/Users`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.$values || [];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchShopkeepers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/Shopkeepers`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.$values || [];
      setShopkeepers(data);
    } catch (error) {
      console.error("Error fetching shopkeepers:", error);
    }
  };

  const handleInputChange = (e, isUser = true) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === "string" ? value.trimStart() : value;

    if (isUser) {
      setEditedUser((prev) => ({ ...prev, [name]: trimmedValue }));
    } else {
      setEditedShopkeeper((prev) => ({ ...prev, [name]: trimmedValue }));
    }
  };

  const startEditing = (item, isUser = true) => {
    if (isUser) {
      setEditingUserId(item.uid);
      setEditedUser({
        ...item,
        phoneno: item.phoneno?.toString() ?? "",
        aadharno: item.aadharno?.toString() ?? "",
      });
    } else {
      setEditingShopkeeperId(item.sid);
      setEditedShopkeeper({
        ...item,
        sphoneno: item.sphoneno?.toString() ?? "",
      });
    }
  };

  const cancelEditing = (isUser = true) => {
    if (isUser) {
      setEditingUserId(null);
      setEditedUser({});
    } else {
      setEditingShopkeeperId(null);
      setEditedShopkeeper({});
    }
  };

  const saveEdit = async (isUser = true) => {
    try {
      if (isUser) {
        await axios.put(
          `${API_BASE}/Users/${editedUser.uid}`,
          {
            ...editedUser,
            phoneno: Number(editedUser.phoneno),
            aadharno: editedUser.aadharno.toString(),
          }
        );
        setEditingUserId(null);
        fetchUsers();
      } else {
        await axios.put(
          `${API_BASE}/Shopkeepers/${editedShopkeeper.sid}`,
          {
            ...editedShopkeeper,
            sphoneno: Number(editedShopkeeper.sphoneno),
          }
        );
        setEditingShopkeeperId(null);
        fetchShopkeepers();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const deleteItem = async (id, isUser = true) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const endpoint = isUser
        ? `${API_BASE}/Users/${id}`
        : `${API_BASE}/Shopkeepers/${id}`;
      await axios.delete(endpoint);
      isUser ? fetchUsers() : fetchShopkeepers();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const paginate = (data, currentPage) => {
    if (!Array.isArray(data)) {
      console.warn("Expected array but got:", data);
      return [];
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const renderPaginationItems = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setPage(number)}
          style={{ cursor: "pointer" }}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  const paginatedUsers = paginate(users, userPage);
  const paginatedShopkeepers = paginate(shopkeepers, shopkeeperPage);

  return (
    <div className="container py-3" style={{ maxWidth: "1100px" }}>
      <h2 className="text-center mb-4 text-secondary fw-bold">
        👥 Users and Shopkeepers
      </h2>

      {/* Users Table */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-primary text-white fw-bold">Users</Card.Header>
        <Card.Body className="p-3">
          <Table striped bordered hover responsive className="align-middle text-center mb-3">
            <thead className="table-light">
              <tr>
                <th>UID</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Aadhaar No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.uid}>
                  <td>{u.uid}</td>
                  {editingUserId === u.uid ? (
                    <>
                      <td>
                        <Form.Control
                          name="uname"
                          value={editedUser.uname || ""}
                          onChange={(e) => handleInputChange(e, true)}
                          placeholder="Username"
                          type="text"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="phoneno"
                          value={editedUser.phoneno || ""}
                          onChange={(e) => handleInputChange(e, true)}
                          placeholder="Phone"
                          type="tel"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="address"
                          value={editedUser.address || ""}
                          onChange={(e) => handleInputChange(e, true)}
                          placeholder="Address"
                          type="text"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="aadharno"
                          value={editedUser.aadharno || ""}
                          onChange={(e) => handleInputChange(e, true)}
                          placeholder="Aadhaar No"
                          type="text"
                          maxLength={12}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.uname}</td>
                      <td>{u.phoneno}</td>
                      <td>{u.address}</td>
                      <td>{u.aadharno}</td>
                    </>
                  )}
                  <td>
                    {editingUserId === u.uid ? (
                      <div
                        style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
                      >
                        <Button size="sm" variant="success" onClick={() => saveEdit(true)}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => cancelEditing(true)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
                      >
                        <Button size="sm" variant="primary" onClick={() => startEditing(u, true)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => deleteItem(u.uid, true)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
              disabled={userPage === 1}
              style={{ cursor: userPage === 1 ? "not-allowed" : "pointer" }}
            />
            {renderPaginationItems(users.length, userPage, setUserPage)}
            <Pagination.Next
              onClick={() =>
                setUserPage((p) =>
                  p < Math.ceil(users.length / ITEMS_PER_PAGE) ? p + 1 : p
                )
              }
              disabled={userPage >= Math.ceil(users.length / ITEMS_PER_PAGE)}
              style={{
                cursor:
                  userPage >= Math.ceil(users.length / ITEMS_PER_PAGE)
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </Pagination>
        </Card.Body>
      </Card>

      {/* Shopkeepers Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white fw-bold">Shopkeepers</Card.Header>
        <Card.Body className="p-3">
          <Table striped bordered hover responsive className="align-middle text-center mb-3">
            <thead className="table-light">
              <tr>
                <th>SID</th>
                <th>Shop Name</th>
                <th>GST No</th>
                <th>Phone</th>
                <th>Address</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedShopkeepers.map((s) => (
                <tr key={s.sid}>
                  <td>{s.sid}</td>
                  {editingShopkeeperId === s.sid ? (
                    <>
                      <td>
                        <Form.Control
                          name="sname"
                          value={editedShopkeeper.sname || ""}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="Shop Name"
                          type="text"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="gstno"
                          value={editedShopkeeper.gstno || ""}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="GST No"
                          type="text"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="sphoneno"
                          value={editedShopkeeper.sphoneno || ""}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="Phone"
                          type="tel"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="saddress"
                          value={editedShopkeeper.saddress || ""}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="Address"
                          type="text"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="uid"
                          value={editedShopkeeper.uid || ""}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="User ID"
                          type="number"
                          min={1}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{s.sname}</td>
                      <td>{s.gstno}</td>
                      <td>{s.sphoneno}</td>
                      <td>{s.saddress}</td>
                      <td>{s.uid}</td>
                    </>
                  )}
                  <td>
                    {editingShopkeeperId === s.sid ? (
                      <div
                        style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
                      >
                        <Button size="sm" variant="success" onClick={() => saveEdit(false)}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => cancelEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
                      >
                        <Button size="sm" variant="primary" onClick={() => startEditing(s, false)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => deleteItem(s.sid, false)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedShopkeepers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No shopkeepers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setShopkeeperPage((p) => Math.max(p - 1, 1))}
              disabled={shopkeeperPage === 1}
              style={{ cursor: shopkeeperPage === 1 ? "not-allowed" : "pointer" }}
            />
            {renderPaginationItems(shopkeepers.length, shopkeeperPage, setShopkeeperPage)}
            <Pagination.Next
              onClick={() =>
                setShopkeeperPage((p) =>
                  p < Math.ceil(shopkeepers.length / ITEMS_PER_PAGE) ? p + 1 : p
                )
              }
              disabled={shopkeeperPage >= Math.ceil(shopkeepers.length / ITEMS_PER_PAGE)}
              style={{
                cursor:
                  shopkeeperPage >= Math.ceil(shopkeepers.length / ITEMS_PER_PAGE)
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </Pagination>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserShopkeeperTable;
