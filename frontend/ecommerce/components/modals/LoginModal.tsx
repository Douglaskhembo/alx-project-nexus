import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/index";
import { login } from "../../features/authSlice";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export default function LoginModal({
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: LoginModalProps) {
  console.log("LoginModal props:", { onClose, onSwitchToRegister, onSwitchToForgotPassword });

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-upper" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sign In</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "120px" }}>Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "120px" }}>Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center flex-column">
          <a
            href="#"
            className="text-decoration-none"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToForgotPassword();
            }}
          >
            Forgot Password?
          </a>
            <p className="mt-2 mb-0">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="btn btn-link p-0"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
