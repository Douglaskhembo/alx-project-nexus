import { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col">
      <div className="relative w-full pb-[100%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover rounded"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <h3 className="font-semibold mt-3">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-lg">${product.price}</span>
        {!product.inStock ? (
          <span className="text-red-500 text-sm">Out of Stock</span>
        ) : (
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
