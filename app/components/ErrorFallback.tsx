interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorFallback = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorFallbackProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 p-8 text-center rounded-2xl bg-red-50 border border-red-100"
    >
      <img src="/icons/cross.svg" alt="Error" className="w-10 h-10 opacity-60" />
      <div>
        <h3 className="font-semibold text-red-700 text-lg">{title}</h3>
        <p className="text-red-500 text-sm mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
