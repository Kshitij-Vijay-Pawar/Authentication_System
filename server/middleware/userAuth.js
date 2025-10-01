import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies.token; // Access the specific cookie named 'token'
    if (!token) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;  // Attach userId to request body
        } else {
            return res.status(401).json({success: false, message: 'Unauthorized'});
        }

        next();
    } catch (error) {
        return res.status(401).json({success: false, message: error.message});
    }
}

export default userAuth;