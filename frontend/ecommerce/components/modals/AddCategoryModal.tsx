import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../services/apiConfig";

interface AddCategoryModalProps {
  show: boolean;
  onHide: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ show, onHide }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      await API.addCategory({
        name: categoryName,
        description: categoryDescription,
      });

      toast.success("Category added successfully");
      setCategoryName("");
      setCategoryDescription("");
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
      setCategoryName("");
      setCategoryDescription("");
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
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label style={{ width: "120px" }}>Description:</label>
            <textarea
              className="form-control"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-100">
            Add Category
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
