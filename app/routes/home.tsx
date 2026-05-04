import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorFallback from "~/components/ErrorFallback";
import { usePuterStore } from "~/services/puter";
import { useResumes } from "~/hooks/useResumes";

export function meta() {
  return [
    { title: "Analytiq | AI Resume Analyzer" },
    {
      name: "description",
      content: "Track your resume applications and get AI-powered ATS scores and improvement tips.",
    },
    { property: "og:title", content: "Analytiq | AI Resume Analyzer" },
    {
      property: "og:description",
      content: "Get AI-powered ATS scores and improvement tips for your resume.",
    },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const { resumes, isLoading, error, reload } = useResumes();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-12">
          <h1>Track Your Applications &amp; Resume Ratings</h1>
          {!isLoading && (
            <h2>
              {resumes.length === 0
                ? "No resumes yet. Upload your first to get AI-powered feedback."
                : "Review your submissions and check AI-powered feedback."}
            </h2>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner label="Loading your resumes..." />
          </div>
        )}

        {!isLoading && error && (
          <div className="w-full max-w-xl mx-auto">
            <ErrorFallback
              title="Failed to load resumes"
              message={error}
              onRetry={reload}
            />
          </div>
        )}

        {!isLoading && !error && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!isLoading && !error && resumes.length === 0 && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <Link to="/upload" className="primary-button w-fit text-base font-semibold px-8 py-3">
              Upload Your First Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
