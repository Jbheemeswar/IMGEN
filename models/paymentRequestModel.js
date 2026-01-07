import mongoose from "mongoose";


const paymentRequestSchema = new mongoose.Schema({
  userId: { type:String, required:true },
  planId: { type:String, required:true },
  amount: { type:Number, required:true },
  credits: { type:Number, required:true },
  screenshot: { type:String, required:true },   // base64 OR URL
  status: { type:String, default:"pending" },   // pending / approved / rejected
  date: { type:Date, default: Date.now }
});

const paymentRequestModel =
  mongoose.models.paymentrequest ||
  mongoose.model("paymentrequest", paymentRequestSchema);

export default paymentRequestModel;
