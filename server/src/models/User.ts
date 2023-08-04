import mongoose, { Document, Model } from "mongoose";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
}

interface IUserMethods {
  toUserResponse(): Promise<ToUserResponse>;
  generateAccessToken(): string;
}

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    lowercase: true,
    minlength: 4,
    maxlength: 32,
    validate: {
      validator: (v: string) => /^[a-zA-Z0-9]+$/.test(v),
      message: (props) =>
        `${props.value} is not a valid username. Only alphanumeric characters are allowed.`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    index: true,
    match: [/^\S+@\S+.\S+$/, "is invalid"],
    trim: true,
    validate: {
      validator: (v: string) => /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.method(
  "generateAccessToken",
  function generateAccessToken(): string {
    if (!process.env.TOKEN || typeof process.env.TOKEN !== "string") {
      throw new Error("Token is not configured");
    }

    const token = jwt.sign(
      {
        user: {
          id: this._id,
          email: this.email,
        },
      },
      process.env.TOKEN,
      { expiresIn: "1d" }
    );
    return token;
  }
);

interface ToUserResponse {
  username: string;
  email: string;
  role: "admin" | "user";
  token: string;
}

userSchema.method("toUserResponse", function toUserResponse() {
  try {
    const token = this.generateAccessToken() as string;
    return {
      username: this.username,
      email: this.email,
      role: this.role,
      token: token,
    };
  } catch (error) {
    throw new Error("Failed to generate user response");
  }
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;

