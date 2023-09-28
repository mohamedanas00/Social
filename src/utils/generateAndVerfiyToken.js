import jwt from 'jsonwebtoken'


export const generateToken = (payload = {}) => {
    const signature = process.env.TOKEN_SIGNATURE
    const expiresIn = Math.floor(Date.now() / 1000) + 5 * 60; //*Expires in (5 minute) 
    const token = jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) });
    return token
}

export const generateRefreshToken = (payload = {}) => {
    const signature = process.env.REFRESH_TOKEN_SIGNATURE
    const expiresIn = Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60; //*Expires in 6 months
    const token = jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) });
    return token
}

export const verifyToken = ({ token, signature = process.env.TOKEN_SIGNATURE } = {}) => {
    const decoded = jwt.verify(token, signature);
    return decoded
}