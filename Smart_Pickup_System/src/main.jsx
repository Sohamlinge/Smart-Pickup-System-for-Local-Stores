import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux"
import spsStore from "./store/spsStore.js";
import LoginPage from "./New_Components/LoginRegistration/LoginPage.jsx";
import RegistrationPage from "./New_Components/LoginRegistration/Registration.jsx";
import AdminDashboard from "./New_Components/Admin/AdminDashboard";
import ShopList from "./New_Components/Customer/ShopList.jsx";
import DashboardPage from "./New_Components/LoginRegistration/DashboardPage.jsx";
import ShopRegistrationPage from "./New_Components/LoginRegistration/ShopRegistrationPage.jsx"; // if exists
import ShopProducts from "./New_Components/Customer/ShopProducts.jsx";
import AddToCart from "./New_Components/Customer/AddToCart.jsx";
import CustomerProfile from "./New_Components/Customer/CustomerProfile.jsx";
import ShopkeeperDashboard from "./New_Components/Shopkeeper/ShopkeeperDashBoard.jsx";
import PlaceOrder from "./New_Components/Customer/PlaceOrder.jsx";
import CustomerOrderStatus from "./New_Components/Customer/CustomerOrderStatus.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LoginPage/>,
      },
      {
        path: "/register",
        element: <RegistrationPage/>,
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard/>,
      },
      {
        path: "/shoplist",
        element: <ShopList/>
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/shop-registration",
        element: <ShopRegistrationPage />,
      },
      {
        path: "/shop/:sid",
        element: <ShopProducts/>,
      },
      {
        path: "/addtocart",
        element: <AddToCart/>,
      },
      {
        path: "/profile",
        element: <CustomerProfile/>,
      },
      {
        path: "/placeorder",
        element: <PlaceOrder/>,
      },
      {
        path: "/customerorderstatus",
        element: <CustomerOrderStatus/>,
      },
      {
        path: "/Shopkeeper",
        element: <ShopkeeperDashboard/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={spsStore}>

    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
