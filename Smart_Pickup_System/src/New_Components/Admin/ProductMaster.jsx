import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Form, Button, Table } from "react-bootstrap";

const Message = ({ type, text, onClose }) => (
  <div
    className={`toast-message toast-${type} animate-slide-in`}
    role="alert"
    onAnimationEnd={() => {
      if (onClose) onClose();
    }}
    onClick={onClose}
    title="Click to dismiss"
  >
    {text}
  </div>
);

const ProductManager = () => {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validated, setValidated] = useState(false);
  const fileInputRef = useRef();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Message state
  const [message, setMessage] = useState(null);

  const API_BASE = "http://localhost:8080/admin";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/Products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showMessage("error", "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/SubCategories`);
      const subcats = Array.isArray(res.data) ? res.data : res.data.data || [];
      setSubcategories(subcats);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      showMessage("error", "Failed to load subcategories.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
  }, []);

  // if totalPages decreases (like after deletion), clamp page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!imageFile) {
      showMessage("error", "Please select an image file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pname", pName);
      formData.append("description", description);
      formData.append("subCatId", Number(subCatId));
      formData.append("imageFileName", imageFile.name);
      formData.append("imageFile", imageFile);

      await axios.post(`${API_BASE}/Products/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("success", "Product uploaded successfully!");
      setPName("");
      setDescription("");
      setSubCatId("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setValidated(false);

      fetchProducts();
      setCurrentPage(1);
    } catch (error) {
      console.error("Upload failed:", error);
      showMessage("error", "Upload failed. Please check console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Pagination slice
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Compact pagination helper
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: "3rem", fontWeight: 700 }}>
        Product Management
      </h2>

      {message && (
        <Message type={message.type} text={message.text} onClose={() => setMessage(null)} />
      )}

      <div className="container">
        {/* Upload Form */}
        <Card className="p-4 shadow-sm rounded bg-light mb-5">
          <h4 className="mb-4 text-secondary">Upload New Product</h4>
          <Form noValidate validated={validated} onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                required
                value={subCatId}
                onChange={(e) => setSubCatId(e.target.value)}
                disabled={uploading}
                className="shadow-input"
              >
                <option value="">-- Select Subcategory --</option>
                {subcategories.map((sub) => (
                  <option
                    key={sub.subCatId || sub.subcatid}
                    value={sub.subCatId || sub.subcatid}
                  >
                    {sub.subCatName || sub.subcatname}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a subcategory.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter product name"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                disabled={uploading}
                className="shadow-input"
              />
              <Form.Control.Feedback type="invalid">
                Please enter the product name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={2}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                className="shadow-input"
              />
              <Form.Control.Feedback type="invalid">
                Please enter the product description.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                required
                type="file"
                accept="image/*"
                disabled={uploading}
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files[0])}
                className="shadow-input"
              />
              <Form.Control.Feedback type="invalid">
                Please select a product image.
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="mt-3 btn-upload" type="submit" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </Form>
        </Card>

        {/* Product Table */}
        <Card className="p-4 shadow-sm rounded bg-light">
          <h4 className="mb-3 text-secondary">Product List</h4>
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            <>
              <Table bordered hover responsive className="mt-3 shadow-sm">
                <thead className="table-primary">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Subcategory</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((prod) => (
                      <tr key={prod.pid}>
                        <td>
                          <img
                            src={prod.image}
                            alt={prod.pname || "Product"}
                            style={{ width: 60, height: 60, objectFit: "cover" }}
                          />
                        </td>
                        <td>{prod.pname}</td>
                        <td>{prod.description}</td>
                        <td>
                          {prod.subCategory?.subCatName ||
                            prod.subCategory?.subcatname ||
                            "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Compact Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <Button
                    variant="outline-primary"
                    className="me-2 btn-hover"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    « First
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="me-3 btn-hover"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ‹ Prev
                  </Button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="mx-2">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline-primary"}
                        className="mx-1 btn-hover"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline-primary"
                    className="ms-3 btn-hover"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next ›
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="ms-2 btn-hover"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last »
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Styles */}
      <style>{`
        .toast-message { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px; color: white; font-weight: 600; z-index: 1100; box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: pointer; }
        .toast-success { background-color: #28a745; }
        .toast-error { background-color: #dc3545; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%);} to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.4s ease forwards; }
        .btn-upload { background-color: #007bff; border: none; color: white; font-weight: 600; padding: 0.5rem 1.5rem; border-radius: 6px; }
        .btn-hover:hover { filter: brightness(110%); }
        .shadow-input { box-shadow: inset 0 1px 6px rgba(0,0,0,0.1); border-radius: 4px; }
      `}</style>
    </>
  );
};

export default ProductManager;
