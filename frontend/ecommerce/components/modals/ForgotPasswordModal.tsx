import { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import API from "@/services/apiConfig";

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
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ prevent double submission

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // ✅ ignore if already submitting
    setLoading(true);
    setIsSubmitting(true);

    try {
      await API.sendForgotPasswordOTP(email);

      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "We’ve sent an OTP to your registered email and phone. You have 5 minutes to use it.",
        confirmButtonColor: "#3085d6"
      });

      setStep(2);
      setTimeLeft(300);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.detail || "Failed to send OTP. Please try again."
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // ✅ ignore if already submitting
    if (timeLeft <= 0) {
      Swal.fire({
        icon: "warning",
        title: "OTP Expired",
        text: "Your OTP has expired. Please request a new one."
      });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      await API.verifyOTPAndResetPassword({
        email,
        otp,
        new_password: newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "You can now log in with your new password.",
        confirmButtonColor: "#3085d6"
      }).then(() => {
        onSwitchToLogin();
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: err.response?.data?.detail || "Password reset failed. Please try again."
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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
            <h5 className="modal-title">
              {step === 1 ? "Forgot Your Password?" : "Verify OTP & Set New Password"}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
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
                  disabled={loading || isSubmitting}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                {timeLeft > 0 && (
                  <p className="text-center text-muted">
                    OTP expires in <strong>{formatTime(timeLeft)}</strong>
                  </p>
                )}
                {timeLeft <= 0 && (
                  <p className="text-center text-danger">
                    OTP expired. Please request a new one.
                  </p>
                )}

                <div className="mb-3 d-flex align-items-center gap-2">
                  <FaKey className="text-muted" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={timeLeft <= 0}
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
                    disabled={timeLeft <= 0}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading || isSubmitting || timeLeft <= 0}
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
              disabled={loading || isSubmitting}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}