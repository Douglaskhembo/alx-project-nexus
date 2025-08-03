import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../hooks";
import { ShoppingCart, User } from "lucide-react";
import { logout } from "../features/authSlice";
import { useState } from "react";
import dynamic from "next/dynamic";

// Lazy load modals (optional, improve performance)
const LoginModal = dynamic(() => import("./modals/LoginModal"));
const RegisterModal = dynamic(() => import("./modals/RegisterModal"));

export default function Header() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const auth = useAppSelector((state) => state.auth);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
    <header className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-4 bg-white shadow sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        NexusMarket
      </Link>
      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 min-w-[200px] p-2 border rounded-md"
      />
      <div className="flex space-x-2 items-center">
        {/* Cart */}
        <Link href="/cart" className="relative p-2 rounded hover:bg-gray-100">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </Link>
        {/* Auth */}
        {auth.token ? (
          <>
            <Link href="/profile" className="p-2 hover:bg-gray-100 rounded">
              <User className="w-6 h-6 text-gray-700" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="text-sm px-3 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
