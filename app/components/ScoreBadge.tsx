import { cn } from "~/utils";
import { getScoreLabel, getScoreVariant } from "../../constants";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const variant = getScoreVariant(score);
  const label = getScoreLabel(score);

  return (
    <div
      className={cn("px-3 py-1 rounded-full text-sm font-medium", {
        "bg-badge-green text-badge-green-text": variant === "green",
        "bg-badge-yellow text-badge-yellow-text": variant === "yellow",
        "bg-badge-red text-badge-red-text": variant === "red",
      })}
      aria-label={`Score: ${label}`}
    >
      {label}
    </div>
  );
};

export default ScoreBadge;
