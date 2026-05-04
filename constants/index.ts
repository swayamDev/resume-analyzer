export const AIResponseFormat = `
{
  "overallScore": number,
  "ATS": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": "string" }
    ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": "string", "explanation": "string" }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": "string", "explanation": "string" }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": "string", "explanation": "string" }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": "string", "explanation": "string" }
    ]
  }
}`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user improve their resume.
If available, use the job description for the job user is applying to in order to give more detailed feedback.
The job title is: ${jobTitle || "Not specified"}
The job description is: ${jobDescription || "Not specified"}

Provide the feedback using the following JSON format (return ONLY the JSON, no markdown, no backticks, no commentary):
${AIResponseFormat}`;

export const SCORE_THRESHOLDS = {
  GOOD: 70,
  AVERAGE: 49,
} as const;

export const getScoreLabel = (score: number): string => {
  if (score > SCORE_THRESHOLDS.GOOD) return "Strong";
  if (score > SCORE_THRESHOLDS.AVERAGE) return "Good Start";
  return "Needs Work";
};

export const getScoreVariant = (
  score: number
): "green" | "yellow" | "red" => {
  if (score > SCORE_THRESHOLDS.GOOD) return "green";
  if (score > SCORE_THRESHOLDS.AVERAGE) return "yellow";
  return "red";
};
