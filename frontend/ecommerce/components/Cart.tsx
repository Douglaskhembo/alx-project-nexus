import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeFromCart, updateQuantity, clearCart } from "../features/cartSlice";
import CheckoutModal from "./modals/CheckoutModal";  // adjust path if needed

export default function Cart() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + (Number(item.new_price ?? item.price) || 0) * item.quantity,
    0
  );

  const handleDecrease = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleIncrease = (id: number, quantity: number, stock: number) => {
    if (quantity < stock) {
      dispatch(updateQuantity({ id, quantity: quantity + 1 }));
    }
  };

  const handlePlaceOrder = (deliveryLocation: string, landmark: string, paymentOption: string) => {
    alert(
      `Order placed!\nDelivery Location: ${deliveryLocation}\nLandmark: ${landmark}\nPayment: ${paymentOption}`
    );
    dispatch(clearCart());
    setIsCheckoutOpen(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto relative">
      <h2 className="mb-4">Shopping Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-auto max-h-80 border rounded relative">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Seller</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Price Per Quantity</th>
                  <th className="text-center">Action</th>
                  <th className="text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.new_price ?? item.price) || 0;
                  const currencyCode = item.currency?.currency_code ?? "$";

                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.seller ?? "N/A"}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">
                        {currencyCode} {price.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDecrease(item.id, item.quantity)}
                          className="btn btn-sm btn-danger me-2"
                          title="Decrease Quantity"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleIncrease(item.id, item.quantity, item.stock)}
                          className="btn btn-sm btn-success"
                          title="Increase Quantity"
                        >
                          +
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-link text-decoration-none text-muted"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="fw-bold">Total</td>
                  <td></td>
                  <td></td>
                  <td className="text-end fw-bold">
                    {items[0]?.currency?.currency_code ?? "$"} {total.toFixed(2)}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-3 d-flex justify-content-end gap-2">
            <button
              onClick={() => dispatch(clearCart())}
              className="btn btn-success"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn btn-primary"
            >
              Checkout
            </button>
          </div>

          <CheckoutModal
            show={isCheckoutOpen}
            onHide={() => setIsCheckoutOpen(false)}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}
    </div>
  );
}
