// Tạo file src/pages/Search.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductListing.css'; // Có thể tái sử dụng CSS
import { createCart, searchProducts } from '../utils/request';
import Cookies from 'js-cookie';

const Search = () => {
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    console.log('page home:');
    if (keyword) {
      setSearchKeyword(keyword);
      loadSearchResults(keyword);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [location.search]);
  
  const loadSearchResults = async (keyword) => {
    try {
      setLoading(true);
      console.log('page search');
      const data = await searchProducts(keyword);
      setProducts(data.result || []);
    } catch (err) {
      setError('Failed to load search results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };
  
  const calculateDiscountedPrice = (price, discount) => {
    return price - discount;
  };
  
  const handleAddToCart = async (product) => {
    console.log(`Added ${product.id} to cart`);
    const token = Cookies.get('token');
    console.log('Token:', token);
    try {
      const result = await createCart(product.id, 1);
      console.log('Cart created successfully:', result);
    } catch (error) {
      console.error('Failed to create cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="products-container loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Kết quả tìm kiếm: "{searchKeyword}"</h1>
      <div className="products-count">{products.length} products found</div>
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.thumbnailUrl} alt={product.name} />
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discountRate}%</div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brandName}</p>
                
                <div className="product-price">
                  {product.discount > 0 ? (
                    <>
                      <span className="discounted-price">
                        {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                      </span>
                      <span className="original-price">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="regular-price">{formatPrice(product.price)}</span>
                  )}
                </div>
                
                <div className="product-meta">
                  <div className="rating">
                    <span className="stars">
                      {Array(5).fill().map((_, i) => (
                        <i 
                          key={i} 
                          className={`star ${i < Math.floor(product.ratingAverage || 0) ? 'filled' : ''}`}
                        >★</i>
                      ))}
                    </span>
                    <span className="rating-value">({(product.ratingAverage || 0).toFixed(1)})</span>
                  </div>
                  <div className="sold">{product.quantitySold || 0} sold</div>
                </div>
                
                <div className="product-actions">
                  <button 
                    className="add-to-cart" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found for "{searchKeyword}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;