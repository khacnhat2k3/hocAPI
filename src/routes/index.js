import { Navigate } from "react-router-dom";
import PrivateRoutes from "../Components/PrivateRoutes";
import LayoutDefault from "../Layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import Cart from "../pages/Cart";
import ProductListing from "../pages/ProductListing";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "home",
            element: <Home />,
            children: [
              {
                path: "", // Mặc định hiển thị ProductListing khi truy cập /home
                element: <ProductListing />,
              },
              {
                path: "category/:categoryId?", // Route với tham số category tùy chọn
                element: <ProductListing />,
              },
              {
                path: "search", // Thêm route tìm kiếm trong Home
                element: <ProductListing />,
              }
            ]
          },
          {
            path: "cart",
            element: <Cart />,
          },
        ],
      },
    ],
  },
];

export default routes;