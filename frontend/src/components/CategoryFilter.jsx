const CategoryFilter = ({ value, options = [], onChange }) => {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-white/80">
      <span className="uppercase tracking-[0.2em] text-white/45">Choose a category</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border-white/10 bg-white px-4 py-3 text-ink-950 shadow-soft focus:border-brand-500 focus:ring-brand-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CategoryFilter;
