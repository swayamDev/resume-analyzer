import { cn } from "~/utils";
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";

const InlineBadge = ({ score }: { score: number }) => {
  const isGood = score > 69;
  const isAverage = score > 39;

  return (
    <span
      className={cn("flex flex-row gap-1 items-center px-2 py-0.5 rounded-full text-xs font-medium", {
        "bg-badge-green text-badge-green-text": isGood,
        "bg-badge-yellow text-badge-yellow-text": !isGood && isAverage,
        "bg-badge-red text-badge-red-text": !isGood && !isAverage,
      })}
    >
      <img
        src={isGood ? "/icons/check.svg" : "/icons/warning.svg"}
        alt=""
        aria-hidden="true"
        className="size-3.5"
      />
      {score}/100
    </span>
  );
};

interface TipItemProps {
  tip: { type: "good" | "improve"; tip: string; explanation?: string };
  index: number;
}

const TipItem = ({ tip, index }: TipItemProps) => (
  <div
    key={index}
    className={cn("flex flex-col gap-1.5 rounded-xl p-4 border", {
      "bg-green-50 border-green-200 text-green-800": tip.type === "good",
      "bg-amber-50 border-amber-200 text-amber-800": tip.type === "improve",
    })}
  >
    <div className="flex items-start gap-2">
      <img
        src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
        alt={tip.type === "good" ? "Good" : "Improve"}
        className="size-4 mt-0.5 flex-shrink-0"
      />
      <p className="font-semibold text-sm leading-snug">{tip.tip}</p>
    </div>
    {tip.explanation && <p className="text-sm pl-6 leading-relaxed opacity-90">{tip.explanation}</p>}
  </div>
);

interface CategoryContentProps {
  tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
}

const CategoryContent = ({ tips }: CategoryContentProps) => (
  <div className="flex flex-col gap-3 w-full mt-1">
    {tips.map((tip, i) => (
      <TipItem key={`${i}-${tip.tip}`} tip={tip} index={i} />
    ))}
  </div>
);

interface DetailsProps {
  feedback: Feedback;
}

const Details = ({ feedback }: DetailsProps) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
    { id: "content", title: "Content", data: feedback.content },
    { id: "structure", title: "Structure", data: feedback.structure },
    { id: "skills", title: "Skills", data: feedback.skills },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      <Accordion defaultOpen="tone-style">
        {categories.map(({ id, title, data }) => (
          <AccordionItem key={id} id={id}>
            <AccordionHeader itemId={id}>
              <div className="flex flex-row gap-3 items-center py-1">
                <span className="text-lg font-semibold text-gray-800">{title}</span>
                <InlineBadge score={data.score} />
              </div>
            </AccordionHeader>
            <AccordionContent itemId={id}>
              <CategoryContent tips={data.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
