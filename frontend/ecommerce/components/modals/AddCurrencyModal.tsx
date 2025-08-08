import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/apiConfig";

interface AddCurrencyModalProps {
  onClose: () => void;
}

export default function AddCurrencyModal({ onClose }: AddCurrencyModalProps) {
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.createCurrency({
        country_name: countryName,
        country_code: countryCode,
        currency_code: currencyCode,
        currency_name: currencyName,
      });

      toast.success("Currency added successfully!", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });

      setCountryName("");
      setCountryCode("");
      setCurrencyCode("");
      setCurrencyName("");
      setError(null);

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add currency");
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
            <h5 className="modal-title">Add Currency</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleAddCurrency}>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "140px" }}>Country Name:</label>
                <input
                  type="text"
                  placeholder="Kenya"
                  className="form-control"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "140px" }}>Country Code:</label>
                <input
                  type="text"
                  placeholder="KE"
                  className="form-control"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "140px" }}>Currency Code:</label>
                <input
                  type="text"
                  placeholder="KES"
                  className="form-control"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-2">
                <label style={{ width: "140px" }}>Currency Name:</label>
                <input
                  type="text"
                  placeholder="Kenyan Shilling"
                  className="form-control"
                  value={currencyName}
                  onChange={(e) => setCurrencyName(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Currency"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
