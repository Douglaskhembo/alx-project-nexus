import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from "../features/authSlice";
import { useState } from "react";
import dynamic from "next/dynamic";

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
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <Link href="/" className="navbar-brand h1 fw-bold text-primary">
            NexusMarket
          </Link>

          <div className="d-flex flex-grow-1 mx-lg-4">
            <input
              type="text"
              placeholder="Search products..."
              className="form-control"
            />
          </div>

          <div className="d-flex align-items-center">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="position-relative text-dark text-decoration-none p-2 mx-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">cart items</span>
                </span>
              )}
            </Link>

            {auth.token ? (
              <>
                {/* Add Product Icon */}
                <Link
                  href="/add-product"
                  className="text-dark text-decoration-none p-2 mx-1"
                  title="Add Product"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5V7.5H11.5a.5.5 0 0 1 0 1H8.5V11.5a.5.5 0 0 1-1 0V8.5H4.5a.5.5 0 0 1 0-1H7.5V4.5A.5.5 0 0 1 8 4z"/>
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
                  </svg>
                </Link>

                {/* Profile Icon */}
                <Link
                  href="/profile"
                  className="text-dark text-decoration-none p-2 mx-1"
                  title="Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn btn-outline-secondary btn-sm me-2"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="btn btn-primary btn-sm"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

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
