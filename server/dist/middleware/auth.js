import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    const secretKey = process.env.JWT_SECRET_KEY || '';
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return; // Add return statement here
        }
        req.user = user;
        next();
    });
    return; // Add return statement here
    // TODO: verify the token exists and add the user data to the request object
};
