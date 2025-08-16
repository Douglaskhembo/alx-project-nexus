import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import API from "../../services/apiConfig";

interface AddCategoryModalProps {
  show: boolean;
  onHide: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ show, onHide }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Category name is required.",
      });
      return;
    }

    setLoading(true);
    try {
      await API.addCategory({
        name: categoryName,
        description: categoryDescription,
      });

      Swal.fire({
        icon: "success",
        title: "Category Added",
        text: "The category has been added successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
      });

      setCategoryName("");
      setCategoryDescription("");
      onHide();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add category. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Name:</label>
            <input
              type="text"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Description:</label>
            <textarea
              className="form-control"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
