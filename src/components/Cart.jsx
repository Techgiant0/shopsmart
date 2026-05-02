import { useState } from "react";
import { X, Trash2, ShoppingCart } from "lucide-react";

function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = isCouponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "DISCOUNT10") {
      setIsCouponApplied(true);
      alert("10% Discount Applied!");
    } else {
      setIsCouponApplied(false);
      alert("Invalid coupon code. Try DISCOUNT10");
    }
  };

  const handleCheckout = () => {
    onCheckout({ subtotal, discount: discountAmount, total });
    setCoupon("");
    setIsCouponApplied(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={onClose}
          style={{ zIndex: 40, backgroundColor: "rgba(0,0,0,0.3)" }}
        ></div>
      )}
      <div className={`cart-overlay ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart
              size={48}
              style={{ marginBottom: "16px", opacity: 0.5 }}
            />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <div className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Coupon code (e.g., DISCOUNT10)"
                  className="coupon-input"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button
                  onClick={handleApplyCoupon}
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "white",
                  }}
                >
                  Apply
                </button>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div
                  className="cart-summary-row"
                  style={{ color: "var(--success-color)" }}
                >
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
