const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-5 text-center text-red-800 shadow-soft sm:p-6">
      <h3 className="text-lg font-semibold sm:text-xl">Something went wrong</h3>
      <p className="mt-2 text-sm leading-6">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto sm:py-2"
        >
          Reload
        </button>
      ) : null}
    </div>
  );
};

export default ErrorMessage;
