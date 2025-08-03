// src/components/modals/RegisterModal.tsx

import { useState } from "react";
import { X } from "lucide-react";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mb-4 text-center">
            Account created! You can now log in.
          </p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded p-2 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full p-2 rounded"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
