import { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import API from "@/services/apiConfig";
import { useAppSelector } from "../../hooks";

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordModal({ onClose, onSwitchToLogin }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await API.sendForgotPasswordOTP(email);
      alert("OTP has been sent to your registered email and registered phone.");
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError("Failed to send OTP. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await API.verifyOTPAndResetPassword({
        email,
        otp,
        new_password: newPassword,
      });
      alert("Password reset successful! You can now log in with your new password.");
      onSwitchToLogin();
    } catch (err: any) {
      console.error(err);
      setError("Invalid OTP or password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-upper" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {step === 1 ? "Forgot Your Password?" : "Verify OTP & Set New Password"}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}

            {step === 1 && (
              <form onSubmit={handleSendOTP}>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <label style={{ width: "120px" }}>Email:</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <FaKey className="text-muted" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <FaKey className="text-muted" />
                  <input
                    type="password"
                    placeholder="New password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="btn btn-link p-0"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
