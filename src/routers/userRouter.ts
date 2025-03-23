import { Router } from 'express';
import { createUser, signUserIn } from '../controllers/userController';

export const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", signUserIn);
