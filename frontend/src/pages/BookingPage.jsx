import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { createBooking } from '../services/bookingService';
import { fetchExpertById } from '../services/expertService';

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

const BookingPage = () => {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    let isActive = true;
    hasLoadedRef.current = false;
    isFetchingRef.current = false;
    setExpert(null);
    setError('');

    // Keep expert and slot info fresh while user is on this page.
    const loadExpert = async () => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;

      try {
        if (!hasLoadedRef.current) setLoading(true);
        const response = await fetchExpertById(expertId);
        if (!isActive) return;

        const nextExpert = response.data;
        setExpert((currentExpert) => (isSameExpert(currentExpert, nextExpert) ? currentExpert : nextExpert));
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
  }, [expertId]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await createBooking({
        expertId,
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        bookingDate: values.bookingDate,
        timeSlot: values.timeSlot,
        notes: values.notes
      });

      showToast('Booking successful', 'success');
      navigate('/bookings');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Loader label="Loading booking form..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <aside className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-ink-950 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Book a session</p>
        <h2 className="mt-3 text-3xl font-semibold">Confirm the slot you want</h2>
        <p className="mt-4 leading-7 text-ink-900/70">
          The slot you picked is pre-filled below. Add your details and confirm the booking.
        </p>

        {expert ? (
          <div className="mt-8 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-ink-950">{expert.name}</p>
            <p className="mt-1 text-sm text-ink-900/60">{expert.category}</p>
            <p className="mt-4 text-sm leading-6 text-ink-900/70">{expert.bio}</p>
          </div>
        ) : null}
      </aside>

      <BookingForm
        expert={expert}
        initialValues={{
          bookingDate: searchParams.get('date') || '',
          timeSlot: searchParams.get('timeSlot') || ''
        }}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BookingPage;
