import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useLocation } from 'react-router-dom';
import './ProductListing.css';
import { createCart, getProducts, searchProducts } from '../../utils/request';
import Cookies from 'js-cookie';

const ProductListing = () => {
  const { categoryId: categoryIdFromUrl } = useParams();
  const { selectedCategoryId } = useOutletContext() || {};
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const categoryId = categoryIdFromUrl || selectedCategoryId;

  
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    console.log("Current path:", location.pathname);
    console.log("Search keyword:", keyword);
  
    if (location.pathname.includes('/search') && keyword) {
      setIsSearchResult(true);
      setSearchKeyword(keyword);
      loadSearchResults(keyword);
    } else {
      setIsSearchResult(false);
      setSearchKeyword('');
      loadCategoryProducts();
    }
  }, [categoryId, location.search, location.pathname]);
  
  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(categoryId || 1);
      setProducts(data.result || []);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadSearchResults = async (keyword) => {
    try {
      setLoading(true);
      const data = await searchProducts(keyword);
      console.log("Search results:", data);
      
      // Ensure data is an array before setting products
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load search results. Please try again later.');
      console.error(err);
      setProducts([]); // Set to empty array on error
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
      // Gọi API createCart
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

  // Display page title with category if available
  const getCategoryTitle = (categoryId) => {
    const categories = {
      1: 'Điện thoại',
      2: 'Laptop',
      3: 'Smartwatch',
      4: 'Tablet',
      5: 'Máy ảnh',
      6: 'Loa',
      7: 'Điện tử',
      8: 'Phụ kiện'
    };
    
    return categories[categoryId] || 'All Products';
  };

  const getPageTitle = () => {
    if (isSearchResult) {
      return `Kết quả tìm kiếm: "${searchKeyword}"`;
    } else {
      return categoryId ? getCategoryTitle(parseInt(categoryId)) : 'All Products';
    }
  };

  return (
    <div className="products-page">
      <h1>{getPageTitle()}</h1>
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
                          className={`star ${i < Math.floor(product.ratingAverage) ? 'filled' : ''}`}
                        >★</i>
                      ))}
                    </span>
                    <span className="rating-value">({product.ratingAverage?.toFixed(1) || '0.0'})</span>
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
            {isSearchResult ? (
              <p>No products found for "{searchKeyword}".</p>
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;