export default function Filters() {
  return (
    <aside className="bg-white rounded-lg shadow p-6 w-full md:w-64">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full mb-4 p-2 border rounded"
      />
      <select className="w-full mb-4 p-2 border rounded">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fitness">Fitness</option>
      </select>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Price Range
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          className="w-full accent-blue-500"
        />
      </div>
      <div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="mr-2" /> In Stock Only
        </label>
      </div>
    </aside>
  );
}
