import { useEffect, useState } from "react";
import { usePuterStore } from "~/services/puter";

interface ResumeDetail {
  feedback: Feedback | null;
  imageUrl: string;
  resumeUrl: string;
  companyName?: string;
  jobTitle?: string;
  isLoading: boolean;
  error: string | null;
}

export function useResumeDetail(id: string | undefined): ResumeDetail {
  const { fs, kv } = usePuterStore();
  const [state, setState] = useState<ResumeDetail>({
    feedback: null,
    imageUrl: "",
    resumeUrl: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    let resumeObjectUrl = "";
    let imageObjectUrl = "";

    const load = async () => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const raw = await kv.get(`resume:${id}`);
        if (!raw) throw new Error("Resume not found");

        const data = JSON.parse(raw) as Resume;

        const [resumeBlob, imageBlob] = await Promise.all([
          fs.read(data.resumePath),
          fs.read(data.imagePath),
        ]);

        if (resumeBlob) {
          resumeObjectUrl = URL.createObjectURL(new Blob([resumeBlob], { type: "application/pdf" }));
        }
        if (imageBlob) {
          imageObjectUrl = URL.createObjectURL(imageBlob);
        }

        setState({
          feedback: data.feedback as Feedback,
          imageUrl: imageObjectUrl,
          resumeUrl: resumeObjectUrl,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load resume",
        }));
      }
    };

    load();

    return () => {
      if (resumeObjectUrl) URL.revokeObjectURL(resumeObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return state;
}
