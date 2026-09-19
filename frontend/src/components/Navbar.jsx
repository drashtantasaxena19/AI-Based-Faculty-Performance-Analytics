export default function Navbar({ page, setPage }) {
  const pages = ["Home", "Evaluate Faculty", "History", "Evaluation Graphs"];

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold">AI-Based Faculty Performance Analytics</h1>
      <div className="space-x-4">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded hover:bg-gray-700 transition-colors ${
              page === p ? "bg-gray-800" : ""
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </nav>
  );
}
