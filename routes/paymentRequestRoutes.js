import express from "express";
import paymentRequestModel from "../models/paymentRequestModel.js";

const router = express.Router();


// 📌 Create new payment request
router.post("/create", async (req,res) => {
  try{
    const data = req.body;

    const request = await paymentRequestModel.create({
      userId: data.userId,
      planId: data.planId,
      amount: data.amount,
      credits: data.credits,
      screenshot: data.screenshot,
    });

    res.json({
      success:true,
      message:"Payment request submitted. We will verify soon.",
      request
    });

  }catch(err){
    res.json({success:false, message:err.message});
  }
});


// 📌 Admin approves request
router.post("/approve", async (req,res)=>{

  try{
    const {requestId} = req.body;

    await paymentRequestModel.findByIdAndUpdate(requestId,{
      status:"approved"
    });

    res.json({success:true,message:"Approved"});
  }catch(err){
    res.json({success:false,message:err.message});
  }

});


// 📌 Admin rejects request
router.post("/reject", async (req,res)=>{

  try{
    const {requestId} = req.body;

    await paymentRequestModel.findByIdAndUpdate(requestId,{
      status:"rejected"
    });

    res.json({success:true,message:"Rejected"});
  }catch(err){
    res.json({success:false,message:err.message});
  }

});


export default router;
