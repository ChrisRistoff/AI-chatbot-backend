import { Router } from 'express';
import * as controllers from '../controllers/userController';

export const userRouter = Router();

userRouter.post("/register", controllers.createUserController);
userRouter.post("/login", controllers.loginUserController);
