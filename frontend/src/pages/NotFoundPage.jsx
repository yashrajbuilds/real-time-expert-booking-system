import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100/75">404</p>
      <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Page not found</h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
        The page you are looking for does not exist or may have been moved. Use the navigation to head back to the expert list.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
