import RequireAuth from "../components/RequireAuth";
import { useAppSelector, useAppDispatch } from "../hooks";
import { clearCart } from "../features/cartSlice";
import { useRouter } from "next/router";

export default function Checkout() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const handlePlaceOrder = async () => {
  const response = await fetch("http://localhost:8000/api/create-checkout-session/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      items: items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }),
  });

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Something went wrong creating the checkout session.");
  }
};


  return (
    <RequireAuth>
      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl font-bold mb-4">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </RequireAuth>
  );
}
