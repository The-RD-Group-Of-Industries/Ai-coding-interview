import Interview from "../models/InterviewTemplate";
import { Request, Response } from "express";
import { generateAIQuestions } from "../utils/gemini";
import slugify from "slugify";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface InterviewDetails {
  name: string;
  appliedFor: string;
  description: string;
  difficultyLevel: string;
  skillSets: string[];
  focusStackArea: string;
  numberOfQuestions: number;
  questions: {
    question: string;
    answer?: string;
  }[];
  codingLanguage: string;
  slug?: string;
}

// creating new interview and based on the admin input, generates questions for the user
export const newInterview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    name,
    appliedFor,
    description,
    difficultyLevel,
    skillSets,
    focusStackArea,
    numberOfQuestions,
    questions,
    codingLanguage,
  } = req.body;

  const createdBy = req.user?.id;

  if (!createdBy) {
    res.status(403).json({ message: "Unauthorized access" });
    return;
  }

  if (
    !name ||
    !appliedFor ||
    !description ||
    !difficultyLevel ||
    !focusStackArea ||
    !codingLanguage ||
    !Array.isArray(skillSets) ||
    skillSets.length === 0 ||
    !Array.isArray(questions) ||
    !numberOfQuestions ||
    numberOfQuestions <= 0
  ) {
    res.status(400).json({ message: "All fields must be provided properly" });
    return;
  }

  const manualCount = questions.length;
  if (manualCount > numberOfQuestions) {
    res.status(400).json({ message: "Manual questions exceed total count" });
    return;
  }

  const aiCount = numberOfQuestions - manualCount;
  let aiQuestions: typeof questions = [];

  if (aiCount > 0) {
    try {
      aiQuestions = await generateAIQuestions(
        aiCount,
        focusStackArea,
        codingLanguage,
        difficultyLevel
      );

      aiQuestions = aiQuestions.map((q) => ({
        ...q,
        source: "ai",
      }));
    } catch (err) {
      console.error("AI question generation failed:", err);
      res.status(500).json({ message: "Failed to generate AI questions" });
      return;
    }
  }

  const taggedManualQuestions = questions.map((q) => ({
    ...q,
    source: "manual",
  }));

  const finalQuestions = [...taggedManualQuestions, ...aiQuestions];

  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let count = 1;
  while (await Interview.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  const finalQuestionsWithType = finalQuestions.map((q) => ({
    ...q,
    type: q.type || (q.options && q.options.length ? "mcq" : "code"),
  }));

  try {
    const interview = await Interview.create({
      createdBy,
      name,
      appliedFor,
      description,
      difficultyLevel,
      skillSets,
      focusStackArea,
      numberOfQuestions,
      questions: finalQuestionsWithType,
      codingLanguage,
      slug,
    });

    res
      .status(201)
      .json({ message: "Interview created successfully", interview });
  } catch (err) {
    console.error("Failed to create interview:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: (err as Error).message });
  }
};

// List all the created intervies
export const getAllInterviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviews = await Interview.find().populate(
      "createdBy",
      "name email"
    );
    res.status(200).json({ interviews: interviews });
  } catch (err) {
    console.error("Error fetching interviews:", (err as Error).message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

import mongoose, { Types } from "mongoose";
import Submission from "../models/Submission";
import SelectedUser from "../models/SelectedUsers";
import { sendRejectionEmail, sendSelectionEmail } from "../utils/sendEmail";

export const assignInterviewToUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const interviewId = req.params.interviewId;
  const { userIds } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    if (!userIds || !Array.isArray(userIds)) {
      res.status(400).json({ message: "Invalid userIds in request body" });
      return;
    }

    interview.assignedTo = userIds.map((id: string) => new Types.ObjectId(id));
    await interview.save();

    res.status(200).json({ message: "Interview assigned successfully" });
  } catch (error) {
    console.error("Error assigning interview:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//view all submitted interview
export const submittedInterviews = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized access" });
    }

    const interviews = await Submission.find({ createdBy: userId });

    if (interviews.length === 0) {
      res.status(401).json({ message: "No submitted interviews" });
    }

    res.status(200).json({ message: interviews });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

//selection user.
export const selectUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { interviewId } = req.body;
    const { attendedBy } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access" });
    }
    if (!interviewId || !attendedBy) {
      res
        .status(401)
        .json({ message: "Missing interview or attended user id" });
    }

    const selectedUser = await SelectedUser.create({
      userId: attendedBy,
      interviewId,
      selectedBy: userId,
    });

    const populatedUser = await SelectedUser.findById(selectedUser._id)
      .populate("userId", "name email") // This is the selected user
      .populate("interviewId", "appliedFor");

    if (!populatedUser) {
      res.status(404).json({ message: "Selected user not found" });
      return;
    }

    const toEmail = (populatedUser.userId as any).email;
    const name = (populatedUser.userId as any).name;
    const jobRole = (populatedUser.interviewId as any).appliedFor;

    await sendSelectionEmail(toEmail, name, jobRole);

    res.status(200).json({ message: "User selected", user: populatedUser });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

//Reject user
export const rejectUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.id;
    const { interviewId } = req.body;
    const { attendedBy } = req.params;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }

    if (!interviewId || !attendedBy) {
      res.status(400).json({ message: "Missing interview ID or user ID" });
      return;
    }

    const deleted = await SelectedUser.findOneAndDelete({
      userId: attendedBy,
      interviewId: interviewId,
    });

    if (!deleted) {
      res.status(404).json({ message: "User not found in selection list" });
      return;
    }

    const user = await User.findById(attendedBy);
    const interview = await Interview.findById(interviewId);

    if (user && interview) {
      const toEmail = user.email;
      const name = user.name;
      const jobRole = interview.appliedFor;

      await sendRejectionEmail(toEmail, name, jobRole);
    }

    res.status(200).json({
      message: "User has been rejected and removed from the selection list",
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
