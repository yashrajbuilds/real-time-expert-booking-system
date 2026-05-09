import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-500 text-white shadow-glow' : 'text-white/75 hover:bg-white/10 hover:text-white'
  }`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-base font-bold text-white shadow-glow sm:h-11 sm:w-11 sm:text-lg">
            ES
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.65rem] uppercase tracking-[0.28em] text-brand-100/70 sm:text-sm">Expert Booking</p>
            <h1 className="truncate text-base font-semibold text-white sm:text-lg">Expert Sessions</h1>
          </div>
        </Link>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute h-0.5 w-5 rounded-full bg-current opacity-0" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Experts
          </NavLink>
          <NavLink to="/bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-ink-950 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            <NavLink to="/" className={navLinkClass} end onClick={() => setIsMenuOpen(false)}>
              Experts
            </NavLink>
            <NavLink to="/bookings" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              My Bookings
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
