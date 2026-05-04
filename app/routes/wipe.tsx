import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/services/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [wiping, setWiping] = useState(false);

  const loadFiles = async () => {
    const result = (await fs.readDir("./")) as FSItem[] | undefined;
    setFiles(result ?? []);
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/wipe");
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleWipe = async () => {
    if (!window.confirm("This will delete ALL your resume data. Are you sure?")) return;
    setWiping(true);
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    await loadFiles();
    setWiping(false);
  };

  if (isLoading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">App Data Manager</h1>
      <p className="text-sm text-gray-500 mb-6">
        Logged in as <strong>{auth.user?.username}</strong>
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Stored files ({files.length})</p>
        {files.length === 0 ? (
          <p className="text-sm text-gray-400">No files found.</p>
        ) : (
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.id} className="text-sm text-gray-600 font-mono truncate">
                {f.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleWipe}
        disabled={wiping || files.length === 0}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
      >
        {wiping ? "Wiping…" : "Wipe All App Data"}
      </button>
    </main>
  );
};

export default WipeApp;
