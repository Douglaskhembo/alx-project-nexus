import Link from "next/link";
import { useAppSelector } from "../hooks";

export default function Header() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <Link href="/">
        <a className="text-xl font-bold">NexusMarket</a>
      </Link>
      <input
        type="text"
        placeholder="Search products..."
        className="p-2 rounded text-black w-1/2"
      />
      <div className="flex space-x-4 items-center">
        <Link href="/cart">
          <a className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </a>
        </Link>
        <Link href="/login">
          <a>👤</a>
        </Link>
      </div>
    </header>
  );
}
