interface LoadingSpinnerProps {
  label?: string;
  imageUrl?: string;
  imageClassName?: string;
}

const LoadingSpinner = ({
  label = "Loading...",
  imageUrl = "/images/resume-scan-2.gif",
  imageClassName = "w-[160px]",
}: LoadingSpinnerProps) => {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3"
    >
      <img src={imageUrl} alt="" aria-hidden="true" className={imageClassName} />
      <p className="text-sm text-gray-400 animate-pulse">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
