// components/Sidebar.tsx
import { useState } from "react";

export default function Sidebar({ onFilterChange, currentFilters }: any) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [category, setCategory] = useState("");

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

  return (
    <div className="col-md-3 bg-light p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold">Filters</h5>
        <button className="btn btn-sm text-primary" onClick={handleClearFilters}>Clear All</button>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Search Products</h6>
        <input
          type="text"
          placeholder="Search by name, brand, or description..."
          className="form-control"
        />
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Category</h6>
        <select 
          className="form-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option>Electronics</option>
          <option>Clothing</option>
        </select>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Price Range</h6>
        <div className="d-flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange}
          />
          <input
            type="number"
            placeholder="Max"
            className="form-control"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange}
          />
        </div>
      </div>
      
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
        <label className="form-check-label">
          In Stock Only
        </label>
      </div>
    </div>
  );
}