import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';


const router = Router();

const checkAuth = (...authRoles: string[]) => async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "You are not permitted to view this route!!")
        }

        next()

    } catch (error) {
        console.log(error)

        next(error)
    }
}


router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers);
router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser );

export const UserRoutes = router;
