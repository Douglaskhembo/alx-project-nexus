import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../services/apiConfig";

const AddProductModal = ({ show, onHide }: { show: boolean; onHide: () => void }) => {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductImage(null);
    setCategoryId("");
    // setBrand("");
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
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDesc);
    formData.append("initial_price", productPrice);
    formData.append("category_id", categoryId);
    // formData.append("brand", brand);
    formData.append("stock", stockQuantity);
    formData.append("status", status);
    formData.append("tags", tags);

    if (enableDiscount && discount) {
      formData.append("discount_amount", discount);
    }

    if (productImage) {
      formData.append("image", productImage);
    }
    console.log("FormData being sent:");
for (let pair of formData.entries()) {
  console.log(`${pair[0]}: ${pair[1]}`);
}


    try {
      await API.addProduct(formData);
      toast.success("Product added successfully");
      resetForm();
      onHide();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
      resetForm();
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
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>

          {/* <div className="form-group mb-3">
            <label>Brand</label>
            <input
              type="text"
              className="form-control"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div> */}

          <div className="form-group mb-3">
            <label>Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Status</label>
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

          <div className="form-group mb-3">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label>Category</label>
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
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>

          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="enableDiscount"
              checked={enableDiscount}
              onChange={(e) => setEnableDiscount(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="enableDiscount">
              Enable Discount
            </label>
          </div>

          {enableDiscount && (
            <div className="form-group mb-3">
              <label>Discount Amount</label>
              <input
                type="number"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          )}

          <div className="form-group mb-4">
            <label>Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" className="w-100">
            Add Product
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
