import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            // Initialize req.body if it doesn't exist
            if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id;  // Attach userId to request body
        } else {
            return res.status(401).json({success: false, message: 'Unauthorized'});
        }

        next();
    } catch (error) {
        console.log("Auth Error:", error);
        return res.status(401).json({success: false, message: error.message});
    }
}

export default userAuth;