import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Table, Button, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux"; // ✅ Import Redux to get logged-in user

const apiBase = "http://localhost:8080";

const ProductManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState("");
  const [products, setProducts] = useState([]);

  const [priceStockMap, setPriceStockMap] = useState({});
  const [editedPriceStatus, setEditedPriceStatus] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Get logged-in shopkeeper sid from Redux
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const sid = loggedInUser?.shopkeeper?.sid;

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    setError(null);
    try {
      const res = await axios.get(`${apiBase}/shopkeeper/category/getall`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories by category ID
  const fetchSubcategories = async (catid) => {
    if (!catid) {
      setSubcategories([]);
      return;
    }
    setLoadingSubcategories(true);
    setError(null);
    try {
      const res = await axios.get(
        `${apiBase}/shopkeeper/subcategory/bycatid/${catid}`
      );
      setSubcategories(res.data);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setError("Failed to fetch subcategories");
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Fetch products by subcategory ID
  const fetchProducts = async (subcatid) => {
    if (!subcatid) {
      setProducts([]);
      setPriceStockMap({});
      setEditedPriceStatus({});
      return;
    }
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await axios.get(
        `${apiBase}/shopkeeper/products/bysubcategory/${subcatid}`
      );
      setProducts(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to fetch products");
      setProducts([]);
      setPriceStockMap({});
      setEditedPriceStatus({});
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch price and stock info for given products & sid
  const fetchPriceStockForProducts = async (productsToFetch, sid) => {
    if (!sid || productsToFetch.length === 0) {
      setPriceStockMap({});
      setEditedPriceStatus({});
      return;
    }
    setLoadingPrices(true);
    setError(null);
    try {
      const requests = productsToFetch.map((prod) =>
        axios
          .get(
            `${apiBase}/shopkeeper/productshopkeeper/shopkeeper/${sid}/product/${prod.pid}`
          )
          .then((resp) => ({
            pid: prod.pid,
            priceStock:
              resp.data && resp.data.length > 0 ? resp.data[0] : null,
          }))
          .catch(() => ({
            pid: prod.pid,
            priceStock: null,
          }))
      );

      const responses = await Promise.all(requests);
      const newMap = {};
      const editedMap = {};

      responses.forEach(({ pid, priceStock }) => {
        newMap[pid] = priceStock;
        editedMap[pid] = {
          price: priceStock?.price?.toString() ?? "",
          stockStatus: priceStock?.stockStatus ?? "",
        };
      });

      setPriceStockMap(newMap);
      setEditedPriceStatus(editedMap);
    } catch (err) {
      console.error("Failed to fetch price and stock info:", err);
      setError("Failed to fetch price and stock info");
      setPriceStockMap({});
      setEditedPriceStatus({});
    } finally {
      setLoadingPrices(false);
    }
  };

  // Initial categories load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    setSelectedSubCatId("");
    setProducts([]);
    setPriceStockMap({});
    setEditedPriceStatus({});
    fetchSubcategories(selectedCatId);
  }, [selectedCatId]);

  // Load products when subcategory changes
  useEffect(() => {
    fetchProducts(selectedSubCatId);
  }, [selectedSubCatId]);

  // Load price/stock info for visible products when products/page changes
  useEffect(() => {
    if (sid) {
      const indexOfLastProduct = currentPage * itemsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
      const currentPageProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
      fetchPriceStockForProducts(currentPageProducts, sid);
      setSaveStatus({});
    }
  }, [products, currentPage, sid]);

  // Pagination indexes
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Handle input changes
  const handleInputChange = (pid, field, value) => {
    setEditedPriceStatus((prev) => ({
      ...prev,
      [pid]: {
        ...prev[pid],
        [field]: value,
      },
    }));
    setSaveStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[pid];
      return newStatus;
    });
  };

  // Handle save button click
  const handleSave = async (pid) => {
    if (!sid) {
      setError("Shopkeeper ID missing - please login again.");
      return;
    }
    const edited = editedPriceStatus[pid];
    if (!edited || edited.price === "" || edited.stockStatus === "") {
      setSaveStatus((prev) => ({
        ...prev,
        [pid]: { error: "Price and Stock Status are required." },
      }));
      return;
    }
    const priceValue = Number(edited.price);
    if (isNaN(priceValue) || priceValue < 0) {
      setSaveStatus((prev) => ({
        ...prev,
        [pid]: { error: "Price must be a non-negative number." },
      }));
      return;
    }

    setSaveStatus((prev) => ({ ...prev, [pid]: { loading: true } }));

    try {
      await axios.post(
        `${apiBase}/shopkeeper/productshopkeeper/shopkeeper/${sid}/product/${pid}`,
        {
          price: priceValue,
          stockStatus: edited.stockStatus.trim(),
        }
      );
      setSaveStatus((prev) => ({
        ...prev,
        [pid]: { success: "Saved successfully." },
      }));
      setPriceStockMap((prev) => ({
        ...prev,
        [pid]: { price: priceValue, stockStatus: edited.stockStatus.trim() },
      }));
    } catch (err) {
      console.error("Failed to save:", err);
      setSaveStatus((prev) => ({
        ...prev,
        [pid]: { error: "Failed to save. Please try again." },
      }));
    }
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 mb-4">
        <h4>Select Category and Subcategory</h4>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            disabled={loadingCategories}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.catid || cat.cid} value={cat.catid || cat.cid}>
                {cat.catname || cat.categoryName}
              </option>
            ))}
          </Form.Select>
          {loadingCategories && <small>Loading categories...</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Select
            value={selectedSubCatId}
            onChange={(e) => setSelectedSubCatId(e.target.value)}
            disabled={!selectedCatId || loadingSubcategories}
          >
            <option value="">-- Select Subcategory --</option>
            {subcategories.map((sub) => (
              <option
                key={sub.subcatid || sub.subCatId}
                value={sub.subcatid || sub.subCatId}
              >
                {sub.subcatname || sub.subCatName}
              </option>
            ))}
          </Form.Select>
          {loadingSubcategories && <small>Loading subcategories...</small>}
        </Form.Group>
      </Card>

      <Card className="p-4">
        <h4>Products List</h4>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : currentProducts.length === 0 ? (
          <p>
            No products found{selectedSubCatId ? "" : " (Select a subcategory)"}
          </p>
        ) : (
          <>
            {loadingPrices && (
              <div className="mb-2">
                Fetching price and stock info...{" "}
                <Spinner animation="border" size="sm" />
              </div>
            )}

            <Table bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Subcategory</th>
                  <th>Previous Price</th>
                  <th>Update Price</th>
                  <th>Previous Stock</th>
                  <th>Update Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((prod) => {
                  const priceStock = priceStockMap[prod.pid];
                  const edited =
                    editedPriceStatus[prod.pid] || {
                      price: "",
                      stockStatus: "",
                    };
                  const status = saveStatus[prod.pid] || {};
                  const productAvailable =
                    priceStock !== null && priceStock !== undefined;

                  return (
                    <tr key={prod.pid}>
                      <td>
                        <img
                          src={prod.image || prod.imageUrl}
                          alt={prod.pname || "Product Image"}
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                      </td>
                      <td>{prod.pname}</td>
                      <td>{prod.description}</td>
                      <td>
                        {prod.subCategory?.subcatname ||
                          prod.subCategory?.subCatName ||
                          "-"}
                      </td>

                      <td>
                        {productAvailable ? (
                          <>₹ {priceStock.price.toFixed(2)}</>
                        ) : (
                          <div className="text-danger">Product not available</div>
                        )}
                      </td>

                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={edited.price}
                          onChange={(e) =>
                            handleInputChange(prod.pid, "price", e.target.value)
                          }
                          disabled={loadingPrices}
                          placeholder="Enter price"
                        />
                      </td>

                      <td>
                        {productAvailable ? (
                          <>{priceStock.stockStatus}</>
                        ) : (
                          <div className="text-danger">N/A</div>
                        )}
                      </td>

                      <td>
                        <Form.Select
                          value={edited.stockStatus}
                          onChange={(e) =>
                            handleInputChange(
                              prod.pid,
                              "stockStatus",
                              e.target.value
                            )
                          }
                          disabled={loadingPrices}
                        >
                          <option value="">-- Select Stock Status --</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </Form.Select>
                      </td>

                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave(prod.pid)}
                          disabled={loadingPrices || status.loading}
                        >
                          {status.loading ? "Saving..." : "Save"}
                        </Button>
                        {status.error && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.8em" }}
                          >
                            {status.error}
                          </div>
                        )}
                        {status.success && (
                          <div
                            className="text-success mt-1"
                            style={{ fontSize: "0.8em" }}
                          >
                            {status.success}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ProductManager;
