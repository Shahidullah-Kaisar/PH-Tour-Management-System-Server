import httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt"
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { userSearchableFields } from './user.constant';
import { QueryBuilder } from '../../utils/QueryBuilder';


const createUser = async (payload: Partial<IUser>) => {
  
    const { email, password, ...rest} = payload;

    await User.findOne({ email })

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT));

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string}

    const user = await User.create({
       email,
       password: hashedPassword,
       auths: [authProvider],
       ...rest
    })
    return user
}


const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)

    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

        const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id);

    return {
        data: user
    }
};


const updateUser = async (userId: string, payload: Partial<IUser>, decodeToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId)

    if(!ifUserExist){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if(payload.role){
        if(decodeToken.role === Role.USER || decodeToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
        if(payload.role === Role.SUPER_ADMIN && decodeToken.role === Role.ADMIN){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodeToken.role === Role.USER || decodeToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if(payload.password){
        payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT)
    }

    const newUpdateUser = await User.findByIdAndUpdate( userId, payload, { new: true, runValidators: true})

    return newUpdateUser;
}



export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser
}