import mongoose from "mongoose";

export interface IInterview extends mongoose.Document {
  createdBy: mongoose.Types.ObjectId; // Admin
  assignedTo: mongoose.Types.ObjectId[];
  name: string;
  appliedFor: string;
  description: string;
  difficultyLevel: string;
  skillSets: string[];
  focusStackArea: string;
  numberOfQuestions: number;
  questions: {
    question: string;
    options?: string[];
    answer?: string;
    source: "manual" | "ai";
  }[];

  codingLanguage: string;
  slug: string;
}

const interviewSchema = new mongoose.Schema<IInterview>(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    name: { type: String, required: true },
    appliedFor: { type: String, required: true },
    description: { type: String },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    skillSets: [{ type: String, required: true }],
    focusStackArea: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    questions: [
      {
        type: { type: String, enum: ["mcq", "code"], required: true },
        question: { type: String, required: true },
        options: [{ type: String }],
        answer: { type: String },
        source: { type: String, enum: ["manual", "ai"], required: true },
      },
    ],
    codingLanguage: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Interview = mongoose.model<IInterview>("Interview", interviewSchema);
export default Interview;
