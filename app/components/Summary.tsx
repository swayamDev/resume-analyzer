import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { cn } from "~/utils";

const CategoryRow = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 gap-4 border-t border-gray-50 first:border-0">
      <div className="flex flex-row gap-3 items-center">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="text-sm font-semibold">
        <span className={cn(textColor)}>{score}</span>
        <span className="text-gray-400">/100</span>
      </p>
    </div>
  );
};

interface SummaryProps {
  feedback: Feedback;
}

const Summary = ({ feedback }: SummaryProps) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
      <div className="flex flex-row items-center p-5 gap-6">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Resume Score</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Calculated from ATS compatibility, tone, content, structure, and skills.
          </p>
        </div>
      </div>
      <div className="bg-gray-50/60 px-2 pb-2">
        <CategoryRow title="Tone & Style" score={feedback.toneAndStyle.score} />
        <CategoryRow title="Content" score={feedback.content.score} />
        <CategoryRow title="Structure" score={feedback.structure.score} />
        <CategoryRow title="Skills" score={feedback.skills.score} />
      </div>
    </section>
  );
};

export default Summary;
