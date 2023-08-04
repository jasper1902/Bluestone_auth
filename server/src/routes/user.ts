import express, { Router } from "express";
import { login, register, sendEmail } from "../controllers/user";
// import verifyJWT from "../middlewares/verifyJWT";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sendEmail", sendEmail);

export default router;
