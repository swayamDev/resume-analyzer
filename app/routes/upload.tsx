import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/services/puter";
import { convertPdfToImage } from "~/services/pdf";
import { generateUUID, safeParseJSON } from "~/utils";
import { prepareInstructions } from "../../constants";

export function meta() {
  return [
    { title: "Analytiq | Upload Resume" },
    { name: "description", content: "Upload your resume and get AI-powered ATS feedback instantly." },
  ];
}

type UploadStatus =
  | { type: "idle" }
  | { type: "processing"; step: string }
  | { type: "error"; message: string };

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<UploadStatus>({ type: "idle" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/upload");
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    const step = (s: string) => setStatus({ type: "processing", step: s });

    try {
      step("Uploading resume…");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Failed to upload resume file.");

      step("Converting to preview image…");
      const imageResult = await convertPdfToImage(file);
      if (!imageResult.file) throw new Error(imageResult.error ?? "Failed to convert PDF to image.");

      step("Uploading preview…");
      const uploadedImage = await fs.upload([imageResult.file]);
      if (!uploadedImage) throw new Error("Failed to upload preview image.");

      const uuid = generateUUID();
      const resumeData: Resume = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
        jobDescription: jobDescription || undefined,
        feedback: null as unknown as Feedback, // will be filled below
        createdAt: Date.now(),
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      step("Analyzing with AI…");
      const response = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );
      if (!response) throw new Error("AI analysis failed. Please try again.");

      const rawText =
        typeof response.message.content === "string"
          ? response.message.content
          : response.message.content[0]?.text ?? "";

      const feedback = safeParseJSON<Feedback>(rawText);
      if (!feedback) throw new Error("AI returned an invalid response. Please try again.");

      resumeData.feedback = feedback;
      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      step("Analysis complete! Redirecting…");
      navigate(`/resume/${uuid}`);
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData(e.currentTarget);
    const companyName = (formData.get("company-name") as string) ?? "";
    const jobTitle = (formData.get("job-title") as string) ?? "";
    const jobDescription = (formData.get("job-description") as string) ?? "";

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const isProcessing = status.type === "processing";
  const hasError = status.type === "error";

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-12">
          <h1>Smart Feedback for Your Dream Job</h1>

          {isProcessing ? (
            <>
              <h2>{status.step}</h2>
              <img src="/images/resume-scan.gif" alt="Analyzing resume…" className="w-full max-w-sm mt-4" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips.</h2>
          )}

          {hasError && (
            <div
              role="alert"
              className="w-full max-w-lg bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
            >
              <strong>Error: </strong>
              {status.message}
              <button
                className="block mt-2 text-xs underline text-red-500 hover:text-red-700"
                onClick={() => setStatus({ type: "idle" })}
              >
                Try again
              </button>
            </div>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-4 w-full max-w-2xl"
              noValidate
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="e.g. Google"
                  id="company-name"
                  autoComplete="organization"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">
                  Job Title <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="e.g. Frontend Engineer"
                  id="job-title"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Paste the job description here for more targeted feedback…"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">
                  Resume (PDF) <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <FileUploader onFileSelect={setFile} selectedFile={file} />
                {!file && (
                  <p className="text-xs text-gray-400">Only PDF files are accepted, max 20 MB.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!file}
                className="primary-button disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                aria-disabled={!file}
              >
                {file ? "Analyze Resume" : "Select a PDF to continue"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
