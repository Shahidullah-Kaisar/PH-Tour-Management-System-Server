/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt  from 'bcrypt';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken, createUserToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';


const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne( { email })

    if(! isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if(! isPasswordMatched ){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = createUserToken( isUserExist )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject(); // for removing password of isUserExist data


    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken( refreshToken )
    
    return {
        accessToken: newAccessToken,
    }

}

const resetPassword = async (oldPassword: string, newPassword: string, decodeToken: JwtPayload) => {

    const user = await User.findById(decodeToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);

    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match")
    }

    user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT))

    user!.save();
    
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}