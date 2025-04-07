import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteAllCookies } from "../../helpers/cookie";
import { checkLogin } from "../../actions/login";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  deleteAllCookies();
   useEffect(() => {
      dispatch(checkLogin(false));
      navigate("/login");
      
    }, [dispatch, navigate]); 
    console.log("Logout");
    return (
      <>
      </>
    );
  }
  
  export default Logout;