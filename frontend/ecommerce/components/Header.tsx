import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from "../features/authSlice";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FaUserPlus, FaBox, FaListAlt, FaDollarSign, FaSignOutAlt, FaUserCircle, FaKey } from "react-icons/fa";

const LoginModal = dynamic(() => import("./modals/LoginModal"));
const RegisterModal = dynamic(() => import("./modals/RegisterModal"));
const AddProductModal = dynamic(() => import("./modals/AddProductModal"));
const AddCategoryModal = dynamic(() => import("./modals/AddCategoryModal"));
const AddCurrencyModal = dynamic(() => import("./modals/AddCurrencyModal"));
const PasswordResetModal = dynamic(() => import("./modals/PasswordResetModal"));
const ForgotPasswordModal = dynamic(() => import("./modals/ForgotPasswordModal"));

interface HeaderProps {
  onToggleCart: () => void;
}

export default function Header({ onToggleCart }: HeaderProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const auth = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleCartClick = () => {
    if (auth.token) {
      if (auth.role === "BUYER") {
        onToggleCart();
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setShowProfileDropdown(false);
  }, [auth.token]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleMenuClick = (action: () => void) => {
    action();
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileDropdown(false);
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
            {isMounted && (
              (!auth.token || auth.role === "BUYER") && (
                <button
                  onClick={handleCartClick}
                  className="position-relative text-dark btn btn-link p-2 mx-1"
                  aria-label="Toggle Cart"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </button>
              )
            )}

            {isMounted && auth.token ? (
              <div className="dropdown">
                <button
                  className="btn btn-link text-dark text-decoration-none dropdown-toggle"
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <FaUserCircle className="me-1" /> Profile
                </button>
                {showProfileDropdown && (
                  <ul
                    className="dropdown-menu show shadow-sm rounded-3"
                    style={{
                      minWidth: "200px",
                      right: 0,
                      left: "auto",
                      padding: "4px 0",
                      backgroundColor: "#fff",
                    }}
                  >
                    {auth.role === "ADMIN" && (
                      <>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleMenuClick(() => setShowRegister(true))}
                          >
                            <FaUserPlus /> Add User
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleMenuClick(() => setShowAddProduct(true))}
                          >
                            <FaBox /> Add Product
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleMenuClick(() => setShowAddCategory(true))}
                          >
                            <FaListAlt /> Add Category
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleMenuClick(() => setShowAddCurrency(true))}
                          >
                            <FaDollarSign /> Add Currency
                          </button>
                        </li>
                      </>
                    )}
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => handleMenuClick(() => setShowPasswordReset(true))}
                      >
                        <FaKey /> Reset Password
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
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
          onSwitchToForgotPassword={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
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
      <AddProductModal
        show={showAddProduct}
        onHide={() => setShowAddProduct(false)}
      />
      <AddCategoryModal
        show={showAddCategory}
        onHide={() => setShowAddCategory(false)}
      />
      {showAddCurrency && (
        <AddCurrencyModal onClose={() => setShowAddCurrency(false)} />
      )}
      {showPasswordReset && (
        <PasswordResetModal onClose={() => setShowPasswordReset(false)} />
      )}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
          onSwitchToLogin={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
