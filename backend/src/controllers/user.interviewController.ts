import User from "../models/User";
import Interview from "../models/InterviewTemplate";
import { Request, Response } from "express";
import Submission from "../models/Submission";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

//get interviews list
export const getAllInterviews = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch interviews where the logged-in user is assigned
    const interviews = await Interview.find({ assignedTo: userId }).populate(
      "createdBy",
      "name email"
    );

    if (!interviews.length) {
      res.status(200).json({
        titles: [],
        interviews: [],
        message: "No interviews assigned to you.",
      });
    }

    const interviewTitles = interviews.map((interview) => interview.name);
    res.status(200).json({ titles: interviewTitles, interviews });
  } catch (err) {
    console.error(
      "Error fetching assigned interviews:",
      (err as Error).message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
};

// lsit the questions
export const getInterviewQuestions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const { interviewId } = req.params;

  const interview = await Interview.findById(interviewId);

  if (!interview || interview.numberOfQuestions === 0)
    res.status(404).json({ message: "Interview questions not available" });

  const questions = interview?.questions;

  res
    .status(200)
    .json({ questionCount: interview?.numberOfQuestions, questions });
};

//Submitting interview
export const submitInterview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { interviewId } = req.params;

    const {
      responses,
    }: {
      responses: {
        questionId?: number;
        question: string;
        expectedAnswer?: string;
        userAnswer: string;
      }[];
    } = req.body;

    if (!userId || !interviewId || !responses || responses.length === 0) {
      res.status(400).json({ message: "Invalid submission data" });
      return;
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    const isAssigned = interview.assignedTo.some(
      (assignedId) => assignedId.toString() === userId
    );

    if (!isAssigned) {
      res
        .status(403)
        .json({ message: "You are not authorized to submit this interview" });
      return;
    }

    const newSubmission = await Submission.create({
      interviewId,
      attendedBy: userId,
      createdBy: interview.createdBy,
      jobTitle: interview.appliedFor,
      responses,
      numberOfQuestions: interview.questions.length,
      numberOfQuestionsAnswered: responses.length,
      completedAt: new Date(),
    });

    res.status(200).json({
      message: "Interview submitted successfully",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Interview submit error:", error);
    res
      .status(500)
      .json({ message: "Server error during interview submission" });
  }
};

//submitted interviews by the specific user

export const submittedInterviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if(!userId){
      res.status(401).json({message: "Unauthorized access"})
    }

    const interviews = await Submission.find({attendedBy: userId})

    if(interviews.length === 0){
      res.status(401).json({message: "No submitted interviews"})
    }

    res.status(200).json({message: interviews})
    
  } catch (err) {
    res.status(500).json({message: (err as Error).message})
  }
}

