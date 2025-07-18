/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

export const handleValidationError = (error: mongoose.Error.ValidationError): TGenericErrorResponse => {
    
    const errorSources: TErrorSources[] = []

    const errors = Object.values(error.errors) //Object.values(obj) একটা object-এর সব value গুলোকে array আকারে দেয়।
        
    errors.forEach( (errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))

    return {
        statusCode : 400,
        message : "Validation Error",
        errorSources
    }
      
}