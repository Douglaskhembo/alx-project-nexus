import { useAppDispatch, useAppSelector } from "../hooks";
import { removeFromCart, updateQuantity, clearCart } from "../features/cartSlice";
import Link from "next/link";

export default function Cart() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">
                    ${item.price} x{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="w-12 border rounded text-center"
                      onChange={(e) =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <div className="space-x-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="border px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              <Link href="/checkout">
                <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Checkout
                </a>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
