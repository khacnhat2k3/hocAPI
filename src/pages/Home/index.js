import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Nếu có bất kỳ nội dung nào khác của trang Home, bạn có thể thêm ở đây */}
      <Outlet /> {/* Sẽ render ProductListing */}
    </div>
  );
};

export default Home;