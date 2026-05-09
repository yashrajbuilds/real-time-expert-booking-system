import { useEffect, useMemo, useState } from 'react';
import ExpertCard from '../components/ExpertCard';
import ExpertCardSkeleton from '../components/ExpertCardSkeleton';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { fetchExperts } from '../services/expertService';
import { buildCategoryList } from '../utils/format';
import { useDebounce } from '../hooks/useDebounce';

const HomePage = () => {
  const [experts, setExperts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(['All Categories']);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search, 350);
  const apiCategory = category === 'All Categories' ? '' : category;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    const loadExpertCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await fetchExperts({ page: 1, limit: 100 });
        setCategoryOptions(buildCategoryList(response.data));
      } catch (err) {
        setCategoryOptions(['All Categories']);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadExpertCategories();
  }, []);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchExperts({
          page,
          limit: 9,
          search: debouncedSearch,
          category: apiCategory
        });

        setExperts(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, [page, debouncedSearch, apiCategory]);

  const stats = useMemo(
    () => [
      { label: 'Experts', value: 'Profile listings' },
      { label: 'Bookings', value: 'Quick flow' },
      { label: 'Updates', value: 'Live slot sync' }
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-100">
              Real-Time Expert Session Booking
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find an expert and book a slot in minutes.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8 lg:text-lg">
              Search by name, filter by category, and reserve a session in a few clicks. Slots update in near real-time so you can avoid double-booking.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-ink-900/60 p-4 shadow-glow animate-float sm:p-5">
            <div className="grid gap-4">
              <SearchBar value={search} onChange={setSearch} placeholder="Search by expert name..." />
              <CategoryFilter value={category} onChange={setCategory} options={categoryOptions} />
            </div>
            <p className="mt-4 text-sm text-white/55">
              {categoryLoading ? 'Getting categories...' : `${Math.max(categoryOptions.length - 1, 0)} categories found`}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        {error ? <ErrorMessage message={error} onRetry={() => window.location.reload()} /> : null}

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ExpertCardSkeleton key={index} />
            ))}
          </div>
        ) : experts.length ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {experts.map((expert) => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </div>

            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/95 p-8 text-center text-ink-950 shadow-soft">
            <h3 className="text-xl font-semibold">No experts found</h3>
            <p className="mt-2 text-sm text-ink-900/60">Try a different name or category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
