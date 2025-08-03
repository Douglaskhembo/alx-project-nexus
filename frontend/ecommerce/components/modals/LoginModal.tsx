// src/components/modals/LoginModal.tsx

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/index";
import { login } from "../../features/authSlice";
import { X } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
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
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
          <p className="mt-2">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
