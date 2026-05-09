const SearchBar = ({ value, onChange, placeholder = 'Search by expert name...' }) => {
  return (
    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-soft focus-within:border-brand-500">
      <svg className="h-5 w-5 shrink-0 text-ink-900/40" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M9 15.5C12.5899 15.5 15.5 12.5899 15.5 9C15.5 5.41015 12.5899 2.5 9 2.5C5.41015 2.5 2.5 5.41015 2.5 9C2.5 12.5899 5.41015 15.5 9 15.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent p-0 text-sm text-ink-950 placeholder:text-ink-900/40 focus:ring-0 sm:text-base"
      />
    </label>
  );
};

export default SearchBar;
