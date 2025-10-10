import React from "react";
import { useSelector } from "react-redux"; // ✅ Import Redux hook

const Profile = () => {
  // ✅ Get logged-in user from Redux store
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // Handle not logged in
  if (!loggedInUser) {
    return <p>No user logged in.</p>;
  }

  // Must be shopkeeper
  if (loggedInUser.role?.rname !== "Shopkeeper") {
    return <p>User is not a shopkeeper.</p>;
  }

  // Grab shopkeeper info directly from login payload
  const shopkeeper = loggedInUser?.shopkeeper;

  if (!shopkeeper) {
    return <p>No shopkeeper details found.</p>;
  }

  return (
    <div className="card p-4">
      <h4 className="mb-3">👤 Shopkeeper Profile</h4>
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item">
          <strong>Username:</strong> {loggedInUser.uname || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Phone:</strong> {loggedInUser.phoneno || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Address:</strong> {loggedInUser.address || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Aadhar No:</strong> {loggedInUser.aadharno || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>UID:</strong> {loggedInUser.uid || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Role:</strong> {loggedInUser.role?.rname || "N/A"}
        </li>
      </ul>

      <h5>Shop Details</h5>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Shop Name:</strong> {shopkeeper.sname || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>GST No:</strong> {shopkeeper.gstno || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Shop Phone:</strong> {shopkeeper.sphoneno || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Shop Address:</strong> {shopkeeper.saddress || "N/A"}
        </li>
      </ul>
    </div>
  );
};

export default Profile;
