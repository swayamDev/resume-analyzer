import { useEffect, useState } from "react";
import { usePuterStore } from "~/services/puter";

export function useResumes() {
  const { kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = (await kv.list("resume:*", true)) as KVItem[] | undefined;
      const parsed: Resume[] = (items ?? [])
        .map((item) => {
          try {
            return JSON.parse(item.value) as Resume;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as Resume[];

      // Sort by createdAt descending (newest first)
      parsed.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setResumes(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { resumes, isLoading, error, reload: load };
}
