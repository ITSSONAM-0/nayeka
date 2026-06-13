import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nayepankh_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

export default generateToken;
