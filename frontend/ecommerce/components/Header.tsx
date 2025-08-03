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
      <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <Link href="/" className="text-xl font-bold">
          NexusMarket
        </Link>

        <input
          type="text"
          placeholder="Search products..."
          className="p-2 rounded text-black w-1/2"
        />

        <div className="flex space-x-4 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {auth.token ? (
            <>
              <Link href="/profile">
                <User className="w-6 h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm border px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm border px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="text-sm border px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition"
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
