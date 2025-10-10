import React, { useEffect, useState } from "react";
import axios from "axios";

const Message = ({ type, text, onClose }) => {
  // type: 'success' or 'error'
  return (
    <div
      className={`toast-message toast-${type} animate-slide-in`}
      role="alert"
      onAnimationEnd={() => {
        if (onClose) onClose();
      }}
      onClick={onClose}
      title="Click to dismiss"
      style={{ userSelect: "none" }}
    >
      {text}
    </div>
  );
};

const titleStyle1 = {
  textAlign: "center",
  marginBottom: "3rem",
  fontWeight: "700",
  fontSize: "2rem",
};

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [message, setMessage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const API_BASE = "http://localhost:8080/admin";

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showMessage("error", "Failed to load categories.");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/SubCategories`);
      setSubCategories(res.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      showMessage("error", "Failed to load subcategories.");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showMessage("error", "Category name cannot be empty.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/Categories`, { catName: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
      showMessage("success", "Category added successfully.");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error adding category:", err);
      showMessage("error", "Error adding category.");
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategoryId) {
      showMessage("error", "Please select a category and enter a subcategory name.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/SubCategories`, {
        subCatName: newSubCategoryName,
        catId: parseInt(selectedCategoryId),
      });
      setNewSubCategoryName("");
      setSelectedCategoryId("");
      fetchSubCategories();
      showMessage("success", "Subcategory added successfully.");
    } catch (err) {
      console.error("Error adding subcategory:", err);
      showMessage("error", "Error adding subcategory.");
    }
  };

  // Combine categories and their subcategories
  const categoriesWithSubs = categories.map((cat) => ({
    ...cat,
    subCategories: subCategories.filter((sub) => sub.catId === cat.catId),
  }));

  // Pagination calculations
  const totalPages = Math.ceil(categoriesWithSubs.length / ITEMS_PER_PAGE);
  const indexOfLastCategory = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - ITEMS_PER_PAGE;
  const currentCategories = categoriesWithSubs.slice(indexOfFirstCategory, indexOfLastCategory);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mt-5">
      <h2 style={titleStyle1}>Category Management</h2>

      {/* Notification Message */}
      {message && (
        <Message type={message.type} text={message.text} onClose={() => setMessage(null)} />
      )}

      {/* Add Category */}
      <div className="mb-5 p-4 border rounded shadow-sm bg-light">
        <h4 className="mb-3 text-secondary">Add Category</h4>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="form-control mb-3 shadow-input"
        />
        <button className="btn btn-primary btn-lg btn-hover" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      {/* Add Subcategory */}
      <div className="mb-5 p-4 border rounded shadow-sm bg-light">
        <h4 className="mb-3 text-secondary">Add Subcategory</h4>
        <select
          className="form-control mb-3 shadow-input"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.catId} value={cat.catId}>
              {cat.catName}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
          placeholder="Subcategory Name"
          className="form-control mb-3 shadow-input"
        />
        <button className="btn btn-success btn-lg btn-hover" onClick={handleAddSubCategory}>
          Add Subcategory
        </button>
      </div>

      <hr />

      {/* View Category + Subcategories */}
      <div className="mb-5">
        <h3 className="text-primary mb-4">Categories & Subcategories</h3>
        <table className="table table-striped table-hover table-bordered shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Subcategories</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat) => (
              <tr key={cat.catId}>
                <td>{cat.catId}</td>
                <td>{cat.catName}</td>
                <td>
                  {cat.subCategories.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {cat.subCategories.map((sub) => (
                        <li key={sub.subCatId} className="text-success">
                          &bull; {sub.subCatName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em className="text-muted">No subcategories</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 pagination-controls">
            <button
              className="btn btn-outline-primary btn-hover me-3"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ minWidth: 80 }}
            >
              &laquo; Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                className={`btn mx-1 btn-hover ${
                  currentPage === idx + 1 ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
                style={{ minWidth: 40, fontWeight: 600, borderRadius: 6 }}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-primary btn-hover ms-3"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ minWidth: 80 }}
            >
              Next &raquo;
            </button>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        .toast-message {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 280px;
          max-width: 320px;
          padding: 15px 25px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          z-index: 1100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          cursor: pointer;
          user-select: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toast-success {
          background-color: #28a745;
        }
        .toast-error {
          background-color: #dc3545;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease forwards;
        }
        .btn-hover:hover {
          filter: brightness(110%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        .shadow-input {
          box-shadow: inset 0 1px 5px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
          border-radius: 4px;
          border: 1px solid #ced4da;
        }
        .shadow-input:focus {
          box-shadow: 0 0 8px #007bff;
          outline: none;
          border-color: #007bff;
        }
        .pagination-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          filter: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryMaster;
