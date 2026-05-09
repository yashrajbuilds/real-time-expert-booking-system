const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-center rounded-3xl border border-white/10 bg-white/90 px-4 py-8 text-center text-ink-950 shadow-soft sm:px-6 sm:py-10">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default Loader;
