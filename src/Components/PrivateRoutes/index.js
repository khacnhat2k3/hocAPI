import { Navigate,Outlet } from "react-router";

function PrivateRoutes() {
    const login = true;
  return (
    <>
        {login ? <Outlet /> : <Navigate to="/login" />}
    </>
  );
}

export default PrivateRoutes;