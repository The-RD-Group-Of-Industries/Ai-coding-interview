import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

export const askGemini = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);

    if (error?.status === 429 && Array.isArray(error?.errorDetails)) {
      const retryInfo = error.errorDetails.find(
        (e: any) => e["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
      );

      const retryDelay = retryInfo?.retryDelay || "a few seconds";

      return `⏳ Too many requests. Please try again after ${retryDelay}.`;
    }

    return "❌ Something went wrong while contacting Gemini.";
  }
};

export const createPrompt = (
  topic: string,
  language: string,
  level: string,
  count: number
): string => {
  return `
You are an expert technical interviewer.

Generate ${count} coding interview questions on the topic "${topic}" using "${language}".
The difficulty should be "${level}".

🟨 Mix the types of questions:
- Some questions should be MCQ (with options and answer).
- Some should be open-ended coding questions (with expected answer/code).

⚠️ Output format (strict JSON):
[
  {
    "id": 1,
    "type": "mcq",
    "question": "What is programming language?",
    "options": ["nothing", "C++", "Computer language", "human language"],
    "answer": "Computer language"
  },
  {
    "id": 2,
    "type": "code",
    "question": "Write a function to reverse a string.",
    "answer": "function reverseString(str) { return str.split('').reverse().join(''); }"
  }
]

⚠️ Follow valid JSON format. No markdown, no backticks, no explanation.
`;
};

export const generateAIQuestions = async (
  count: number,
  topic: string,
  language: string,
  level: string
): Promise<
  { type: string; question: string; options?: string[]; answer?: string }[]
> => {
  const prompt = createPrompt(topic, language, level, count);
  const raw = await askGemini(prompt);

  try {
    if (!raw.trim().startsWith("[") && !raw.includes("question")) {
      console.warn("Non-JSON Gemini response:", raw);
      return [{ type: "error", question: raw }];
    }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => ({
        type: item.type || "code",
        question: item.question,
        options: item.type === "mcq" ? item.options || [] : undefined,
        answer: item.answer || "",
      }));
    } else {
      throw new Error("Gemini response is not an array.");
    }
  } catch (err) {
    console.error("Gemini Parse Error:", err);
    return [];
  }
};
