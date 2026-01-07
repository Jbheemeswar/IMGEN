import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transactionModel from "../models/transactionModel.js";
//import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

export const createPaymentLink = async (req,res)=>{
  try{

    const { planId } = req.body;
    const userId = req.user.id;

    let amount = 0;
    let credits = 0;

    if(planId === "Basic"){ amount = 10; credits = 100; }
    if(planId === "Advanced"){ amount = 50; credits = 500; }
    if(planId === "Business"){ amount = 250; credits = 5000; }

    const link = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      description: `${credits} Credits`,
      customer: { name:"User", email:"test@gmail.com" },
      notify: { sms:false, email:true },
      callback_url: "http://localhost:5173/payment-success",
      callback_method: "get"
    });

    res.json({ success:true, url: link.short_url });

  }catch(err){
    res.json({ success:false, message:err.message });
  }
};



// ---------------- REGISTER ----------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success:false, message:"Missing fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hash
    });

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);

    res.json({ success:true, token, user:{name:user.name} });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


// ---------------- LOGIN ----------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.json({ success:false, message:"User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.json({ success:false, message:"Invalid password" });

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);

    res.json({ success:true, token, user:{name:user.name} });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


// ---------------- GET CREDITS ----------------
const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    res.json({
      success:true,
      credits:user.creditBalance,
      user:{name:user.name}
    });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


// ---------------- RAZORPAY INSTANCE ----------------
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET
// });


// ---------------- PAYMENT ----------------
const paymentRazorpay = async (req, res) => {
  try {

    const userId = req.user.id;
    const { planId } = req.body;

    let amount = 0, credits = 0, plan = "";

    switch (planId) {
      case "Basic": amount=10; credits=100; plan="Basic"; break;
      case "Advanced": amount=50; credits=500; plan="Advanced"; break;
      case "Business": amount=250; credits=5000; plan="Business"; break;
      default:
        return res.json({ success:false, message:"Invalid plan" });
    }

    const transaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date: Date.now()
    });

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: transaction._id.toString()
    });

    res.json({ success:true, order });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay
};
