import { useState } from "react";
import API from "../../services/apiConfig";

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.registerUser({ email, username, password });
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      {/* Updated: Replaced modal-dialog-centered with modal-dialog-upper */}
      <div className="modal-dialog modal-dialog-upper" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Register</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            {success && (
              <p className="text-success text-center">
                Account created! You can now log in.
              </p>
            )}
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
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
              >
                Register
              </button>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="btn btn-link p-0"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}