import { Router } from 'express';
import { createUserController, loginUserController } from '../controllers/userController';

export const userRouter = Router();

userRouter.post("/register", createUserController);
userRouter.post("/login", loginUserController);
