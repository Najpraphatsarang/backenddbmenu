import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type CustomRequest = Request & {user:{id:number}};

export const verify = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const token = req.headers.authorization;

        if(!token) return res.status(401).send({message:"Not authorized"});
        const decode = jwt.verify(token, process.env.JWT_SECRET!);
        
        (req as CustomRequest).user = decode as any;
        next();
    }catch (error){
        res.status(401).send({message:"Invalid credential"});
    }
}