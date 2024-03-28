import { Request } from 'express';


export interface DecodedToken {
    userId: string;
  }
  
export  interface ExtendedRequest extends Request {
    userId?: string;
  }