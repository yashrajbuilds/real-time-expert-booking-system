const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-ink-950 transition disabled:cursor-not-allowed disabled:opacity-40 sm:py-2"
      >
        Previous page
      </button>
      <span className="rounded-full bg-white/10 px-4 py-3 text-center text-sm font-medium text-white/85 sm:py-2">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-ink-950 transition disabled:cursor-not-allowed disabled:opacity-40 sm:py-2"
      >
        Next page
      </button>
    </div>
  );
};

export default Pagination;
