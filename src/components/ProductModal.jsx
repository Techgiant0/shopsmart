import { X, Heart, Star } from 'lucide-react';

function ProductModal({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="product-detail-layout">
          <div className="product-detail-image">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product-detail-info">
            <span className="product-category">{product.category}</span>
            <h2>{product.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#fbbf24' }}>
              <Star fill="currentColor" size={20} />
              <span style={{ color: 'var(--text-color)' }}>
                {product.rating?.rate} ({product.rating?.count} reviews)
              </span>
            </div>

            <div className="product-detail-price">${product.price.toFixed(2)}</div>
            <p className="product-detail-description">{product.description}</p>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
                Add to Cart
              </button>
              <button 
                className="icon-button" 
                style={{ border: '1px solid var(--border-color)' }}
                onClick={() => onToggleWishlist(product)}
              >
                <Heart 
                  fill={isWishlisted ? "var(--danger-color)" : "none"} 
                  color={isWishlisted ? "var(--danger-color)" : "currentColor"}
                  size={24} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
