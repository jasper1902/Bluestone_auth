import express, { Router } from "express";
import {
  login,
  register,
  sendEmail,
  verifyOTPAndUpdatePassword,
} from "../controllers/user";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sendemail", sendEmail);
router.post("/changepassword", verifyOTPAndUpdatePassword);

export default router;
