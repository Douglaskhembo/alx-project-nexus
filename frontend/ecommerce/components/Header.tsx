export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">NexusMarket</h1>
      <input
        type="text"
        placeholder="Search products..."
        className="p-2 rounded text-black w-1/2"
      />
      <div className="flex space-x-4">
        <button>❤️</button>
        <button>🛒</button>
        <button>👤</button>
      </div>
    </header>
  );
}
