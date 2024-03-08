import express from 'express';
import { login, signup, update, getUserInfo } from '../controllers/userController.js';
import { midVerifyToken } from '../config/jwt.js';

const userRoute = express.Router();
userRoute.post("/login", login);
userRoute.post("/signup", signup);
userRoute.put("/update", midVerifyToken, update);
userRoute.get("/info", midVerifyToken, getUserInfo);

export default userRoute;