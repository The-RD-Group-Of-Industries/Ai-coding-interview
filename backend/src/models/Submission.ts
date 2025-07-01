import mongoose from "mongoose";

export interface ISubmittedInterviewSchema extends mongoose.Document {
  interviewId: mongoose.Types.ObjectId;
  attendedBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  jobTitle: string;
  responses: {
    questionId?: string;
    question: string;
    expectedAnswer?: string;
    userAnswer: string;
    isCorrect?: boolean;
  }[];
  numberOfQuestions: number;
  numberOfQuestionsAnswered: number;
  score?: number;
  completedAt: Date;
}

const submittedInterview = new mongoose.Schema<ISubmittedInterviewSchema>(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    attendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: { type: String, required: true },
    responses: [
      {
        questionId: { type: String },
        question: { type: String, required: true },
        expectedAnswer: { type: String },
        userAnswer: { type: String, required: true },
        isCorrect: { type: Boolean },
      },
    ],
    numberOfQuestions: { type: Number, required: true },
    numberOfQuestionsAnswered: { type: Number, required: true },
    score: { type: Number },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISubmittedInterviewSchema>(
  "SubmittedInterviews",
  submittedInterview
);
