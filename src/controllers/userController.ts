import { Request, Response } from "express";
import { createUser, findUser, findUsers ,loginUser} from "../services/userServices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middlewares/verify";

export const create = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
};

export const find = async (req: Request, res: Response) => {
    try {
        const users = await findUsers({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await loginUser({ username: req.body.username });

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        const isvalidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isvalidPassword) {
            return res.status(404).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
};

export const me = async (req: Request, res: Response) =>{
    try{
        const user = await findUser({id: (req as CustomRequest).user.id});
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({error:String(error)});
    }
}
