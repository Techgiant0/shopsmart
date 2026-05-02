import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import './App.css';

function App() {
  // State for products and UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [categories, setCategories] = useState([]);

  // Wishlist, Cart & Modals
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopsmart_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shopsmart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch Data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
      
      const uniqueCategories = ['all', ...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
      setError(null);
    } catch {
      setError('Could not load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('shopsmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopsmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Cart Functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // alert(`${product.title} added to cart!`);
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  // Derived State (Filtering and Sorting)
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortOrder === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'name-asc') {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Calculate cart total items
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Header 
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={() => setIsCartOpen(true)}
        toggleWishlist={() => {
          alert(`You have ${wishlist.length} items in your wishlist!`);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        <div className="controls">
          <div className="filters">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Sort By: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading-state">Loading products...</div>}
        
        {error && <div className="error-state">{error}</div>}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="empty-state">No products found matching your criteria.</div>
        )}

        {!loading && !error && (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpenModal={setSelectedProduct}
                onAddToCart={addToCart}
                isWishlisted={wishlist.some(item => item.id === product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
        isWishlisted={selectedProduct ? wishlist.some(item => item.id === selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={(summary) => {
          setIsCartOpen(false);
          setCheckoutSummary(summary);
        }}
      />

      <CheckoutModal 
        summary={checkoutSummary}
        onClose={() => setCheckoutSummary(null)}
        onConfirm={() => {
          setCart([]);
          setCheckoutSummary(null);
        }}
      />
    </div>
  );
}

export default App;
