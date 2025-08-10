import { useState } from "react";
import API from "@/services/apiConfig";

export default function Sidebar({ onFilterChange, currentFilters }: any) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePriceChange = () => {
    onFilterChange({
      ...currentFilters,
      price: {
        min: minPrice,
        max: maxPrice,
      },
    });
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setCategory("");
    onFilterChange({});
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

  return (
    <div className="col-md-3 bg-light p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold">Filters</h5>
        <button className="btn btn-sm text-primary" onClick={handleClearFilters}>Clear All</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
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
      </div>
    </div>
  );
}
