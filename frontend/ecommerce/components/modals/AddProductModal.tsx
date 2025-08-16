import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import API from "../../services/apiConfig";

const AddProductModal = ({ show, onHide }: { show: boolean; onHide: () => void }) => {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [currencies, setCurrencies] = useState<{ id: string; currency_code: string }[]>([]);
  const [currencyId, setCurrencyId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const resetForm = () => {
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductImage(null);
    setCategoryId("");
    setCurrencyId("");
    setStockQuantity("");
    setEnableDiscount(false);
    setDiscount("");
    setStatus("active");
    setTags("");
    setError("");
  };

  const fetchCategories = async () => {
    try {
      if (categories.length === 0) {
        const res = await API.getAllCategories();
        setCategories(res.data.results || res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    }
  };

  const fetchCurrencies = async () => {
    try {
      if (currencies.length === 0) {
        const res = await API.getAllCurrencies();
        setCurrencies(res.data.results || res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load currencies.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!categoryId) {
      Swal.fire({
        icon: "error",
        title: "Missing Category",
        text: "Please select a category.",
      });
      setIsSubmitting(false);
      return;
    }
    if (!currencyId) {
      Swal.fire({
        icon: "error",
        title: "Missing Currency",
        text: "Please select a currency.",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDesc);
    formData.append("initial_price", productPrice);
    formData.append("category_id", categoryId);
    formData.append("currency_id", currencyId);
    formData.append("stock", stockQuantity);
    formData.append("status", status);
    formData.append("tags", tags);

    if (enableDiscount && discount) {
      formData.append("discount_amount", discount);
    }

    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      await API.addProduct(formData);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added successfully",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
      });
      resetForm();
      onHide();
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Name:</label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Description:</label>
            <textarea
              className="form-control"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Price:</label>
            <input
              type="number"
              className="form-control"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Stock Quantity:</label>
            <input
              type="number"
              className="form-control"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Status:</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Category:</label>
            <select
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              onFocus={fetchCategories}
              required
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Currency:</label>
            <select
              className="form-control"
              value={currencyId}
              onChange={(e) => setCurrencyId(e.target.value)}
              onFocus={fetchCurrencies}
              required
            >
              <option value="">Select</option>
              {currencies.map((cur) => (
                <option key={cur.id} value={cur.id}>
                  {cur.currency_code}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label
              className="form-check-label"
              htmlFor="enableDiscount"
              style={{ width: "120px" }}
            >
              Enable Discount
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              id="enableDiscount"
              checked={enableDiscount}
              onChange={(e) => setEnableDiscount(e.target.checked)}
            />
          </div>

          {enableDiscount && (
            <div className="mb-3 d-flex align-items-center gap-2">
              <label style={{ width: "120px" }}>Discount Amount:</label>
              <input
                type="number"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Image:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" className="w-100" disabled={isSubmitting} >
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
