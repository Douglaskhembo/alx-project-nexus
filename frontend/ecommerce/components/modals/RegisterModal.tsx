import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/apiConfig";

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ onClose }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.registerUser({
        name,
        email,
        username,
        password,
        phone_number,
        role: "BUYER",
      });

      // Show popup message
      toast.success("Account created successfully!", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });

      // Clear form
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setPhoneNumber("");
      setError(null);

      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
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
            <h5 className="modal-title">Register</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleRegister}>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "120px" }}>Name:</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "120px" }}>Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
                <label style={{ width: "120px" }}>Phone Number:</label>
                <input
                  type="text"
                  placeholder="070 1234 5678"
                  className="form-control"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-link p-0"
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
