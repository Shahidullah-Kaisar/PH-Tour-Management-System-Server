/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.service';
import { setAuthCookie } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import { createUserToken } from '../../utils/userToken';
import { envVars } from '../../config/env';

const credentialsLogin = catchAsync( async(req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body);


    setAuthCookie( res, loginInfo)

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

const getNewAccessToken = catchAsync( async(req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo)

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: null,
    })
})

const resetPassword = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodeToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodeToken as JwtPayload)

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed Successfully",
        data: null,
    })
})


const googleCallbackController = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
    let redirectTo = req.query.state ? req.query.state as string : ""

    if(redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;

    console.log(user)

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}