import { RequestHandler, Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import Joi from "joi";
import User from "../models/User";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

const otpDb: { [key: string]: { otp: string; expiresAt: number } } = {};

interface UserRegisterRequestBodyType {
  user: {
    email: string;
    password: string;
    username: string;
  };
}

export const register: RequestHandler = async (
  request: Request<
    ParamsDictionary,
    unknown,
    UserRegisterRequestBodyType,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const { email, password, username } = request.body.user;

    const userJoiSchema = Joi.object({
      username: Joi.string().alphanum().min(4).max(32).required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
    });

    const { error } = userJoiSchema.validate({ email, password, username });
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }

    const emailAlreadyExists = await User.findOne({ email: email });
    const usernameAlreadyExists = await User.findOne({
      username: username,
    });

    if (emailAlreadyExists) {
      return response.status(409).json({ message: "Email already exists" });
    }

    if (usernameAlreadyExists) {
      return response.status(409).json({ message: "Username already exists" });
    }

    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
      const userObj = {
        username: username,
        email: email,
        password: hashPassword,
      };

      await User.create(userObj);

      return response
        .status(201)
        .json({ message: "User registered successfully" });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error occurred while hashing password" });
    }
  } catch (catchedError) {
    nextFunction(catchedError);
  }
};

interface UserLoginRequestBodyType {
  user: {
    identifier: string;
    password: string;
  };
}

export const login: RequestHandler = async (
  request: Request<
    ParamsDictionary,
    unknown,
    UserLoginRequestBodyType,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const { identifier, password } = request.body.user;

    const userJoiSchema = Joi.object({
      password: Joi.string().min(6).required(),
      identifier: Joi.string().required(),
    });

    const { error } = userJoiSchema.validate({ identifier, password });
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }

    const userAccount = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!userAccount) {
      return response
        .status(404)
        .json({ message: "email or password is incorrect" });
    }

    const validPassword = await bcrypt.compare(password, userAccount.password);
    if (!validPassword) {
      return response
        .status(400)
        .json({ message: "email or password is incorrect" });
    }

    logger({
      email: userAccount.email,
      username: userAccount.username,
      id: userAccount._id,
    });

    return response.status(200).json({ user: userAccount.toUserResponse() });
  } catch (error) {
    nextFunction(error);
  }
};

interface SendEmailRequestBodyType {
  email: string;
}

export const sendEmail: RequestHandler = async (
  request: Request<
    ParamsDictionary,
    unknown,
    SendEmailRequestBodyType,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response.status(404).json({ message: "Account not found" });
    }

    const otp = otpGenerator.generate(6, { digits: true, specialChars: false });

    otpDb[email] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    response.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    nextFunction(error);
  }
};

interface verifyOTPAndUpdatePasswordType {
  password: string;
  otp: string;
  email: string;
}

export const verifyOTPAndUpdatePassword = async (
  request: Request<
    ParamsDictionary,
    unknown,
    verifyOTPAndUpdatePasswordType,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const { password, email, otp } = request.body;

    const otpData = otpDb[email];
    if (!otpData || otpData.expiresAt < Date.now()) {
      response.status(400).json({ message: "OTP expired or invalid." });
    } else if (otpData.otp === otp) {
      delete otpDb[email];

      const user = await User.findOne({ email: email });

      if (user) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }

      response.status(200).json({ message: "Password has been updated." });
    } else {
      response.status(400).json({ message: "OTP expired or invalid." });
    }
  } catch (error) {
    nextFunction(error);
  }
};
