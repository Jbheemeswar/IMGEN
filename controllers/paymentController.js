import paymentRequestModel from "../models/paymentRequestModel.js";
import userModel from "../models/userModel.js";

export const submitPaymentProof = async (req,res)=>{
  try{

    const userId = req.user.id;
    const { planId } = req.body;
    const screenshot = req.file?.filename;

    if(!screenshot){
      return res.json({ success:false, message:"Screenshot required" });
    }

    let amount = 0;
    let credits = 0;

    if(planId==="Basic"){ amount=10; credits=100; }
    if(planId==="Advanced"){ amount=50; credits=500; }
    if(planId==="Business"){ amount=250; credits=5000; }

    await paymentRequestModel.create({
      userId,
      plan: planId,
      amount,
      credits,
      screenshot,
      status:"pending"
    });

    res.json({ success:true, message:"Payment submitted. Admin will verify soon." });

  }catch(err){
    res.json({ success:false, message:err.message });
  }
};



// ---------------- ADMIN APPROVES PAYMENT ----------------
export const approvePayment = async (req,res)=>{
  try{

    const { paymentId } = req.body;

    const payment = await paymentRequestModel.findById(paymentId);

    if(!payment) return res.json({ success:false, message:"Payment not found" });

    if(payment.status==="approved")
      return res.json({ success:false, message:"Already approved" });

    await userModel.findByIdAndUpdate(payment.userId,{
      $inc:{ creditBalance: payment.credits }
    });

    payment.status="approved";
    await payment.save();

    res.json({ success:true, message:"Payment approved & credits added" });

  }catch(err){
    res.json({ success:false, message:err.message });
  }
};
