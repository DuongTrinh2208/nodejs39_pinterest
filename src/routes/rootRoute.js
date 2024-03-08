import express from 'express';
import userRoute from './userRoute.js';
import imageRoute from './imageRoute.js';
const rootRoute = express.Router();

rootRoute.use("/user", userRoute);
rootRoute.use("/image", imageRoute);
export default rootRoute;