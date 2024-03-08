import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { responseApi } from '../config/response.js';
import bcrypt from 'bcrypt';
import { createToken, dataToken } from '../config/jwt.js';

const model = initModels(sequelize);

const login = async (req, res) => {
    // check data

    let {email, password} = req.body;

    let checkEmail = await model.user.findOne({
        where: {
            email: email
        }
    });

    if(checkEmail){
        // compare to check password 
        if(bcrypt.compareSync(password, checkEmail.password)){
            // a token to represent the logged in user
            let token = createToken({
                id: checkEmail.dataValues.id,
                email: checkEmail.dataValues.email
            });


            responseApi(res, 200, token, "Login Success");
        }
        else
            responseApi(res, 400, "", "Password is incorrect");
    }else{
        responseApi(res, 400, "", "Email is incorrect");
    }
};

const signup = async (req, res) => {
    try{
        let { email, password, fullname, age, avatar } = req.body;
        // check duplicate email
        let checkEmail = await model.user.findOne({
            where: {
                email: email
            }
        });
        
        if(checkEmail){
            responseApi(res, 400, "", "Email already used");
            return;
        }
        // create data 
        let newUser = {
            email,
            password: bcrypt.hashSync(password, 10),
            fullname,
            age,
            avatar
        }
        await model.user.create(newUser);

        responseApi(res, 200, "", "Signup success");
    }catch(err){
        console.log(err);
        responseApi(res, 500, "", "Signup failed");
    }
};

const update = async (req, res) => {
    let {new_password, new_email, new_age, new_name,
    new_avatar} = req.body;
    let {token} = req.headers;

    let tokenData = dataToken(token);
    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    if(!checkEmail){
        responseApi(res, 401, "Unauthorized!");
        return
    };

    if(new_password === checkEmail.dataValues.password){
        responseApi(res, 400, "New Password must be different from old password!");
        return
    }

    let newUserData = {
        id: checkEmail.dataValues.id,
        password: bcrypt.hashSync(new_password, 10),
        email: new_email,
        age: new_age,
        fullname: new_name,
        avatar: new_avatar
    };

    await model.user.update(newUserData, {
        where: {
            id: checkEmail.dataValues.id
        }
    });

    responseApi(res, 200, "Update success");
}

const getUserInfo = async(req, res) => {
    let {token} = req.headers;
    let tokenData = dataToken(token);

    let checkEmail = await model.user.findOne({
        where: {
            email: tokenData.email
        }
    });

    if(!checkEmail){
        responseApi(res, 404, "", `Not found user with email: ${tokenData.email}`);
        return;
    }
    
    responseApi(res, 200, checkEmail.dataValues, `Success`);
}

export {
    login,
    signup,
    update,
    getUserInfo
};