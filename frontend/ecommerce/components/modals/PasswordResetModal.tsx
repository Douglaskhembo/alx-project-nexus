import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/apiConfig";
import { useAppSelector } from "../../hooks";

interface PasswordResetModalProps {
  onClose: () => void;
}

export default function PasswordResetModal({ onClose }: PasswordResetModalProps) {
  const auth = useAppSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mismatch",
        text: "New passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      await API.resetPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been updated successfully!",
        cancelButtonText: "OK",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.detail || "Password reset failed.",
      });
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
            <h5 className="modal-title">Reset Password</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handlePasswordReset}>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "160px" }}>Current Password:</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "160px" }}>New Password:</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "160px" }}>Confirm New Password:</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
