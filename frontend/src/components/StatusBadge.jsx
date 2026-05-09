const statusConfig = {
  Pending: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/20',
  Confirmed: 'bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/20',
  Completed: 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20'
};

const StatusBadge = ({ status }) => {
  const className = statusConfig[status] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';

  return <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{status}</span>;
};

export default StatusBadge;
