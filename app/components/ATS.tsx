interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const isGood = score > 69;
  const isAverage = score > 49;

  const gradientFrom = isGood ? "from-green-50" : isAverage ? "from-yellow-50" : "from-red-50";
  const iconSrc = isGood ? "/icons/ats-good.svg" : isAverage ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";
  const subtitle = isGood ? "Great Job!" : isAverage ? "Good Start" : "Needs Improvement";
  const subtitleColor = isGood ? "text-green-700" : isAverage ? "text-yellow-700" : "text-red-700";

  return (
    <section
      className={`bg-gradient-to-b ${gradientFrom} to-white rounded-2xl shadow-sm border border-gray-100 w-full p-6`}
      aria-label="ATS Score Analysis"
    >
      <div className="flex items-center gap-4 mb-5">
        <img src={iconSrc} alt="" aria-hidden="true" className="w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ATS Score | {score}/100</h2>
          <p className={`text-sm font-medium mt-0.5 ${subtitleColor}`}>{subtitle}</p>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-5">
        This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
      </p>

      {suggestions.length > 0 && (
        <ul className="space-y-3" aria-label="ATS suggestions">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <img
                src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={s.type === "good" ? "Good" : "Improve"}
                className="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <p className={s.type === "good" ? "text-green-700 text-sm" : "text-amber-700 text-sm"}>
                {s.tip}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="text-gray-500 text-xs italic mt-5">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </section>
  );
};

export default ATS;
