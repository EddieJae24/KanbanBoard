import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  
  const secretKey = process.env.JWT_SECRET_KEY as string || '';
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return; // Add return statement here
    }
    req.user = user as JwtPayload;
    next();
  });

  return; // Add return statement here
  // TODO: verify the token exists and add the user data to the request object
};
