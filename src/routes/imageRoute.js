import express from 'express';
import { uploadImage, getImage, getImageByName,
getAllImage, getImageById, createComment, getAllCommentsByImageId
, createSaveImage, getSaveImageByImageId, getSaveImageByUserId
, deleteImage } from '../controllers/imageController.js';
import { midVerifyToken } from '../config/jwt.js';

const imageRoute = express.Router();
imageRoute.post("/upload-image", midVerifyToken, uploadImage);
imageRoute.get("/get-image", midVerifyToken, getImage);
imageRoute.get("/get-image-by-name/:image_name", midVerifyToken, getImageByName);
imageRoute.get("/get-all-image/:page", getAllImage);
imageRoute.get("/get-image-by-id/:image_id", getImageById);
imageRoute.post("/create-comment", midVerifyToken, createComment);
imageRoute.get("/get-image-comments/:image_id", getAllCommentsByImageId);
imageRoute.post("/create-save-image", midVerifyToken, createSaveImage);
imageRoute.get("/get-save-image-by-image-id/:image_id", midVerifyToken, getSaveImageByImageId);
imageRoute.get("/get-save-image", midVerifyToken, getSaveImageByUserId);
imageRoute.delete("/delete-image/:image_id", midVerifyToken, deleteImage);
export default imageRoute