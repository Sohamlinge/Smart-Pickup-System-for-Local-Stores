import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const apiBase = "http://localhost:8080";

const ShopList = () => {
  const [address, setAddress] = useState("");
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShop, setSelectedShop] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const shopsPerPage = 3;
  const navigate = useNavigate();

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        `${apiBase}/customer/Shop/by-address/${address}`
      );

      // For Leaflet, each shop should have lat/lng; if your backend doesn't provide, add dummy coordinates
      const shopsWithCoords = response.data.map((shop, index) => ({
        ...shop,
        lat: shop.lat || 21.1458 + index * 0.001, // dummy Nagpur coordinates
        lng: shop.lng || 79.0882 + index * 0.001,
      }));

      setShops(shopsWithCoords);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      setShops([]);
      if (err.response && err.response.status === 404) {
        setError("No shops found.");
      } else {
        setError("Error fetching shops.");
      }
    }
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setError("Unable to fetch your location.");
      }
    );
  };

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = shops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(shops.length / shopsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="bg-light py-5 text-center" style={{ marginTop: "70px" }}>
        <Container>
          <h1 className="display-5 fw-bold mb-3">Find Local Shops Near You</h1>
          <p className="text-muted mb-4">
            Enter your city to discover nearby stores and products.
          </p>

          <Form
            className="d-flex justify-content-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              fetchShops();
            }}
          >
            <Form.Control
              type="text"
              placeholder="e.g. Nagpur"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-50"
            />
            <Button type="submit" variant="success" className="px-4">
              Search
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {currentShops.map((shop) => (
            <Col md={12} key={shop.sid}>
              <Card className="shadow border-0 h-100 hover-shadow">
                <Card.Body>
                  <Card.Title className="text-primary fw-bold fs-5">
                    {shop.sname}
                  </Card.Title>
                  <Card.Text className="text-muted mb-2">
                    <strong>Phone:</strong> {shop.sphoneno}
                    <br />
                    <strong>Address:</strong> {shop.sAddress}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    className="w-100 mt-2"
                    onClick={() => navigate(`/shop/${shop.sid}`)}
                  >
                    View Products
                  </Button>
                  <Button
                    variant="outline-success"
                    className="w-100 mt-2"
                    onClick={() => handleSelectShop(shop)}
                  >
                    Locate on Map
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {shops.length > shopsPerPage && (
          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}

        {/* Leaflet Map Section */}
        {selectedShop && (
          <div className="mt-5">
            <h3 className="text-center mb-3">
              Directions to {selectedShop.sname}
            </h3>
            <MapContainer
              center={[selectedShop.lat, selectedShop.lng]}
              zoom={14}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[selectedShop.lat, selectedShop.lng]}>
                <Popup>{selectedShop.sname}</Popup>
              </Marker>
              {userLocation && (
                <>
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [userLocation.lat, userLocation.lng],
                      [selectedShop.lat, selectedShop.lng],
                    ]}
                    color="blue"
                  />
                </>
              )}
            </MapContainer>
          </div>
        )}
      </Container>

      <footer className="bg-white border-top py-3 mt-auto text-center">
        <Container>
          <span className="text-muted">
            &copy; {new Date().getFullYear()} SmartPickup. All rights reserved.
          </span>
        </Container>
      </footer>

      <style jsx="true">{`
        .hover-shadow:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ShopList;
