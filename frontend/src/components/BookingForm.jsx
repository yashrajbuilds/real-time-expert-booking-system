import { useEffect, useMemo, useState } from 'react';

const emailPattern = /^\S+@\S+\.\S+$/;
const phonePattern = /^[0-9+()\-\s]{7,20}$/;

const BookingForm = ({ expert, initialValues = {}, onSubmit, submitting = false }) => {
  const availableSlots = useMemo(() => {
    if (!expert?.availableSlots) return [];
    return expert.availableSlots;
  }, [expert]);

  const availableDates = useMemo(() => {
    const uniqueDates = new Set(availableSlots.map((slot) => slot.bookingDate));
    return Array.from(uniqueDates).sort();
  }, [availableSlots]);

  const [values, setValues] = useState({
    customerName: '',
    email: '',
    phone: '',
    bookingDate: '',
    timeSlot: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues((current) => {
      const nextBookingDate =
        (current.bookingDate && availableDates.includes(current.bookingDate) && current.bookingDate) ||
        (initialValues.bookingDate && availableDates.includes(initialValues.bookingDate) && initialValues.bookingDate) ||
        availableDates[0] ||
        '';

      const slotsForDate = availableSlots.filter((slot) => slot.bookingDate === nextBookingDate);
      const currentSlot = slotsForDate.find((slot) => slot.timeSlot === current.timeSlot && !slot.isBooked);
      const initialSlot = slotsForDate.find((slot) => slot.timeSlot === initialValues.timeSlot && !slot.isBooked);
      const nextTimeSlot = currentSlot?.timeSlot || initialSlot?.timeSlot || '';

      if (current.bookingDate === nextBookingDate && current.timeSlot === nextTimeSlot) {
        return current;
      }

      return {
        ...current,
        bookingDate: nextBookingDate,
        timeSlot: nextTimeSlot
      };
    });
  }, [availableDates, availableSlots, initialValues.bookingDate, initialValues.timeSlot]);

  const selectedSlots = availableSlots.filter((slot) => slot.bookingDate === values.bookingDate);

  const updateField = (field, fieldValue) => {
    setValues((current) => ({ ...current, [field]: fieldValue }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.customerName.trim()) nextErrors.customerName = 'Please add your name';
    if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Please check your email address';
    if (!phonePattern.test(values.phone.trim())) nextErrors.phone = 'Please check your phone number';
    if (!values.bookingDate) nextErrors.bookingDate = 'Please pick a date';
    if (!values.timeSlot) nextErrors.timeSlot = 'Please pick a time slot';
    if (values.bookingDate && values.timeSlot) {
      const matchingSlot = availableSlots.find(
        (slot) => slot.bookingDate === values.bookingDate && slot.timeSlot === values.timeSlot
      );

      if (!matchingSlot) {
        nextErrors.timeSlot = 'That slot is not available right now';
      } else if (matchingSlot.isBooked) {
        nextErrors.timeSlot = 'That slot was just booked. Please choose another one';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white p-6 shadow-soft lg:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Booking details</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink-950">Fill in your booking info</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Name" error={errors.customerName}>
          <input
            value={values.customerName}
            onChange={(event) => updateField('customerName', event.target.value)}
            className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500"
            placeholder="Enter your full name"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone Number" error={errors.phone}>
          <input
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500"
            placeholder="+1 555 123 4567"
          />
        </Field>

        <Field label="Booking Date" error={errors.bookingDate}>
          <select
            value={values.bookingDate}
            onChange={(event) => {
              const nextDate = event.target.value;
              const nextSlot = availableSlots.find((slot) => slot.bookingDate === nextDate && !slot.isBooked)?.timeSlot || '';
              updateField('bookingDate', nextDate);
              updateField('timeSlot', nextSlot);
            }}
            className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-ink-950 focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="">Choose a date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Time Slot" error={errors.timeSlot}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedSlots.length ? (
            selectedSlots.map((slot) => {
              const isDisabled = slot.isBooked;
              const isActive = values.timeSlot === slot.timeSlot;

              return (
                <button
                  key={`${slot.bookingDate}-${slot.timeSlot}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => updateField('timeSlot', slot.timeSlot)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-slate-50 text-ink-950 hover:border-brand-500'
                  } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <span className="block">{slot.timeSlot}</span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.2em] text-ink-900/45">
                    {isDisabled ? 'Booked' : 'Open'}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-ink-900/60 sm:col-span-2 lg:col-span-3">
              Pick a date to see available slots.
            </div>
          )}
        </div>
      </Field>

      <Field label="Notes" error={errors.notes}>
        <textarea
          rows={4}
          value={values.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500"
          placeholder="Add a short note if you want to share anything before the session"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Booking your session...' : 'Confirm booking'}
      </button>
    </form>
  );
};

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-ink-950">{label}</span>
    {children}
    {error ? <span className="mt-2 block text-xs font-medium text-red-600">{error}</span> : null}
  </label>
);

export default BookingForm;
