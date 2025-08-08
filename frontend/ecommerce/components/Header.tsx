import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from "../features/authSlice";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LoginModal = dynamic(() => import("./modals/LoginModal"));
const RegisterModal = dynamic(() => import("./modals/RegisterModal"));
const AddProductModal = dynamic(() => import("./modals/AddProductModal"));
const AddCategoryModal = dynamic(() => import("./modals/AddCategoryModal"));
const AddCurrencyModal = dynamic(() => import("./modals/AddCurrencyModal"));

export default function Header() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const auth = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCurrency, setShowAddCurrency] = useState(false)

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
            <Link href="/cart" className="position-relative text-dark text-decoration-none p-2 mx-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              {isMounted && cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">cart items</span>
                </span>
              )}
            </Link>

            {isMounted && auth.token ? (
              <>
                {/* Add Category Button */}
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="text-dark text-decoration-none p-2 mx-1 btn btn-link"
                  title="Add Category"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5V7.5H11.5a.5.5 0 0 1 0 1H8.5V11.5a.5.5 0 0 1-1 0V8.5H4.5a.5.5 0 0 1 0-1H7.5V4.5A.5.5 0 0 1 8 4z" />
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z" />
                  </svg>
                </button>

                {/* Add Product Button */}
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="text-dark text-decoration-none p-2 mx-1 btn btn-link"
                  title="Add Product"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5V7.5H11.5a.5.5 0 0 1 0 1H8.5V11.5a.5.5 0 0 1-1 0V8.5H4.5a.5.5 0 0 1 0-1H7.5V4.5A.5.5 0 0 1 8 4z" />
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z" />
                  </svg>
                </button>

                {/* Add Currency Button */}
              <button
                onClick={() => setShowAddCurrency(true)}
                className="text-dark text-decoration-none p-2 mx-1 btn btn-link"
                title="Add Currency"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
                  <path d="M0 5a5 5 0 0 0 4.027 4.905 6.5 6.5 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05q-.001-.07.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.5 3.5 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98q-.004.07-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5m16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674z"/>
                </svg>
              </button>

                {/* Profile */}
                <Link href="/profile" className="text-dark text-decoration-none p-2 mx-1" title="Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                  </svg>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              isMounted && (
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
              )
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
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
      <AddProductModal show={showAddProduct} onHide={() => setShowAddProduct(false)} />
      <AddCategoryModal show={showAddCategory} onHide={() => setShowAddCategory(false)} />
      {showAddCurrency && (<AddCurrencyModal onClose={() => setShowAddCurrency(false)} />)}
    </>
  );
}
