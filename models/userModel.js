import mongoose from "mongoose";
import transactionModel from "../models/transactionModel.js";


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creditBalance: { type: Number, default: 5 },
    isAdmin: { type:Boolean, default:false }


})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;