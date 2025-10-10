// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Spinner,
//   Alert,
//   ListGroup,
// } from "react-bootstrap";
// import { useSelector } from "react-redux";

// const apiBase = "http://localhost:8080";

// const ProductCard = ({ product, onAddToCart }) => {
//   const [imageError, setImageError] = useState(false);

//   return (
//     <Card
//       className="h-100 shadow rounded-4 border-0"
//       style={{ transition: "transform 0.2s" }}
//       onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
//       onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//     >
//       <Card.Img
//         variant="top"
//         src={imageError ? "https://via.placeholder.com/150" : product.image}
//         onError={() => setImageError(true)}
//         style={{
//           height: "160px",
//           objectFit: "contain",
//           backgroundColor: "#f8f9fa",
//           borderTopLeftRadius: "1rem",
//           borderTopRightRadius: "1rem",
//         }}
//       />
//       <Card.Body className="d-flex flex-column justify-content-between">
//         <div>
//           <Card.Title className="fs-6 text-truncate fw-semibold">
//             {product.pname}
//           </Card.Title>
//           <Card.Text className="mb-2 text-primary fw-bold">
//             ₹{product.price !== "N/A" ? product.price : <small>N/A</small>}
//           </Card.Text>
//           <div className="text-muted fst-italic" style={{ fontSize: "0.75rem" }}>
//             {product.description || "No description available"}
//           </div>
//           <div
//             className={`mt-2 fw-semibold ${
//               product.stock_status === "Unavailable"
//                 ? "text-danger"
//                 : "text-success"
//             }`}
//             style={{ fontSize: "0.8rem" }}
//           >
//             {product.stock_status === "Unavailable" ? "Out of Stock" : "In Stock"}
//           </div>
//         </div>
//         <Button
//           variant="success"
//           size="sm"
//           className="mt-3 rounded-pill"
//           disabled={product.stock_status === "Unavailable"}
//           onClick={() => onAddToCart(product)}
//         >
//           ADD
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

// const ShopProducts = () => {
//   const { sid } = useParams();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user);
//   const uid = user?.uid || null;

//   const [categories, setCategories] = useState([]);
//   const [selectedCatId, setSelectedCatId] = useState(null);
//   const [selectedSubCatId, setSelectedSubCatId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const catRes = await axios.get(`${apiBase}/customer/Category`);
//         const allCategories = catRes.data;

//         const detailedCats = await Promise.all(
//           allCategories.map(async (cat) => {
//             const subRes = await axios.get(
//               `${apiBase}/customer/SubCategory/by-category/${cat.catId}`
//             );

//             const subCategories = subRes.data.map((sub) => {
//               const products = sub.products.map((p) => {
//                 const match = p.productShopkeepers?.find(
//                   (ps) => ps.sid === parseInt(sid)
//                 );
//                 return {
//                   ...p,
//                   price: match?.price || "N/A",
//                   stock_status: match?.stock_status || "Unavailable",
//                 };
//               });
//               return {
//                 subCatId: sub.subCatId,
//                 subCatName: sub.subCatName,
//                 products,
//               };
//             });

//             return { catId: cat.catId, catName: cat.catName, subCategories };
//           })
//         );

//         setCategories(detailedCats);

//         if (detailedCats.length > 0) {
//           setSelectedCatId(detailedCats[0].catId);
//           if (detailedCats[0].subCategories.length > 0) {
//             setSelectedSubCatId(detailedCats[0].subCategories[0].subCatId);
//           }
//         }
//       } catch (err) {
//         setError("Failed to fetch products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [sid]);

//   const handleAddToCart = async (product) => {
//     try {
//       if (!uid) {
//         alert("Please log in before adding items to cart.");
//         return;
//       }

//       const payload = {
//         uid: parseInt(uid),
//         sid: parseInt(sid),
//         pid: product.pid,
//         quantity: 1,
//       };

//       const res = await axios.post(`${apiBase}/customer/cart/add`, payload);
//       alert(res.data?.message || "Item added to cart!");
//     } catch (err) {
//       console.error("Add to cart error:", err.response?.data || err.message);
//       alert(err.response?.data?.title || "Failed to add item to cart.");
//     }
//   };

//   // const handleGoToCart = () => {
//   //   navigate("/addtocart");
//   // };

//   if (loading) {
//     return (
//       <Container className="text-center my-5" style={{ marginTop: "70px" }}>
//         <Spinner animation="border" />
//         <p>Loading...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="my-5" style={{ marginTop: "70px" }}>
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   const selectedCategory = categories.find((cat) => cat.catId === selectedCatId);
//   const selectedSubCategory =
//     selectedCategory?.subCategories.find(
//       (sub) => sub.subCatId === selectedSubCatId
//     ) || null;

//   return (
//     <Container fluid className="py-4" style={{ marginTop: "70px" }}>
//       <Row>
//         {/* Sidebar Categories */}
//         <Col md={3}>
//           <ListGroup>
//             {categories.map((cat) => (
//               <ListGroup.Item
//                 key={cat.catId}
//                 active={cat.catId === selectedCatId}
//                 action
//                 onClick={() => {
//                   setSelectedCatId(cat.catId);
//                   setSelectedSubCatId(
//                     cat.subCategories.length > 0
//                       ? cat.subCategories[0].subCatId
//                       : null
//                   );
//                 }}
//               >
//                 {cat.catName}
//               </ListGroup.Item>
//             ))}
//           </ListGroup>

