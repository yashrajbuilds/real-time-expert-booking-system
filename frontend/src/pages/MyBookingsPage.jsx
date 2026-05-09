import { useEffect, useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../context/ToastContext';
import { fetchBookings, updateBookingStatus } from '../services/bookingService';
import { formatDate } from '../utils/format';

const statusTabs = ['All', 'Pending', 'Confirmed', 'Completed'];
const updatableStatuses = ['Pending', 'Confirmed', 'Completed'];

const MyBookingsPage = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingBookingId, setUpdatingBookingId] = useState('');

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchBookings({
          page,
          limit: 8,
          status: statusFilter === 'All' ? '' : statusFilter
        });

        setBookings(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [page, statusFilter]);

  const handleStatusChange = async (bookingId, nextStatus) => {
    const booking = bookings.find((item) => item._id === bookingId);
    if (!booking || booking.status === nextStatus) return;

    try {
      setUpdatingBookingId(bookingId);
      const response = await updateBookingStatus(bookingId, nextStatus);
      const updatedBooking = response.data;

      setBookings((currentBookings) => {
        if (statusFilter !== 'All' && updatedBooking.status !== statusFilter) {
          return currentBookings.filter((item) => item._id !== bookingId);
        }

        return currentBookings.map((item) => (item._id === bookingId ? updatedBooking : item));
      });

      showToast(`Booking marked as ${updatedBooking.status}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingBookingId('');
    }
  };

  const totalCount = useMemo(() => bookings.length, [bookings]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-ink-950 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">My Bookings</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Keep track of your sessions</h2>
            <p className="mt-2 text-sm leading-6 text-ink-900/60">You can check booking status, notes, and expert details from here.</p>
          </div>
          <div className="inline-flex w-fit rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white">
            {totalCount} bookings found
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 overflow-x-auto pb-1">
          {statusTabs.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 text-ink-950 hover:bg-brand-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-5">
        {loading ? <Loader label="Loading your bookings..." /> : null}
        {error ? <ErrorMessage message={error} onRetry={() => window.location.reload()} /> : null}

        {!loading && !error && bookings.length ? (
          <div className="grid gap-5">
            {bookings.map((booking) => {
              const expert = booking.expertId || {};

              return (
                <article key={booking._id} className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-ink-950 shadow-soft sm:p-7">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 sm:text-sm">{expert.category || 'Expert Session'}</p>
                      <h3 className="mt-2 break-words text-xl font-semibold sm:text-2xl">{expert.name || 'Unknown Expert'}</h3>
                      <p className="mt-1 text-sm text-ink-900/60">Booked by {booking.customerName}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <StatusBadge status={booking.status} />
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-900/55">
                        Update status
                      </label>
                      <select
                        value={booking.status}
                        onChange={(event) => handleStatusChange(booking._id, event.target.value)}
                        disabled={updatingBookingId === booking._id}
                        className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-ink-950 focus:border-brand-500 focus:ring-brand-500 sm:w-[160px]"
                      >
                        {updatableStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <Detail label="Booking Date" value={formatDate(booking.bookingDate)} />
                    <Detail label="Time Slot" value={booking.timeSlot} />
                    <Detail label="Phone" value={booking.phone} />
                  </div>

                  <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-900/45">Notes</p>
                    <p className="mt-2 text-sm leading-7 text-ink-900/70">{booking.notes || 'No notes were added for this booking.'}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {!loading && !error && !bookings.length ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/95 p-10 text-center text-ink-950 shadow-soft">
            <h3 className="text-xl font-semibold">No bookings yet</h3>
            <p className="mt-2 text-sm text-ink-900/60">Your bookings will show up here after you create one.</p>
          </div>
        ) : null}
      </section>

      {!loading && !error ? (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-50 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.22em] text-ink-900/45">{label}</p>
    <p className="mt-2 text-sm font-semibold text-ink-950">{value}</p>
  </div>
);

export default MyBookingsPage;
