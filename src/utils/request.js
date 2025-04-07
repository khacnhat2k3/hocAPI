import axios from "axios";
import Cookies from "js-cookie";
const API_DOMAIN = "http://localhost:8081/";
export const get = async (url) => {
  const response = await fetch(API_DOMAIN + url);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const post = async (url, data) => {
  const response = await fetch(`${API_DOMAIN}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};
export const put = async (url, data) => {
  const response = await fetch(`${API_DOMAIN}${url}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};
export const remove = async (url) => {
  const response = await fetch(`${API_DOMAIN}${url}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const patch = async (url, data) => {
  const response = await fetch(`${API_DOMAIN}${url}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};
export const getProducts = async (categoryId) => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/products/category/${categoryId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

function getTokenFromCookie() {
  return Cookies.get("token"); // Giả sử token được lưu trong cookie với key 'token'
}

// Hàm async để gọi API
export const  createCart = async (cartId, quantity)=> {
  try {
    // Lấy token từ cookie
    const token = getTokenFromCookie();

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      throw new Error("Token not found");
    }

    // Endpoint API
    const url = `http://localhost:8081/api/cart/${cartId}`;

    // Header cho request
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Body request
    const data = {
      quantity,
    };

    // Gửi request POST
    const response = await axios.post(url, data, { headers });

    // Trả về response từ API
    return response.data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

export const getUserCart = async () => {
  try {
    // Lấy token từ cookie
    const token = getTokenFromCookie();

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      throw new Error('Token not found');
    }

    // Endpoint API
    const url = 'http://localhost:8081/api/cart/user';

    // Header cho request
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Gửi request GET
    const response = await axios.get(url, { headers });

    // Trả về response từ API
    return response.data;
  } catch (error) {
    console.error('Error getting user cart:', error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// export const searchProducts = async (keyword) => {
//   try {
//     // Lấy token từ cookie
//     const token = getTokenFromCookie();
//     console.log(keyword);
//     console.log(token);
    
//     // Thực hiện request API
//     const response = await fetch(`http://localhost:8081/api/products/recommendation/${keyword}`, {
      
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     // Kiểm tra status
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     console.log(response);
//     // Parse JSON response
//     const data = await response.json();
//     return data.result;
//   } catch (error) {
//     console.error('Error searching products:', error);
//     throw error; // Re-throw để component gọi function có thể xử lý
//   }
// };

export const searchProducts = async (keyword) => {
  try {
    const token = Cookies.get('token');
    console.log('Search API Token:', token);
    console.log('Search Keyword:', keyword);
    
    const response = await fetch(`http://localhost:8081/api/products/recommendation/${keyword}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const responseBody = await response.text(); 
    
    if (!response.ok) {
      console.error('Search error response:', responseBody);
      return []; // Return empty array instead of throwing error
    }
    
    // Parse JSON carefully
    const data = responseBody ? JSON.parse(responseBody) : null;
    console.log('Parsed data:', data);
    
    // Ensure we always return an array
    return data?.result || [];
  } catch (error) {
    console.error('Comprehensive search error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return []; // Return empty array on any error
  }
};