//           {selectedCategory && (
//             <ListGroup className="mt-3">
//               {selectedCategory.subCategories.map((sub) => (
//                 <ListGroup.Item
//                   key={sub.subCatId}
//                   active={sub.subCatId === selectedSubCatId}
//                   action
//                   onClick={() => setSelectedSubCatId(sub.subCatId)}
//                 >
//                   {sub.subCatName}
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           )}
//         </Col>

//         {/* Products */}
//         <Col md={9}>
//           <Row xs={1} sm={2} md={3} className="g-4">
//             {selectedSubCategory?.products.map((product) => (
//               <Col key={product.pid}>
//                 <ProductCard
//                   product={product}
//                   onAddToCart={handleAddToCart}
//                 />
//               </Col>
//             ))}
//           </Row>
//         </Col>
//       </Row>

//       {/* <Button variant="primary" onClick={handleGoToCart} className="mt-3">
//         Go to Cart
//       </Button> */}
//     </Container>
//   );
// };

// export default ShopProducts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const apiBase = "http://localhost:8080";

// Product card component
const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className="h-100 shadow rounded-4 border-0"
      style={{ transition: "transform 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Card.Img
        variant="top"
        src={imageError ? "https://via.placeholder.com/150" : product.image}
        onError={() => setImageError(true)}
        style={{
          height: "160px",
          objectFit: "contain",
          backgroundColor: "#f8f9fa",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fs-6 text-truncate fw-semibold">
            {product.pname}
          </Card.Title>
          <Card.Text className="mb-2 text-primary fw-bold">
            ₹{product.price !== "N/A" ? product.price : <small>N/A</small>}
          </Card.Text>
          <div className="text-muted fst-italic" style={{ fontSize: "0.75rem" }}>
            {product.description || "No description available"}
          </div>
          <div
            className={`mt-2 fw-semibold ${
              product.stock_status === "Unavailable"
                ? "text-danger"
                : "text-success"
            }`}
            style={{ fontSize: "0.8rem" }}
          >
            {product.stock_status === "Unavailable" ? "Out of Stock" : "In Stock"}
          </div>
        </div>
        <Button
          variant="success"
          size="sm"
          className="mt-3 rounded-pill"
          disabled={product.stock_status === "Unavailable"}
          onClick={() => onAddToCart(product)}
        >
          ADD
        </Button>
      </Card.Body>
    </Card>
  );
};

const ShopProducts = () => {
  const { sid } = useParams();
  const navigate = useNavigate();

  // Get user from Redux, fallback to localStorage
  const reduxUser = useSelector((state) => state.user);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const uid = reduxUser?.uid || storedUser?.uid || null;

  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await axios.get(`${apiBase}/customer/Category`);
        const allCategories = catRes.data;

        const detailedCats = await Promise.all(
          allCategories.map(async (cat) => {
            const subRes = await axios.get(
              `${apiBase}/customer/SubCategory/by-category/${cat.catId}`
            );

            const subCategories = subRes.data.map((sub) => {
              const products = sub.products.map((p) => {
                const match = p.productShopkeepers?.find(
                  (ps) => ps.sid === parseInt(sid)
                );
                return {
                  ...p,
                  price: match?.price || "N/A",
                  stock_status: match?.stock_status || "Unavailable",
                };
              });
              return {
                subCatId: sub.subCatId,
                subCatName: sub.subCatName,
                products,
              };
            });

            return { catId: cat.catId, catName: cat.catName, subCategories };
          })
        );

        setCategories(detailedCats);

        if (detailedCats.length > 0) {
          setSelectedCatId(detailedCats[0].catId);
          if (detailedCats[0].subCategories.length > 0) {
            setSelectedSubCatId(detailedCats[0].subCategories[0].subCatId);
          }
        }
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sid]);

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      if (!uid) {
        alert("Please log in before adding items to cart.");
        return;
      }

      const payload = {
        uid: parseInt(uid),
        sid: parseInt(sid),
        pid: product.pid,
        quantity: 1,
      };

      const res = await axios.post(`${apiBase}/customer/cart/add`, payload);
      alert(res.data?.message || "Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert(err.response?.data?.title || "Failed to add item to cart.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5" style={{ marginTop: "70px" }}>
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5" style={{ marginTop: "70px" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const selectedCategory = categories.find((cat) => cat.catId === selectedCatId);
  const selectedSubCategory =
    selectedCategory?.subCategories.find(
      (sub) => sub.subCatId === selectedSubCatId
    ) || null;

  return (
    <Container fluid className="py-4" style={{ marginTop: "70px" }}>
      <Row>
        {/* Sidebar Categories */}
        <Col md={3}>
          <ListGroup>
            {categories.map((cat) => (
              <ListGroup.Item
                key={cat.catId}
                active={cat.catId === selectedCatId}
                action
                onClick={() => {
                  setSelectedCatId(cat.catId);
                  setSelectedSubCatId(
                    cat.subCategories.length > 0
                      ? cat.subCategories[0].subCatId
                      : null
                  );
                }}
              >
                {cat.catName}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {selectedCategory && (
            <ListGroup className="mt-3">
              {selectedCategory.subCategories.map((sub) => (
                <ListGroup.Item
                  key={sub.subCatId}
                  active={sub.subCatId === selectedSubCatId}
                  action
                  onClick={() => setSelectedSubCatId(sub.subCatId)}
                >
                  {sub.subCatName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Products */}
        <Col md={9}>
          <Row xs={1} sm={2} md={3} className="g-4">
            {selectedSubCategory?.products.map((product) => (
              <Col key={product.pid}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ShopProducts;
