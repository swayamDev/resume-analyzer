import { Link, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { usePuterStore } from "~/services/puter";
import { useResumeDetail } from "~/hooks/useResumeDetail";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorFallback from "~/components/ErrorFallback";

export function meta() {
  return [
    { title: "Analytiq | AI Resume Analyzer" },
    { name: "description", content: "Detailed AI-powered review of your resume." },
  ];
}

const Resume = () => {
  const { auth, isLoading: authLoading } = usePuterStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { feedback, imageUrl, resumeUrl, companyName, jobTitle, isLoading, error } =
    useResumeDetail(id);

  useEffect(() => {
    if (!authLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [authLoading, auth.isAuthenticated, id, navigate]);

  const pageTitle = [companyName, jobTitle].filter(Boolean).join(" | ") || "Resume Review";

  return (
    <main className="!pt-0 min-h-screen">
      <nav className="resume-nav" aria-label="Page navigation">
        <Link to="/" className="back-button" aria-label="Back to homepage">
          <img src="/icons/back.svg" alt="" aria-hidden="true" className="w-2.5 h-2.5" />
          <span className="text-gray-700 text-sm font-semibold">Back to Dashboard</span>
        </Link>
        {(companyName || jobTitle) && (
          <div className="hidden sm:flex flex-col items-end">
            {companyName && (
              <span className="text-sm font-semibold text-gray-800">{companyName}</span>
            )}
            {jobTitle && <span className="text-xs text-gray-500">{jobTitle}</span>}
          </div>
        )}
      </nav>

      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner label="Loading resume…" />
        </div>
      )}

      {!isLoading && error && (
        <div className="max-w-xl mx-auto p-8">
          <ErrorFallback
            title="Failed to load resume"
            message={error}
            onRetry={() => navigate(0)}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
          {/* Left: Resume preview */}
          <section
            className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center max-lg:static max-lg:h-auto"
            aria-label="Resume preview"
          >
            {imageUrl && resumeUrl ? (
              <div className="animate-in fade-in duration-700 gradient-border max-sm:m-0 h-[90%] max-lg:h-auto w-fit max-w-full">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume PDF in new tab"
                  className="block focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-2xl"
                >
                  <img
                    src={imageUrl}
                    className="w-full h-full object-contain rounded-2xl"
                    alt={`Resume preview | ${pageTitle}`}
                  />
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Preview not available
              </div>
            )}
          </section>

          {/* Right: Feedback */}
          <section className="feedback-section" aria-label="AI feedback">
            <h2 className="text-3xl !text-black font-bold">{pageTitle}</h2>

            {feedback ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-700">
                <Summary feedback={feedback} />
                <ATS score={feedback.ATS.score ?? 0} suggestions={feedback.ATS.tips ?? []} />
                <Details feedback={feedback} />
              </div>
            ) : (
              <LoadingSpinner
                label="Preparing feedback…"
                imageUrl="/images/resume-scan-2.gif"
                imageClassName="w-full max-w-xs"
              />
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Resume;
