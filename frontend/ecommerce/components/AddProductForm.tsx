import { useState, useEffect } from "react";
import API from "../services/apiConfig";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_percent: "",
    tags: "",
    stock: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    if (image) form.append("image", image);

    try {
      await API.addProduct(form);
      setMessage("Product added successfully");
      setFormData({
        name: "",
        description: "",
        price: "",
        discount_percent: "",
        tags: "",
        stock: "",
        category: "",
      });
      setImage(null);
    } catch (error) {
      setMessage("Error adding product");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      {message && <p className="mb-4 text-sm text-center text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          name="discount_percent"
          type="number"
          placeholder="Discount (%)"
          className="w-full border p-2 rounded"
          value={formData.discount_percent}
          onChange={handleChange}
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="w-full border p-2 rounded"
          value={formData.stock}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          value={formData.tags}
          onChange={handleChange}
        />
        <select
          name="category"
          className="w-full border p-2 rounded"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
