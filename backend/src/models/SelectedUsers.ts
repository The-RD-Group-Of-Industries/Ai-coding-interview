import mongoose from "mongoose";

export interface ISelectedUser extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  interviewId: mongoose.Types.ObjectId;
  selectedBy: mongoose.Types.ObjectId;
  selectedAt: Date;
}

const selectedUserSchema = new mongoose.Schema<ISelectedUser>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    selectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SelectedUser = mongoose.model<ISelectedUser>(
  "SelectedUser",
  selectedUserSchema
);

export default SelectedUser;
