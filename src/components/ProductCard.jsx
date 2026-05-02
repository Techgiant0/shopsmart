import { Heart } from 'lucide-react';

function ProductCard({ product, onOpenModal, onAddToCart, isWishlisted, onToggleWishlist }) {
  // Prevent click from opening modal if wishlist button is clicked
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={() => onOpenModal(product)}>
      <div className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" />
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart fill={isWishlisted ? "currentColor" : "none"} size={24} />
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title" title={product.title}>{product.title}</h3>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
