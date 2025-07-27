/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {

            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

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

            doc.end()

        })

    } catch (error: any) {
        console.log(error);
        
        throw new AppError(401, `Pdf creation error ${error.message}`)
    }
} 


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