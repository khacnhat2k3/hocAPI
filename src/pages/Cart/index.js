import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './Cart.css';
import { getUserCart } from '../../utils/request';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm format giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Gọi API hoặc đọc file JSON
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getUserCart();
        console.log(response); // Debug dữ liệu

        if (!response || response.code !== 1000) {
          throw new Error('Failed to fetch cart items');
        }

        setCartItems(response.result); // Lưu dữ liệu vào state
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Hàm tăng số lượng sản phẩm
  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  // Hàm giảm số lượng sản phẩm
  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Tính tổng tiền giỏ hàng
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Giả định phí vận chuyển
  const shippingFee = cartItems.length > 0 ? 30000 : 0;

  // Tính tổng thanh toán
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee;
  };

  // Xử lý trạng thái loading
  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Xử lý lỗi
  if (error) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // Xử lý trường hợp giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <Link to="/home" className="continue-shopping-btn">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>

      <div className="cart-content">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th className="product-col">Sản phẩm</th>
                <th className="price-col">Đơn giá</th>
                <th className="quantity-col">Số lượng</th>
                <th className="total-col">Thành tiền</th>
                <th className="actions-col"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="cart-item">
                  <td className="product-info">
                    <img src={item.thumbnailUrl} alt={`Product ${item.id}`} className="product-thumbnail" />
                    <div className="product-details">
                      <h3>Sản phẩm #{item.id}</h3>
                      <p className="brand">Không có thông tin thương hiệu</p>
                    </div>
                  </td>
                  <td className="product-price">
                    <span>{formatPrice(item.totalPrice / item.quantity)}</span>
                  </td>
                  <td className="product-quantity">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity || 1}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td className="product-total">
                    {formatPrice(item.totalPrice)}
                  </td>
                  <td className="product-actions">
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="summary-item">
            <span>Tạm tính:</span>
            <span>{formatPrice(calculateSubtotal())}</span>
          </div>
          <div className="summary-item">
            <span>Phí vận chuyển:</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
          <div className="summary-item total">
            <span>Tổng cộng:</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>
          <button className="checkout-btn">Tiến hành thanh toán</button>
          <Link to="/home" className="continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;