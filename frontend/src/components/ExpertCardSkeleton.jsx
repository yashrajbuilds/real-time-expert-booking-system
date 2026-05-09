const ExpertCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-white p-4 shadow-soft sm:p-5">
      <div className="h-4 w-32 rounded-full bg-slate-200" />
      <div className="mt-4 h-6 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 rounded-full bg-slate-200" />
        <div className="h-3 rounded-full bg-slate-200" />
        <div className="h-3 w-5/6 rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-14 rounded-2xl bg-slate-100" />
        <div className="h-14 rounded-2xl bg-slate-100" />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="h-11 flex-1 rounded-full bg-slate-100" />
        <div className="h-11 flex-1 rounded-full bg-slate-200" />
      </div>
    </div>
  );
};

export default ExpertCardSkeleton;
