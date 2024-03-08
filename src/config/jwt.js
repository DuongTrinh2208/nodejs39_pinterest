import jwt from 'jsonwebtoken';
import { responseApi } from './response.js';

// create token
// "secret_key" -> should be defined
export const createToken = (data) => 
    jwt.sign(data, "secret_key", {
        algorithm: "HS256",
        expiresIn: 300
});

// validate token
// invalidate token cases:
    // 1: incorrect secret_key
    // 2: expired token
    // 3: token with incorrect format, missing data, etc.
    // err == null -> valid token
    // err != null -> INvalid token);
export const validateToken = (token) => jwt.verify(token, "secret_key", (err, decode) => err);
       

// de-crypt token
export const dataToken = (token) => jwt.decode(token);

export const midVerifyToken = (req, res, next) => {
    let {token} = req.headers;
    
    if(validateToken(token) == null)
        next();
    else
        responseApi(res, 401, "", "Unauthorized to do request!");
}