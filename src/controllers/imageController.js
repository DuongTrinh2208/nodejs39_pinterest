import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { responseApi } from '../config/response.js';
import { dataToken } from '../config/jwt.js';
import { Op } from 'sequelize';

const model = initModels(sequelize);

const uploadImage = async (req, res) => {
    let {description, image_name} = req.body;
    let {token} = req.headers;

    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    if(checkEmail){
        // check valid user id
        if(checkEmail.dataValues.id !== tokenData.id){
            responseApi(res, 401, "Unauthorized!");
            return
        }
    }

    // generate random url
    let url = generateRandomURLString(image_name, 10);
    let newImage = {
        image_name,
        url,
        description,
        user_id: tokenData.id
    }

    let data = await model.image.create(newImage);
    responseApi(res, 200, data, `Upload new image success`);
}

const getImage = async (req, res) => {
    let {token} = req.headers;

    let tokenData = dataToken(token);
    let data = await model.image.findAll({
        where: {
            user_id: tokenData.id
        }
    });

    responseApi(res, 200, data, `Get Images success`);
}

const getImageByName = async (req, res) => {
    let {image_name} = req.params;
    let data = await model.image.findAll({
        where: {
            image_name: {
                [Op.like]: `%${image_name}%`
            }
        }
    });

    responseApi(res, 200, data, `Get Image By Name success`);
}

const getAllImage = async (req, res) => {
    let { page } = req.params;
    let pageSize = 1;
    let imageAmount = await model.image.count();
    let totalPage = Math.ceil(imageAmount / pageSize);
    let index = (page - 1) * pageSize;
    let data = await model.image.findAll({
        limit: pageSize,
        offset: index
    });
    responseApi(res, 200, {data, totalPage}, `Get Video Page ${page} Success`);
}

const getImageById = async (req, res) => {
    let {image_id} = req.params;
    let data = await model.image.findOne({
        where:{
            id: image_id
        },
        include: [{
            model: model.user,
            as: 'user',
            attributes: { exclude: ['password'] } // Exclude password field
        }]
    });

    responseApi(res, 200, data, `Success`);
}

const createComment = async (req, res) => {
    let {image_id, content} = req.body;
    let {token} = req.headers;

    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    // check valid user
    if(!checkEmail){
        responseApi(res, 401, "Unauthorized!");
        return
    };

    // check valid image
    let checkImage = await model.image.findOne({
        where: {
            id: image_id
        }
    });

    if(!checkImage){
        responseApi(res, 404, "NOT FOUND IMAGE TO CREATE COMMENT");
        return;
    }

    let newComment = {
        user_id: tokenData.id,
        image_id: image_id,
        comment_date: new Date(),
        content: content
    };

    await model.comment.create(newComment);
    responseApi(res, 200, "", "Create Comment success");
}

const getAllCommentsByImageId = async (req, res) => {
    let {image_id} = req.params;

     // check valid image
     let checkImage = await model.image.findOne({
        where: {
            id: image_id
        }
    });

    if(!checkImage){
        responseApi(res, 404, "NOT FOUND IMAGE ");
        return;
    }

    let data = await model.comment.findAll({
        where: {
            image_id
        }
    });

    responseApi(res, 200, data, "Success");
}

const createSaveImage = async (req, res) => {
    let {image_id} = req.body;
    let {token} = req.headers;

    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    // check valid user
    if(!checkEmail){
        responseApi(res, 401, "Unauthorized!");
        return
    };

    // check valid image
    let checkImage = await model.image.findOne({
        where: {
            id: image_id
        }
    });

    if(!checkImage){
        responseApi(res, 404, "NOT FOUND IMAGE TO CREATE COMMENT");
        return;
    }

    let checkSaveImage = await model.save_image.findOne({
        where: {
            user_id: tokenData.id,
            image_id
        }
    });

    if(checkSaveImage){
        responseApi(res, 400, "Already Save Image!");
        return;
    }

    let newSaveImage = {
        user_id: tokenData.id,
        image_id: image_id,
        save_date: new Date()
    };

    await model.save_image.create(newSaveImage);
    responseApi(res, 200, "", "Create Save Image success");
}

const getSaveImageByImageId = async (req, res) => {
    let {image_id} = req.params;
    let {token} = req.headers;
    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    // check valid user
    if(!checkEmail){
        responseApi(res, 401, "Unauthorized!");
        return
    };
    let checkSaveImage = await model.save_image.findOne({
        where: {
            user_id: tokenData.id,
            image_id
        }
    });
    responseApi(res, 200, checkSaveImage !== null, "Success");
}

const getSaveImageByUserId = async (req, res) => {
    let {token} = req.headers;
    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    // check valid user
    if(!checkEmail){
        responseApi(res, 401, "Unauthorized!");
        return
    };
    let data = await model.save_image.findAll({
        where: {
            user_id: tokenData.id,
        }
    });
    responseApi(res, 200, data, "Success");
}

const deleteImage = async (req, res) => {
    let {token} = req.headers;
    let {image_id} = req.params;
    let tokenData = dataToken(token);

    // check valid image
    let checkImage = await model.image.findOne({
        where: {
            id: image_id,
            user_id: tokenData.id
        }
    });

    if(!checkImage){
        responseApi(res, 404, "NOT FOUND IMAGE TO DELETE");
        return;
    }

    await model.image.destroy({
        where: {
            id: image_id
        }
    });

    responseApi(res, 200, "", "Delete success");
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
function generateRandomURLString(originalString, length) {
    // Replace any non-alphanumeric characters with ''
    const sanitizedString = originalString.replace(/[^a-z0-9]/gi, '');
    // Generate a random string from the sanitized string
    return generateRandomString(length);
}
  
export {
    uploadImage,
    getImage,
    getImageByName,
    getAllImage,
    getImageById,
    createComment,
    getAllCommentsByImageId,
    createSaveImage,
    getSaveImageByImageId,
    getSaveImageByUserId,
    deleteImage
}