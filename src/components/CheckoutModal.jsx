import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

function CheckoutModal({ summary, onClose, onConfirm }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!summary) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    // Simulate API call and clear cart after 2 seconds
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={!isConfirmed ? onClose : undefined}>
      <div className="modal-content" style={{ maxWidth: '500px', textAlign: isConfirmed ? 'center' : 'left' }} onClick={e => e.stopPropagation()}>
        {!isConfirmed && (
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        )}

        {isConfirmed ? (
          <div style={{ padding: '40px 20px' }}>
            <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ marginBottom: '16px' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '0' }}>
              Thank you for shopping with ShopSmart. Your order is being processed.
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Checkout Summary</h2>
            
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="cart-summary-row" style={{ color: 'var(--success-color)' }}>
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-row total" style={{ marginTop: '16px' }}>
                <span>Amount to Pay</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleConfirm}>
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
