// Conceptual example
const ProductList = () => {
  // Assume you have an array of products
  const products = [
    { id: 1, name: 'Product 1', price: 99.99, imageUrl: '...' },
    // ... more products
  ];

  return (
    <main className="flex-1 ml-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h5 className="font-bold text-lg mb-2">{product.name}</h5>
              <p className="text-gray-700 font-semibold mb-4">${product.price}</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};