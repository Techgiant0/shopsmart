import { ShoppingCart, Heart, Search, Moon, Sun } from 'lucide-react';

function Header({ 
  cartCount, 
  wishlistCount, 
  searchQuery, 
  setSearchQuery, 
  toggleCart, 
  toggleWishlist,
  darkMode,
  setDarkMode 
}) {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="logo">ShopSmart</h1>
        <div className="search-bar">
          <Search size={20} color="var(--secondary-color)" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="icon-button" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <button className="icon-button" onClick={toggleWishlist} title="Wishlist">
          <Heart size={24} color={wishlistCount > 0 ? "var(--danger-color)" : "currentColor"} />
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </button>
        
        <button className="icon-button" onClick={toggleCart} title="Cart">
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}

export default Header;
