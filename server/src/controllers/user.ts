import { RequestHandler, Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import Joi from "joi";
import User from "../models/User";
import bcrypt from "bcrypt";
// import { AuthRequest } from "../middlewares/verifyJWT";

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

      await User.create(userObj)

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

    return response.status(200).json({ user: userAccount.toUserResponse() });
  } catch (error) {
    nextFunction(error);
  }
};
