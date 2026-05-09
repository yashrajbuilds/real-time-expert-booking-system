import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { fetchExpertById } from '../services/expertService';
import { formatDate } from '../utils/format';

const POLLING_INTERVAL_MS = 5000;

const areSlotsEqual = (currentSlots = [], nextSlots = []) => {
  if (currentSlots.length !== nextSlots.length) return false;

  return currentSlots.every((currentSlot, index) => {
    const nextSlot = nextSlots[index];
    return (
      currentSlot.bookingDate === nextSlot.bookingDate &&
      currentSlot.timeSlot === nextSlot.timeSlot &&
      Boolean(currentSlot.isBooked) === Boolean(nextSlot.isBooked)
    );
  });
};

const isSameExpert = (currentExpert, nextExpert) => {
  if (!currentExpert || !nextExpert) return false;

  return (
    currentExpert._id === nextExpert._id &&
    currentExpert.name === nextExpert.name &&
    currentExpert.category === nextExpert.category &&
    currentExpert.experience === nextExpert.experience &&
    Number(currentExpert.rating || 0) === Number(nextExpert.rating || 0) &&
    currentExpert.bio === nextExpert.bio &&
    areSlotsEqual(currentExpert.availableSlots || [], nextExpert.availableSlots || [])
  );
};

const ExpertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const selectedSlotRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    selectedSlotRef.current = selectedSlot;
  }, [selectedSlot]);

  useEffect(() => {
    let isActive = true;
    hasLoadedRef.current = false;
    isFetchingRef.current = false;
    setExpert(null);
    setSelectedSlot(null);
    setError('');

    // Fetch expert data on open and then keep it refreshed for slot changes.
    const loadExpert = async () => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;

      try {
        if (!hasLoadedRef.current) setLoading(true);
        const response = await fetchExpertById(id);
        if (!isActive) return;

        const nextExpert = response.data;
        setExpert((currentExpert) => (isSameExpert(currentExpert, nextExpert) ? currentExpert : nextExpert));

        const currentSelectedSlot = selectedSlotRef.current;
        if (currentSelectedSlot) {
          const refreshedSlot = nextExpert.availableSlots?.find(
            (slot) =>
              slot.bookingDate === currentSelectedSlot.bookingDate && slot.timeSlot === currentSelectedSlot.timeSlot
          );

          // If someone else books the selected slot, clear it in this UI.
          if (!refreshedSlot || refreshedSlot.isBooked) {
            setSelectedSlot(null);
          } else {
            setSelectedSlot(refreshedSlot);
          }
        }

        setError('');
        hasLoadedRef.current = true;
      } catch (err) {
        if (!hasLoadedRef.current) {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }

        isFetchingRef.current = false;
      }
    };

    loadExpert();

    const intervalId = window.setInterval(() => {
      loadExpert();
    }, POLLING_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [id]);

  const groupedSlots = useMemo(() => {
    if (!expert?.availableSlots) return [];

    const groups = expert.availableSlots.reduce((accumulator, slot) => {
      if (!accumulator[slot.bookingDate]) accumulator[slot.bookingDate] = [];
      accumulator[slot.bookingDate].push(slot);
      return accumulator;
    }, {});

    return Object.entries(groups).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB));
  }, [expert]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loader label="Loading expert details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!expert) return null;

  const handleBookClick = () => {
    if (!selectedSlot) return;
    navigate(`/book/${expert._id}?date=${encodeURIComponent(selectedSlot.bookingDate)}&timeSlot=${encodeURIComponent(selectedSlot.timeSlot)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-ink-950 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Expert profile</p>
          <h2 className="mt-3 text-3xl font-semibold">{expert.name}</h2>
          <p className="mt-2 text-sm text-ink-900/60">{expert.category}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Experience" value={`${expert.experience}+ years`} />
            <Stat label="Rating" value={`★ ${Number(expert.rating || 0).toFixed(1)}`} />
            <Stat label="Slots" value={`${expert.availableSlots?.length || 0} listed`} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="mt-3 leading-7 text-ink-900/70">{expert.bio}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/book/${expert._id}`}
              className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Book this expert
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-ink-900/10 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:border-brand-500 hover:text-brand-700"
            >
              Back to list
            </Link>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/10 bg-ink-900/90 p-6 shadow-glow sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100/80">Available slots</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Pick a time that works</h3>
            </div>
            <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-100">
              Ready to book
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {groupedSlots.length ? (
              groupedSlots.map(([date, slots]) => (
                <div key={date} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">{formatDate(date)}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {slots.map((slot) => {
                      const isBooked = slot.isBooked;
                      const isActive = selectedSlot?.bookingDate === slot.bookingDate && selectedSlot?.timeSlot === slot.timeSlot;

                      return (
                        <button
                          key={`${slot.bookingDate}-${slot.timeSlot}`}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            isActive ? 'bg-brand-500 text-white' : 'bg-white text-ink-950 hover:bg-brand-100'
                          } ${isBooked ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          {slot.timeSlot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/60">
                No slots have been added for this expert yet.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedSlot}
            onClick={handleBookClick}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedSlot ? `Book ${selectedSlot.timeSlot}` : 'Select a slot to continue'}
          </button>
        </aside>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-50 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.22em] text-ink-900/45">{label}</p>
    <p className="mt-2 text-base font-semibold text-ink-950">{value}</p>
  </div>
);

export default ExpertDetailPage;
