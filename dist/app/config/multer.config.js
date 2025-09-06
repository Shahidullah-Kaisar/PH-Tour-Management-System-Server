"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // empty space remove replace with dash
                .replace(/\./g, "-") //dot to dash(e.g. my.photo.jpg -> my-photo-jpg)
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$
            const extension = file.originalname.split(".").pop();
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension;
            return uniqueFileName;
        }
    }
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
/*
Math.random()	0 থেকে 1 এর মধ্যে র‍্যান্ডম দশমিক সংখ্যা (যেমন: 0.7548374)
.toString(36)	সেই সংখ্যা base-36 (0-9 + a-z) এ রূপান্তর করে (যেমন: "0.p3f45r")
.substring(2)	"0." বাদ দিয়ে শুধু র‍্যান্ডম অংশ নেয় (যেমন: "p3f45r")...first 2 ta index baad dia..
*/ 
