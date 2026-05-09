import { Link } from 'react-router-dom';

const ExpertCard = ({ expert }) => {
  const availableCount = Array.isArray(expert.availableSlots)
    ? expert.availableSlots.filter((slot) => !slot.isBooked).length
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-700 sm:text-xs">{expert.category}</p>
          <h3 className="mt-2 break-words text-lg font-semibold text-ink-950 sm:text-xl">{expert.name}</h3>
        </div>
        <div className="shrink-0 rounded-2xl bg-amber-500/10 px-3 py-2 text-right">
          <p className="text-sm font-bold text-amber-500">★ {Number(expert.rating || 0).toFixed(1)}</p>
          <p className="text-xs text-ink-900/55">Score</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-900/70">{expert.bio}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-ink-900/75 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.2em] text-ink-900/45">Experience</span>
          <span className="mt-1 block font-semibold">{expert.experience}+ years</span>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.2em] text-ink-900/45">Available</span>
          <span className="mt-1 block font-semibold">{availableCount} slots</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/experts/${expert._id}`}
          className="inline-flex w-full flex-1 items-center justify-center rounded-full border border-ink-900/10 px-4 py-3 text-sm font-semibold text-ink-950 transition hover:border-brand-500 hover:text-brand-700 sm:w-auto"
        >
          View profile
        </Link>
        <Link
          to={`/book/${expert._id}`}
          className="inline-flex w-full flex-1 items-center justify-center rounded-full bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
        >
          Book now
        </Link>
      </div>
    </article>
  );
};

export default ExpertCard;
