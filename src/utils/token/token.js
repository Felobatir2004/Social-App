import jwt from "jsonwebtoken"

// Generate Token
export const generateToken = ({ payload, signature, options = {} }) => {
    if (!signature) {
        throw new Error("Signature is required to generate a token");
    }
    return jwt.sign(payload, signature, options);
};

// Verify Token
export const verifyToken = ({ token, signature }) => {
    if (!signature) {
        throw new Error("Signature is required to verify the token");
    }
    if (!token) {
        throw new Error("Token is required to verify");
    }
    return jwt.verify(token, signature);
};
