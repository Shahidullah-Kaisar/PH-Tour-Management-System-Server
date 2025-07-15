/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { JwtPayload } from "jsonwebtoken"


const getAllUsers = catchAsync( async(req: Request, res: Response, next: NextFunction) => {

    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const createUser = catchAsync( async( req: Request, res: Response, next: NextFunction ) => {

   const user = await UserServices.createUser(req.body)

    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })
})

//previous rules for create user

// const createUser = async(req: Request, res: Response, next: NextFunction) => {

//     try {

//         const user = await UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: "User Created Successfully",
//             user
//         })

//     } catch (error: any) {
//         // eslint-disable-next-line no-console
//         console.log(error)
//         next(error)
//     }
// }

const updateUser = catchAsync( async( req: Request, res: Response, next: NextFunction ) => {

    const userId = req.params.id;
    const verifiedToken = req.user; //coming from checkAuth
    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse( res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user
    })
})


export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}