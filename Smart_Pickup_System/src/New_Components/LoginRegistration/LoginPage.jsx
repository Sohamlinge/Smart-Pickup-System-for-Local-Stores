// import React, { useState } from 'react';
// import axios from 'axios';
// import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
// import { FaUser, FaLock } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { userAction } from "../../store/userSlice";

// const apiBase = "http://localhost:8080";

// function LoginPage() {
//   const [uname, setUname] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${apiBase}/auth/user/login`,
//         { uname, password },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       const data = response.data;
//       console.log("Login API response:", data);

//       // ✅ Ensure full user+shopkeeper data is stored in Redux
//       dispatch(userAction.loadUser(data));

//       setMessage(data.message || '');

//       // ✅ Navigate after Redux is populated
//       switch (data.role.rid) {
//         case 1:
//           navigate('/admin-dashboard');
//           break;
//         case 2:
//           navigate('/Shopkeeper');
//           break;
//         case 3:
//           navigate('/shoplist');
//           break;
//         default:
//           navigate('/dashboard');
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('Login failed');
//     }
//   };

//   return (
//     <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
//       <Row className="shadow p-4 rounded" style={{ width: '90%', maxWidth: '1000px' }}>
//         {/* Left side: Login form */}
//         <Col md={6} className="d-flex flex-column justify-content-center px-5">
//           <h2 className="text-center mb-4">Sign in</h2>
//           <Form onSubmit={handleLogin}>
//             <Form.Group className="mb-3 d-flex align-items-center">
//               <FaUser className="me-2" />
//               <Form.Control
//                 type="text"
//                 placeholder="Username"
//                 value={uname}
//                 onChange={(e) => setUname(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3 d-flex align-items-center">
//               <FaLock className="me-2" />
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Button variant="outline-primary" type="submit" className="w-100">
//               Login
//             </Button>
//           </Form>

//           {message && (
//             <Alert
//               className="mt-3"
//               variant={message.includes('successful') ? 'success' : 'danger'}
//             >
//               {message}
//             </Alert>
//           )}

//           <div className="mt-3 text-center">
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 navigate("/register");
//               }}
//             >
//               Create New Account
//             </a>
//           </div>
//         </Col>

//         {/* Right side: Image */}
//         <Col md={6} className="d-none d-md-flex align-items-center justify-content-center">
//           <img
//             src="https://videoigniter.com/wp-content/uploads/2023/04/Business-Animation.png.webp"
//             alt="Login illustration"
//             className="img-fluid"
//             style={{ maxHeight: '350px' }}
//           />
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default LoginPage;
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { userAction } from "../../store/userSlice";

const apiBase = "http://localhost:8080";

function LoginPage() {
  const [uname, setUname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiBase}/auth/user/login`,
        { uname, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      console.log("Login API response:", data);

      // Store full user data in Redux (assumes userAction.loadUser sets in redux + localStorage in your slice)
      dispatch(userAction.loadUser(data));

      // Optionally, also store in localStorage for persistence if your slice does not handle it already
      localStorage.setItem("user", JSON.stringify(data));

      setMessage(data.message || '');

      // Navigate based on role ID
      switch (data.role.rid) {
        case 1:
          navigate('/admin-dashboard');
          break;
        case 2:
          navigate('/Shopkeeper');
          break;
        case 3:
          navigate('/shoplist');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="shadow p-4 rounded" style={{ width: '90%', maxWidth: '1000px' }}>
        {/* Left side: Login form */}
        <Col md={6} className="d-flex flex-column justify-content-center px-5">
          <h2 className="text-center mb-4">Sign in</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3 d-flex align-items-center">
              <FaUser className="me-2" />
              <Form.Control
                type="text"
                placeholder="Username"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <FaLock className="me-2" />
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="outline-primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          {message && (
            <Alert
              className="mt-3"
              variant={message.toLowerCase().includes('successful') ? 'success' : 'danger'}
            >
              {message}
            </Alert>
          )}

          <div className="mt-3 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Create New Account
            </a>
          </div>
        </Col>

        {/* Right side: Image */}
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center">
          <img
            src="https://videoigniter.com/wp-content/uploads/2023/04/Business-Animation.png.webp"
            alt="Login illustration"
            className="img-fluid"
            style={{ maxHeight: '350px' }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;

