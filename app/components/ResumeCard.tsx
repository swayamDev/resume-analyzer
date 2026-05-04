import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/services/puter";
import ScoreCircle from "~/components/ScoreCircle";
import { formatDate } from "~/utils";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath, createdAt },
}: ResumeCardProps) => {
  const { fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let objectUrl = "";

    const loadImage = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    };

    loadImage();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePath]);

  const displayName = companyName || "Resume";
  const displayRole = jobTitle || "";

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-700 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
      aria-label={`View feedback for ${displayName}${displayRole ? ` | ${displayRole}` : ""}`}
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="!text-black font-bold break-words text-lg leading-snug">{displayName}</h2>
          {displayRole && (
            <p className="text-sm text-gray-500 break-words leading-snug">{displayRole}</p>
          )}
          {createdAt && <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore ?? 0} />
        </div>
      </div>

      {imageUrl && !imgError ? (
        <div className="gradient-border overflow-hidden animate-in fade-in duration-700 flex-1">
          <img
            src={imageUrl}
            alt={`Resume thumbnail for ${displayName}`}
            className="w-full h-[300px] max-sm:h-[180px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="gradient-border flex-1 flex items-center justify-center min-h-[200px]">
          <p className="text-sm text-gray-400">Preview unavailable</p>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
