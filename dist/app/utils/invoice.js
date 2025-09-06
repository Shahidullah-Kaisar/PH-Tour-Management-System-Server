"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // === Header Section ===
            doc
                .fontSize(26)
                .fillColor("#333333")
                .text("INVOICE", { align: "center" });
            doc.moveDown(1);
            // === Customer Info & Invoice Details ===
            doc
                .fillColor("#000")
                .fontSize(14)
                .text(`Transaction ID: ${invoiceData.transactionId}`)
                .text(`Booking Date: ${invoiceData.bookingDate}`)
                .text(`Customer Name: ${invoiceData.userName}`);
            doc.moveDown();
            // === Tour Info ===
            doc
                .fontSize(16)
                .fillColor("#333333")
                .text("Booking Summary", { underline: true });
            doc
                .moveDown(0.5)
                .fontSize(13)
                .fillColor("#000000")
                .text(`Tour Title: ${invoiceData.tourTitle}`)
                .text(`Number of Guests: ${invoiceData.guestCount}`)
                .text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();
            // === Line Separator ===
            doc
                .strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            doc.moveDown();
            // === Footer Message ===
            doc
                .fontSize(12)
                .fillColor("#666666")
                .text("Thank you for booking with Travel Mate!", {
                align: "center",
                lineGap: 6,
            })
                .text("We hope you have a wonderful trip!", { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(401, `Pdf creation error ${error.message}`);
    }
});
exports.generatePdf = generatePdf;
/*
async function নিজে একটা Promise return করে। আর promise return korle await কাজ করে ।

কিন্তু function er ভেতরে যেসব কাজ async, সেগুলো Promise return করতে হয়, না হলে await কাজই করবে না।

প্রশ্ন: async function তো দিলাম, তাও new Promise কেন লাগলো?

pdfkit কোনো Promise দেয় না ! ওটা stream-based,
তাহলে await dia korle ব্যর্থ হবে — কারণ await শুধু সেই জিনিসেই কাজ করে যেটা Promise রিটার্ন করে।

🔁 তাই তোমাকে করতে হয়:

return new Promise((resolve, reject) => {
  // stream শেষ হলে resolve()
});


*/ 
