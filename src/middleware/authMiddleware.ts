import { Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../auth/jwtService';
import { ExtendedRequest, DecodedToken } from '../types/MidldlewareTypes';
import { generateTokens } from '../auth/jwtService'; // Importe a função generateTokens

const authenticateToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization');

  if (!token) {
    console.error('Token não fornecido.');
    return res.status(401).send('Access denied.');
  }

  try {
    let decoded: DecodedToken;


    if (token.startsWith('Bearer ')) {
      const accessToken = token.slice(7);
      decoded = verifyAccessToken(accessToken) as DecodedToken;
    }
    else {
      decoded = verifyRefreshToken(token) as DecodedToken;

      const newTokens = generateTokens(decoded.userId);

      res.locals.newTokens = newTokens;
    }

    req.userId = decoded.userId;

    next();
  } catch (error: any) {
    res.status(400).send(`Token inválido. Detalhes: ${error.message}`);
  }
};

export { authenticateToken };
