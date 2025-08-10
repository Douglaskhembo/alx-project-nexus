import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/apiConfig";
import { useAppSelector } from "../../hooks";

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const auth = useAppSelector((state) => state.auth);
  const isAdmin = auth?.role === "ADMIN";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (isAdmin) {
      await API.createSellerOrAdmin({
        name,
        email,
        username,
        password,
        phone_number,
        role,
      });
      toast.success("User added successfully!");
    } else {
      await API.registerUser({
        name,
        email,
        username,
        password,
        phone_number,
      });
      toast.success("Account created successfully!");
    }
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setPhoneNumber("");
    setRole("BUYER");
    setError(null);
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
            <h5 className="modal-title">{isAdmin ? "Add User" : "Register"}</h5>
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
              {isAdmin && (
                <div className="mb-3 d-flex align-items-center gap-2">
                  <label style={{ width: "120px" }}>Role:</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
              )}
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
                {loading ? (isAdmin ? "Adding..." : "Registering...") : isAdmin ? "Add User" : "Register"}
              </button>
            </form>
          </div>
          {!isAdmin && (
            <div className="modal-footer d-flex justify-content-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="btn btn-link p-0"
                disabled={loading}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
