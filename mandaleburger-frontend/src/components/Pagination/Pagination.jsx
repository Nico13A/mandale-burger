const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const maxButtons = 5;
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + maxButtons - 1, totalPages);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border transition-colors duration-200 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gris-boton text-white hover:bg-gris-boton-hover cursor-pointer"
        }`}
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border cursor-pointer transition-colors duration-200 ${
            page === currentPage
              ? "bg-orange-400 text-white border-orange-400"
              : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border transition-colors duration-200 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gris-boton text-white hover:bg-gris-boton-hover cursor-pointer"
        }`}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;



