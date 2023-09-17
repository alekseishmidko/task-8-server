import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    key: { type: Number, unique: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    role: {
      type: String,
      enum: ["active", "disabled"],
      default: "user",
    },
  },
  { timestamps: true }
);
export default mongoose.model("UsersModel", UserSchema);
