import dotenv from "dotenv"

dotenv.config();

interface EnvConfig {
    PORT:string,
    MONGO_URI: string,
    NODE_ENV: "development" | "production",
    JWT_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    BCRYPT_SALT: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "MONGO_URI", "NODE_ENV", "JWT_SECRET", "JWT_ACCESS_EXPIRES", "BCRYPT_SALT", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

    requiredEnvVariables.forEach((key) => {
        if(! process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })
    return {
        PORT:process.env.PORT as string,
        MONGO_URI: process.env.MONGO_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        BCRYPT_SALT: process.env.BCRYPT_SALT as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
    }
}

export const envVars = loadEnvVariables();



